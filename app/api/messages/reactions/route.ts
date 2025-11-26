import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// POST: Add or remove a reaction to a message
export async function POST(request: NextRequest) {
  try {
    const { messageId, emoji, userId } = await request.json()

    if (!messageId || !emoji || !userId) {
      return NextResponse.json(
        { ok: false, error: "messageId, emoji, and userId are required" },
        { status: 400 }
      )
    }

    let db
    try {
      const dbResult = await connectToDatabase()
      db = dbResult.db
    } catch (dbError: any) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        { ok: false, error: "Database connection failed. Please try again later." },
        { status: 503 }
      )
    }

    // Validate ObjectId
    if (!ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid message ID" },
        { status: 400 }
      )
    }

    // Get the message
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
    })

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message not found" },
        { status: 404 }
      )
    }

    // Initialize reactions array if it doesn't exist
    const reactions = message.reactions || []

    // Remove any existing reaction from this user (user can only have one reaction at a time)
    const reactionsWithoutUser = reactions.filter(
      (r: any) => r.userId !== userId
    )

    // Check if user is clicking the same emoji they already have (toggle off)
    const existingSameReaction = reactions.find(
      (r: any) => r.userId === userId && r.emoji === emoji
    )

    let updatedReactions: any[]
    let isAddingReaction = false

    if (existingSameReaction) {
      // User clicked the same emoji - remove it (toggle off)
      updatedReactions = reactionsWithoutUser
    } else {
      // User clicked a different emoji - replace their old reaction with the new one
      updatedReactions = [...reactionsWithoutUser, { userId, emoji }]
      isAddingReaction = true
    }

    // Update the message with new reactions
    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          reactions: updatedReactions,
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Message not found" },
        { status: 404 }
      )
    }

    // Create notification for the message sender when someone reacts (only when adding, not removing)
    if (isAddingReaction && message.senderId !== userId) {
      try {
        // Get the reactor's name
        let reactorName = "Someone"
        if (userId === "admin") {
          reactorName = "Admin"
        } else if (ObjectId.isValid(userId)) {
          const reactor = await db.collection("users").findOne({
            _id: new ObjectId(userId),
          })
          if (reactor) {
            reactorName = `${reactor.firstName} ${reactor.lastName}`
          }
        }

        await db.collection("notifications").insertOne({
          userId: message.senderId,
          title: "Message Reacted",
          description: `${reactorName} reacted ${emoji} to your message: ${message.text.substring(0, 80)}${message.text.length > 80 ? "..." : ""}`,
          type: "message",
          createdAt: new Date(),
          read: false,
          readAt: null,
          relatedId: messageId,
          badgeColor: "#F59E0B",
        })
      } catch (notifError) {
        // Log error but don't fail the reaction update
        console.error("Error creating notification for reaction:", notifError)
      }
    }

    return NextResponse.json(
      {
        ok: true,
        reactions: updatedReactions,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating reaction:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update reaction" },
      { status: 500 }
    )
  }
}

