import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 13+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Handle userId as either ObjectId or string
    let userQuery: any = {}
    if (ObjectId.isValid(id)) {
      userQuery._id = new ObjectId(id)
    } else {
      // If not a valid ObjectId, try to find by email or studentId
      userQuery = {
        $or: [
          { email: id },
          { studentId: id },
        ],
      }
    }

    const user = await db
      .collection("users")
      .findOne(userQuery, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Format user data for frontend
    const userData = {
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
      role: user.role || "user",
      profilePicture: user.profilePicture || null,
      profilePictureName: user.profilePictureName || null,
    }

    return NextResponse.json({ ok: true, user: userData }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch user" },
      { status: 500 }
    )
  }
}

