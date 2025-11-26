import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all announcements
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "100")
    const sort = url.searchParams.get("sort") || "desc" // "asc" or "desc"
    
    const sortOrder = sort === "asc" ? 1 : -1
    
    const announcements = await db
      .collection("announcements")
      .find({})
      .sort({ createdAt: sortOrder })
      .limit(limit)
      .toArray()

    // Format announcements for frontend
    const formattedAnnouncements = announcements.map((ann) => ({
      id: ann._id.toString(),
      title: ann.title,
      content: ann.content,
      createdAt: ann.createdAt ? new Date(ann.createdAt).toISOString() : new Date().toISOString(),
      createdBy: ann.createdBy || null,
      createdByName: ann.createdByName || "Admin",
      isImportant: ann.isImportant || false,
      date: ann.createdAt
        ? new Date(ann.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
      time: ann.createdAt
        ? new Date(ann.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      formattedDate: ann.createdAt
        ? new Date(ann.createdAt).toLocaleDateString("en-US", {
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

    return NextResponse.json({ ok: true, announcements: formattedAnnouncements }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}

// POST - Create new announcement(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { announcements, createdBy, createdByName } = body

    if (!announcements || !Array.isArray(announcements) || announcements.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Announcements array is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Validate and prepare announcements
    const validAnnouncements = announcements
      .filter((ann: any) => ann.title?.trim() && ann.content?.trim())
      .map((ann: any) => ({
        title: ann.title.trim(),
        content: ann.content.trim(),
        createdAt: new Date(),
        createdBy: createdBy || "admin",
        createdByName: createdByName || "Administrator",
        isImportant: ann.isImportant || false,
      }))

    if (validAnnouncements.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one valid announcement is required" },
        { status: 400 }
      )
    }

    // Insert announcements
    const result = await db.collection("announcements").insertMany(validAnnouncements)

    // Fetch the created announcements
    const createdIds = Object.values(result.insertedIds).map((id) => new ObjectId(id))
    const createdAnnouncements = await db
      .collection("announcements")
      .find({ _id: { $in: createdIds } })
      .toArray()

    const queueNotificationCreation = async () => {
      try {
        const allUsers = await db.collection("users").find({ role: { $ne: "admin" } }).toArray()
        
        if (!allUsers.length) {
          return
        }

        const notificationsToInsert: any[] = []
        const now = new Date()
        
        for (const announcement of createdAnnouncements) {
          for (const user of allUsers) {
            notificationsToInsert.push({
              userId: user._id.toString(),
              title: "New Announcement",
              description: announcement.isImportant 
                ? `🔔 Important: ${announcement.title}` 
                : announcement.title,
              type: "announcement",
              createdAt: now,
              read: false,
              readAt: null,
              relatedId: announcement._id.toString(),
              badgeColor: announcement.isImportant ? "#EF4444" : "#3B82F6",
            })
          }
        }
        
        if (notificationsToInsert.length > 0) {
          await db.collection("notifications").insertMany(notificationsToInsert)
        }
      } catch (notifError) {
        // Log error but don't fail the announcement creation
        console.error("Error creating notifications for announcements:", notifError)
      }
    }

    // Fire-and-forget so the API response can return immediately
    void queueNotificationCreation()

    // Format for response
    const formattedAnnouncements = createdAnnouncements.map((ann) => ({
      id: ann._id.toString(),
      title: ann.title,
      content: ann.content,
      createdAt: ann.createdAt ? new Date(ann.createdAt).toISOString() : new Date().toISOString(),
      createdBy: ann.createdBy || null,
      createdByName: ann.createdByName || "Admin",
      isImportant: ann.isImportant || false,
      date: ann.createdAt
        ? new Date(ann.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
      time: ann.createdAt
        ? new Date(ann.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      formattedDate: ann.createdAt
        ? new Date(ann.createdAt).toLocaleDateString("en-US", {
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

    return NextResponse.json(
      { ok: true, message: "Announcements created successfully", announcements: formattedAnnouncements },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating announcements:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to create announcements" },
      { status: 500 }
    )
  }
}

