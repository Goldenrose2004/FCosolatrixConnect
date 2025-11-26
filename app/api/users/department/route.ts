import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Department mapping: Dashboard codes -> Database values
const departmentMapping: Record<string, string[]> = {
  "ELEMENTARY": ["Elementary"],
  "JUNIOR HIGH": ["Junior High School"],
  "SENIOR HIGH": ["Senior High School"],
  "COLLEGE": ["College"],
}

// GET - Fetch users by department
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    const url = new URL(request.url)
    const department = url.searchParams.get("department")
    const search = url.searchParams.get("search") || ""
    
    const query: any = { role: { $ne: "admin" } } // Exclude admins
    
    if (department) {
      // Map dashboard department code to database department values
      const dbDepartments = departmentMapping[department]
      if (dbDepartments) {
        query.department = { $in: dbDepartments }
      } else {
        // Fallback: try direct match
        query.department = department
      }
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { yearLevel: { $regex: search, $options: "i" } },
      ]
    }
    
    const users = await db
      .collection("users")
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    // Format users for frontend
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      studentId: user.studentId || "",
      department: user.department || "",
      yearLevel: user.yearLevel || null,
      section: user.section || null,
      strand: user.strand || null,
      course: user.course || null,
      profilePicture: user.profilePicture || null,
      profilePictureName: user.profilePictureName || null,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      formattedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
    }))

    return NextResponse.json({ ok: true, users: formattedUsers }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching users by department:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch users" },
      { status: 500 }
    )
  }
}

