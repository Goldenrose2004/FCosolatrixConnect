import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET latest message timestamp for each user (for showing last message time in user list)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get("adminId") || "admin"

    const db = await connectToDatabase().then((r) => r.db)

    // Get latest message for each user conversation
    const latestMessages = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            $or: [
              { senderId: adminId },
              { receiverId: adminId },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderId", adminId] },
                "$receiverId",
                "$senderId",
              ],
            },
            latestMessage: { $first: "$$ROOT" },
          },
        },
      ])
      .toArray()

    // Format response
    const timestamps: Record<string, string> = {}
    latestMessages.forEach((item) => {
      const userId = item._id
      const message = item.latestMessage
      if (message.createdAt) {
        const date = new Date(message.createdAt)
        timestamps[userId] = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      }
    })

    return NextResponse.json({ ok: true, timestamps }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching latest messages:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch latest messages" },
      { status: 500 }
    )
  }
}

