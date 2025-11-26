import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { invalidateAnalyticsCache } from "@/lib/analytics-cache"

// Department mapping: Dashboard codes -> Database values
const departmentMapping: Record<string, string[]> = {
  "ELEMENTARY": ["Elementary"],
  "JUNIOR HIGH": ["Junior High School"],
  "SENIOR HIGH": ["Senior High School"],
  "COLLEGE": ["College"],
}

// GET - Fetch violations
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const department = url.searchParams.get("department")
    const status = url.searchParams.get("status")
    const limit = parseInt(url.searchParams.get("limit") || "100")
    
    const query: any = {}
    
    if (userId) {
      query.userId = userId
    }
    
    if (department) {
      // Map dashboard department code to database department values
      // Build a comprehensive list of all possible department name variations
      const allPossibleDepartments: string[] = []
      
      // Add the department code itself
      allPossibleDepartments.push(department)
      
      // Add mapped values from departmentMapping
      const dbDepartments = departmentMapping[department]
      if (dbDepartments) {
        allPossibleDepartments.push(...dbDepartments)
      }
      
      // Add all possible variations for each department code
      if (department === "ELEMENTARY" || department.toUpperCase().includes("ELEMENTARY")) {
        allPossibleDepartments.push("Elementary", "elementary", "ELEMENTARY")
      }
      if (department === "JUNIOR HIGH" || department.toUpperCase().includes("JUNIOR")) {
        allPossibleDepartments.push("Junior High School", "Junior High", "junior high school", "JUNIOR HIGH SCHOOL", "JUNIOR HIGH")
      }
      if (department === "SENIOR HIGH" || department.toUpperCase().includes("SENIOR")) {
        allPossibleDepartments.push("Senior High School", "Senior High", "senior high school", "SENIOR HIGH SCHOOL", "SENIOR HIGH")
      }
      if (department === "COLLEGE" || department.toUpperCase().includes("COLLEGE")) {
        allPossibleDepartments.push("College", "college", "COLLEGE")
      }
      
      // Remove duplicates
      const uniqueDepartments = [...new Set(allPossibleDepartments)]
      
      query.studentDepartment = { $in: uniqueDepartments }
      console.log(`[API] Filtering violations by department: ${department} -> ${JSON.stringify(uniqueDepartments)}`)
    }
    
    console.log("Violations query:", JSON.stringify(query))
    
    if (status) {
      query.status = status
    }
    
    // Debug: Check all violations in database to see what department values exist
    if (department) {
      const allViolationsDebug = await db.collection("violations").find({}).toArray()
      console.log(`[API] Total violations in database: ${allViolationsDebug.length}`)
      if (allViolationsDebug.length > 0) {
        const uniqueDepartments = [...new Set(allViolationsDebug.map((v: any) => v.studentDepartment).filter(Boolean))]
        console.log(`[API] Unique studentDepartment values in database:`, uniqueDepartments)
        console.log(`[API] Sample violations:`, allViolationsDebug.slice(0, 5).map((v: any) => ({
          id: v._id.toString(),
          studentName: v.studentName,
          studentDepartment: v.studentDepartment,
          violation: v.violation
        })))
      }
    }

    const violations = await db
      .collection("violations")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    console.log(`[API] Query used:`, JSON.stringify(query, null, 2))
    console.log(`[API] Found ${violations.length} violations matching query`)
    if (violations.length > 0) {
      console.log(`[API] Matched violations:`, violations.map((v: any) => ({
        id: v._id.toString(),
        studentName: v.studentName,
        studentDepartment: v.studentDepartment,
        status: v.status
      })))
    } else if (department) {
      console.log(`[API] ⚠️ No violations found for department ${department}. Check if department names match.`)
    }

    // Format violations for frontend
    const formattedViolations = violations.map((violation) => ({
      id: violation._id.toString(),
      userId: violation.userId,
      studentId: violation.studentId,
      studentName: violation.studentName,
      studentDepartment: violation.studentDepartment || null,
      violation: violation.violation,
      violationType: violation.violationType || null,
      status: violation.status,
      managedBy: violation.managedBy || null,
      managedByName: violation.managedByName || "Admin",
      approverTitle: violation.approverTitle || null,
      createdAt: violation.createdAt ? new Date(violation.createdAt).toISOString() : new Date().toISOString(),
      resolvedAt: violation.resolvedAt ? new Date(violation.resolvedAt).toISOString() : null,
      notes: violation.notes || null,
      date: violation.createdAt
        ? new Date(violation.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      time: violation.createdAt
        ? new Date(violation.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
    }))

    return NextResponse.json({ ok: true, violations: formattedViolations }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching violations:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch violations" },
      { status: 500 }
    )
  }
}

// POST - Create new violation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, studentId, studentName, studentDepartment, violation, violationType, status, managedBy, managedByName, approverTitle, notes } = body

    if (!userId || !studentId || !studentName || !violation || !status || !managedBy) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: userId, studentId, studentName, violation, status, managedBy" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    const newViolation = {
      userId,
      studentId,
      studentName,
      studentDepartment: studentDepartment || null,
      violation: violation.trim(),
      violationType: violationType || null,
      status: status,
      managedBy,
      managedByName: managedByName || "Administrator",
      approverTitle: approverTitle || null,
      createdAt: new Date(),
      resolvedAt: null,
      notes: notes || null,
    }

    const result = await db.collection("violations").insertOne(newViolation)

    // Ensure analytics dashboard refreshes quickly
    invalidateAnalyticsCache()

    // Fetch the created violation
    const createdViolation = await db.collection("violations").findOne({
      _id: result.insertedId,
    })

    if (!createdViolation) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch created violation" },
        { status: 500 }
      )
    }

    // Format for response
    const formattedViolation = {
      id: createdViolation._id.toString(),
      userId: createdViolation.userId,
      studentId: createdViolation.studentId,
      studentName: createdViolation.studentName,
      studentDepartment: createdViolation.studentDepartment || null,
      violation: createdViolation.violation,
      violationType: createdViolation.violationType || null,
      status: createdViolation.status,
      managedBy: createdViolation.managedBy || null,
      managedByName: createdViolation.managedByName || "Admin",
      approverTitle: createdViolation.approverTitle || null,
      createdAt: createdViolation.createdAt ? new Date(createdViolation.createdAt).toISOString() : new Date().toISOString(),
      resolvedAt: null,
      notes: createdViolation.notes || null,
      date: createdViolation.createdAt
        ? new Date(createdViolation.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      time: createdViolation.createdAt
        ? new Date(createdViolation.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
    }

    return NextResponse.json(
      { ok: true, message: "Violation created successfully", violation: formattedViolation },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating violation:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to create violation" },
      { status: 500 }
    )
  }
}

