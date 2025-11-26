import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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
        { ok: false, error: "Request ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { reviewedBy } = body

    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id)
      return NextResponse.json(
        { ok: false, error: `Invalid request ID: ${id}` },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Find the request
    const requestDoc = await db.collection("profileEditRequests").findOne({
      _id: new ObjectId(id),
    })

    if (!requestDoc) {
      return NextResponse.json(
        { ok: false, error: "Profile edit request not found" },
        { status: 404 }
      )
    }

    if (requestDoc.status !== "pending") {
      return NextResponse.json(
        { ok: false, error: "Request has already been processed" },
        { status: 400 }
      )
    }

    // Update the request status to rejected
    await db.collection("profileEditRequests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedBy: reviewedBy || "admin",
        },
      }
    )

    // Create notification for the user whose profile edit request was rejected
    try {
      const userId = requestDoc.userId
      await db.collection("notifications").insertOne({
        userId: userId,
        title: "Profile Update Rejected",
        description: "Your profile edit request has been rejected. Please review your changes and submit again if needed.",
        type: "profile_rejection",
        createdAt: new Date(),
        read: false,
        readAt: null,
        relatedId: id,
        badgeColor: "#EF4444",
      })
    } catch (notifError) {
      // Log error but don't fail the rejection
      console.error("Error creating notification for profile rejection:", notifError)
    }

    return NextResponse.json(
      { ok: true, message: "Profile edit request rejected" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error rejecting profile edit request:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to reject profile edit request" },
      { status: 500 }
    )
  }
}

