import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getAdminId } from "@/lib/admin-helper"

// GET unread message counts for each user (from admin's perspective)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get("adminId") || "admin"

    const db = await connectToDatabase().then((r) => r.db)

    // Find actual admin ID if needed
    let actualAdminId = adminId
    if (!actualAdminId || actualAdminId === "admin") {
      actualAdminId = await getAdminId(db)
    }

    // Get unread message counts for each user
    // Unread messages are those sent by users to admin that haven't been read
    const unreadCounts = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { receiverId: actualAdminId },
                  { receiverId: "admin" },
                ],
              },
              { senderId: { $ne: actualAdminId } },
              { senderId: { $ne: "admin" } },
              { read: false },
            ],
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
            latestMessageTime: { $max: "$createdAt" },
          },
        },
        {
          $sort: { latestMessageTime: -1 }, // Sort by most recent message first
        },
      ])
      .toArray()

    // Also check for messages with receiverId "admin" (backward compatibility)
    const unreadCountsAdmin = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            receiverId: "admin",
            senderId: { $ne: "admin" },
            read: false,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
            latestMessageTime: { $max: "$createdAt" },
          },
        },
        {
          $sort: { latestMessageTime: -1 },
        },
      ])
      .toArray()

    // Merge the results, combining counts for the same user
    const countsMap: Record<string, { count: number; latestMessageTime: Date | null }> = {}

    unreadCounts.forEach((item) => {
      const userId = item._id
      if (!countsMap[userId]) {
        countsMap[userId] = { count: 0, latestMessageTime: null }
      }
      countsMap[userId].count += item.count
      if (!countsMap[userId].latestMessageTime || (item.latestMessageTime && new Date(item.latestMessageTime) > new Date(countsMap[userId].latestMessageTime!))) {
        countsMap[userId].latestMessageTime = item.latestMessageTime
      }
    })

    unreadCountsAdmin.forEach((item) => {
      const userId = item._id
      if (!countsMap[userId]) {
        countsMap[userId] = { count: 0, latestMessageTime: null }
      }
      countsMap[userId].count += item.count
      if (!countsMap[userId].latestMessageTime || (item.latestMessageTime && new Date(item.latestMessageTime) > new Date(countsMap[userId].latestMessageTime!))) {
        countsMap[userId].latestMessageTime = item.latestMessageTime
      }
    })

    // Convert to the format expected by the frontend
    const result: Record<string, number> = {}
    Object.keys(countsMap).forEach((userId) => {
      result[userId] = countsMap[userId].count
    })

    return NextResponse.json({ ok: true, unreadCounts: result }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching unread counts:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch unread counts" },
      { status: 500 }
    )
  }
}

