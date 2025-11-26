import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    // Fetch all users except admins (only regular users can be chatted with)
    const users = await db
      .collection("users")
      .find(
        { role: { $ne: "admin" } }, // Exclude admin users
        { projection: { password: 0 } } // Exclude password field
      )
      .sort({ firstName: 1, lastName: 1 }) // Sort alphabetically
      .toArray()

    // Consider users online if they were active within the last 5 minutes
    const ONLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
    const now = new Date()

    // Transform users to match AdminUserSummary type with online status
    const chatUsers = users.map((user) => {
      const lastActive = user.lastActive ? new Date(user.lastActive) : null
      const isOnline = lastActive
        ? now.getTime() - lastActive.getTime() < ONLINE_THRESHOLD_MS
        : false

      return {
        id: user._id.toString(),
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        department: user.department || "",
        email: user.email || "",
        studentId: user.studentId || "",
        yearLevel: user.yearLevel || "",
        section: user.section || null,
        strand: user.strand || null,
        course: user.course || null,
        profilePicture: user.profilePicture || null,
        profilePictureName: user.profilePictureName || null,
        isOnline,
        lastActive: lastActive?.toISOString() || null,
      }
    })

    return NextResponse.json({ ok: true, users: chatUsers }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching chat users:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch users" },
      { status: 500 }
    )
  }
}

