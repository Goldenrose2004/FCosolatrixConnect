import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch notifications for a user
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const limit = parseInt(url.searchParams.get("limit") || "50")
    
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const notifications = await db
      .collection("notifications")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Format notifications for frontend
    const formattedNotifications = notifications.map((notif) => {
      const createdAt = notif.createdAt ? new Date(notif.createdAt) : new Date()
      const timeAgo = getTimeAgo(createdAt)
      
      return {
        id: notif._id.toString(),
        title: notif.title,
        description: notif.description,
        time: timeAgo,
        isNew: !notif.read,
        badgeColor: notif.badgeColor || "#3B82F6",
        type: notif.type,
        relatedId: notif.relatedId || null,
        createdAt: createdAt.toISOString(),
      }
    })

    return NextResponse.json({ ok: true, notifications: formattedNotifications }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds, markAll } = body

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    if (markAll) {
      // Mark all notifications as read for this user
      const result = await db.collection("notifications").updateMany(
        { userId, read: false },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        }
      )

      return NextResponse.json(
        { ok: true, updatedCount: result.modifiedCount },
        { status: 200 }
      )
    } else if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Mark specific notifications as read
      const objectIds = notificationIds
        .filter((id: string) => ObjectId.isValid(id))
        .map((id: string) => new ObjectId(id))

      if (objectIds.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Invalid notification IDs" },
          { status: 400 }
        )
      }

      const result = await db.collection("notifications").updateMany(
        { _id: { $in: objectIds }, userId },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        }
      )

      return NextResponse.json(
        { ok: true, updatedCount: result.modifiedCount },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { ok: false, error: "Either markAll or notificationIds array is required" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to mark notifications as read" },
      { status: 500 }
    )
  }
}

// DELETE - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds, deleteAll } = body

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    if (deleteAll) {
      // Delete all notifications for this user
      const result = await db.collection("notifications").deleteMany({ userId })

      return NextResponse.json(
        { ok: true, deletedCount: result.deletedCount },
        { status: 200 }
      )
    } else if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Delete specific notifications
      const objectIds = notificationIds
        .filter((id: string) => ObjectId.isValid(id))
        .map((id: string) => new ObjectId(id))

      if (objectIds.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Invalid notification IDs" },
          { status: 400 }
        )
      }

      const result = await db.collection("notifications").deleteMany({
        _id: { $in: objectIds },
        userId,
      })

      return NextResponse.json(
        { ok: true, deletedCount: result.deletedCount },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { ok: false, error: "Either deleteAll or notificationIds array is required" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Error deleting notifications:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to delete notifications" },
      { status: 500 }
    )
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths}mo ago`
}

