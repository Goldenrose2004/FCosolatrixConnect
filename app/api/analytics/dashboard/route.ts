import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getCachedAnalytics, setAnalyticsCache } from "@/lib/analytics-cache"

const DEPARTMENT_LABELS: Record<string, string> = {
  "ELEMENTARY": "Elementary",
  "JUNIOR HIGH": "Junior High",
  "SENIOR HIGH": "Senior High",
  "COLLEGE": "College",
}

const DEPARTMENT_ALIASES: Record<string, string[]> = {
  "ELEMENTARY": ["ELEMENTARY", "ELEMENTARY DEPARTMENT"],
  "JUNIOR HIGH": ["JUNIOR HIGH", "JUNIOR HIGH SCHOOL"],
  "SENIOR HIGH": ["SENIOR HIGH", "SENIOR HIGH SCHOOL"],
  "COLLEGE": ["COLLEGE", "COLLEGE DEPARTMENT"],
}

const VIOLATION_COLORS: Record<string, string> = {
  Attendance: "#2563eb",
  Behavior: "#8B5CF6",
  Uniform: "#3B82F6",
  Academic: "#10B981",
  Others: "#6B7280",
}

const DEPARTMENT_KEYS = Object.keys(DEPARTMENT_LABELS)

function normalizeDepartmentValue(value?: string | null) {
  if (!value) return null
  const upperValue = value.toUpperCase()
  for (const key of DEPARTMENT_KEYS) {
    const aliases = DEPARTMENT_ALIASES[key]
    if (aliases.some((alias) => upperValue.includes(alias))) {
      return key
    }
  }
  return null
}

export async function GET() {
  const cached = getCachedAnalytics()
  if (cached) {
    return NextResponse.json({ ok: true, cached: true, ...cached })
  }

  const db = await connectToDatabase().then((r) => r.db)

  // Build reusable aggregation switch for Mongo pipeline (server-side normalization)
  const departmentBranches = DEPARTMENT_KEYS.map((key) => ({
    case: {
      $in: [
        { $toUpper: { $ifNull: ["$department", ""] } },
        DEPARTMENT_ALIASES[key],
      ],
    },
    then: key,
  }))

  const violationDepartmentBranches = DEPARTMENT_KEYS.map((key) => ({
    case: {
      $in: [
        { $toUpper: { $ifNull: ["$studentDepartment", ""] } },
        DEPARTMENT_ALIASES[key],
      ],
    },
    then: key,
  }))

  const [
    userAggregation,
    violationUsersAggregation,
    violationTypeAggregation,
    topViolatorsAggregation,
  ] = await Promise.all([
    db
      .collection("users")
      .aggregate([
        { $match: { role: { $ne: "admin" } } },
        {
          $set: {
            normalizedDepartment: {
              $switch: {
                branches: departmentBranches,
                default: null,
              },
            },
          },
        },
        { $match: { normalizedDepartment: { $ne: null } } },
        {
          $group: {
            _id: "$normalizedDepartment",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    db
      .collection("violations")
      .aggregate([
        {
          $set: {
            normalizedDepartment: {
              $switch: {
                branches: violationDepartmentBranches,
                default: null,
              },
            },
          },
        },
        { $match: { normalizedDepartment: { $ne: null } } },
        {
          $group: {
            _id: {
              department: "$normalizedDepartment",
              userId: "$userId",
            },
          },
        },
        {
          $group: {
            _id: "$_id.department",
            usersWithViolations: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    db
      .collection("violations")
      .aggregate([
        {
          $project: {
            violationType: {
              $cond: [{ $ifNull: ["$violationType", false] }, "$violationType", "Others"],
            },
          },
        },
        {
          $group: {
            _id: "$violationType",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    db
      .collection("violations")
      .aggregate([
        {
          $group: {
            _id: "$userId",
            count: { $sum: 1 },
            studentName: { $last: "$studentName" },
            studentId: { $last: "$studentId" },
            studentDepartment: { $last: "$studentDepartment" },
          },
        },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1, studentName: 1 } },
        { $limit: 5 },
      ])
      .toArray(),
  ])

  const metricsMap: Record<
    string,
    { department: string; label: string; count: number }
  > = {}
  DEPARTMENT_KEYS.forEach((key) => {
    metricsMap[key] = {
      department: key,
      label: DEPARTMENT_LABELS[key],
      count: 0,
    }
  })
  userAggregation.forEach((entry) => {
    if (entry._id && metricsMap[entry._id]) {
      metricsMap[entry._id].count = entry.count
    }
  })
  const metrics = DEPARTMENT_KEYS.map((key) => metricsMap[key])

  const registeredStudents = metrics.map((metric) => ({
    department: metric.label,
    students: metric.count,
  }))

  const violationLookup = violationUsersAggregation.reduce<Record<string, number>>((acc, entry) => {
    if (entry._id) {
      acc[entry._id] = entry.usersWithViolations
    }
    return acc
  }, {})

  const violationPerDepartment = metrics.map((metric) => {
    const violations = violationLookup[metric.department] || 0
    const noViolations = Math.max(metric.count - violations, 0)
    return {
      department: metric.label,
      violations,
      noViolations,
    }
  })

  const violationBreakdown = violationTypeAggregation.map((entry) => {
    const name = entry._id || "Others"
    return {
      name,
      value: entry.count,
      fill: VIOLATION_COLORS[name as keyof typeof VIOLATION_COLORS] || VIOLATION_COLORS.Others,
    }
  })

  const topViolators = topViolatorsAggregation.map((entry) => {
    const department = normalizeDepartmentValue(entry.studentDepartment) || "COLLEGE"
    return {
      studentId: entry.studentId || "",
      name: entry.studentName || "Unknown Student",
      department: DEPARTMENT_LABELS[department] || department,
      count: entry.count || 0,
    }
  })

  const payload = {
    metrics,
    registeredStudents,
    violationPerDepartment,
    violationBreakdown,
    topViolators,
    generatedAt: new Date().toISOString(),
  }

  setAnalyticsCache(payload)

  return NextResponse.json({ ok: true, cached: false, ...payload })
}

