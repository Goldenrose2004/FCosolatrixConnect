import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { findAdmin } from "@/lib/admin-helper"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = (url.searchParams.get("email") || "").trim().toLowerCase()
    const studentId = (url.searchParams.get("studentId") || "").trim()
    const role = url.searchParams.get("role") || ""

    const db = await connectToDatabase().then((r) => r.db)
    
    // If role is provided, find users by role
    if (role) {
      let users = []
      
      if (role === "admin") {
        // For admin role, check admins collection first, then users collection
        const admins = await db
          .collection("admins")
          .find({}, { projection: { password: 0 } })
          .toArray()
        
        const usersWithAdminRole = await db
          .collection("users")
          .find(
            { role: "admin" },
            { projection: { password: 0 } },
          )
          .toArray()
        
        users = [...admins, ...usersWithAdminRole]
      } else {
        users = await db
          .collection("users")
          .find(
            { role: role },
            { projection: { password: 0 } },
          )
          .toArray()
      }

      const formattedUsers = users.map((user) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        yearLevel: user.yearLevel || null,
        section: user.section || null,
        strand: user.strand || null,
        course: user.course || null,
        role: role === "admin" ? "admin" : (user.role || "user"),
        profilePicture: user.profilePicture || null,
        profilePictureName: user.profilePictureName || null,
      }))

      return NextResponse.json({ ok: true, users: formattedUsers }, { status: 200 })
    }

    // Otherwise, find by email or studentId
    if (!email && !studentId) {
      return NextResponse.json({ ok: false, error: "Provide email, studentId, or role" }, { status: 400 })
    }

    const user = await db
      .collection("users")
      .findOne(
        email ? { email } : { studentId },
        { projection: { password: 0 } },
      )

    if (!user) {
      return NextResponse.json({ ok: true, found: false }, { status: 200 })
    }

    return NextResponse.json({ ok: true, found: true, user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Failed to read user" }, { status: 500 })
  }
}


