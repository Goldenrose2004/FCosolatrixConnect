import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Update user's last active timestamp
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ ok: false, error: "User ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Try to find user by _id (ObjectId) or by email/studentId as fallback
    let query: any = {}
    if (ObjectId.isValid(userId)) {
      query._id = new ObjectId(userId)
    } else {
      // If not a valid ObjectId, try email or studentId
      query = {
        $or: [
          { email: userId },
          { studentId: userId }
        ]
      }
    }

    // Update user's lastActive timestamp
    const result = await db.collection("users").updateOne(
      query,
      {
        $set: {
          lastActive: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating user presence:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update presence" },
      { status: 500 }
    )
  }
}

