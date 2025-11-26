import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH - Update an announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 13+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Announcement ID is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid announcement ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, content, isImportant } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Title and content are required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Update the announcement
    const updateResult = await db.collection("announcements").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title.trim(),
          content: content.trim(),
          isImportant: isImportant || false,
          updatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Announcement not found" },
        { status: 404 }
      )
    }

    // Fetch the updated announcement
    const updatedAnnouncement = await db.collection("announcements").findOne({
      _id: new ObjectId(id),
    })

    if (!updatedAnnouncement) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch updated announcement" },
        { status: 500 }
      )
    }

    // Format for response
    const formattedAnnouncement = {
      id: updatedAnnouncement._id.toString(),
      title: updatedAnnouncement.title,
      content: updatedAnnouncement.content,
      createdAt: updatedAnnouncement.createdAt ? new Date(updatedAnnouncement.createdAt).toISOString() : new Date().toISOString(),
      createdBy: updatedAnnouncement.createdBy || null,
      createdByName: updatedAnnouncement.createdByName || "Admin",
      isImportant: updatedAnnouncement.isImportant || false,
      date: updatedAnnouncement.createdAt
        ? new Date(updatedAnnouncement.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
      time: updatedAnnouncement.createdAt
        ? new Date(updatedAnnouncement.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      formattedDate: updatedAnnouncement.createdAt
        ? new Date(updatedAnnouncement.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
    }

    return NextResponse.json(
      { ok: true, message: "Announcement updated successfully", announcement: formattedAnnouncement },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating announcement:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update announcement" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 13+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Announcement ID is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid announcement ID" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Delete the announcement
    const deleteResult = await db.collection("announcements").deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Announcement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { ok: true, message: "Announcement deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to delete announcement" },
      { status: 500 }
    )
  }
}

