import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { invalidateAnalyticsCache } from "@/lib/analytics-cache"

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

    // Update the request status
    await db.collection("profileEditRequests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: reviewedBy || "admin",
        },
      }
    )

    // Update the user's profile with the edited profile data
    // Handle userId as either ObjectId or string
    let userQuery: any = {}
    if (ObjectId.isValid(requestDoc.userId)) {
      userQuery._id = new ObjectId(requestDoc.userId)
    } else {
      // If not a valid ObjectId, try to find by studentId
      userQuery.studentId = requestDoc.studentId
    }

    const updateResult = await db.collection("users").updateOne(
      userQuery,
      {
        $set: {
          firstName: requestDoc.editedProfile.firstName,
          lastName: requestDoc.editedProfile.lastName,
          email: requestDoc.editedProfile.email,
          section: requestDoc.editedProfile.section || null,
          strand: requestDoc.editedProfile.strand || null,
          course: requestDoc.editedProfile.course || null,
          yearLevel: requestDoc.editedProfile.yearLevel || null,
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "User not found in database" },
        { status: 404 }
      )
    }

    invalidateAnalyticsCache()

    // Fetch the updated user to return to frontend
    const updatedUser = await db.collection("users").findOne(userQuery, { projection: { password: 0 } })

    if (!updatedUser) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch updated user" },
        { status: 500 }
      )
    }

    // Format updated user data for frontend
    const userData = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      studentId: updatedUser.studentId,
      department: updatedUser.department,
      yearLevel: updatedUser.yearLevel || null,
      section: updatedUser.section || null,
      strand: updatedUser.strand || null,
      course: updatedUser.course || null,
      role: updatedUser.role || "user",
      profilePicture: updatedUser.profilePicture || null,
      profilePictureName: updatedUser.profilePictureName || null,
    }

    // Create notification for the user whose profile was approved
    try {
      const userId = requestDoc.userId
      await db.collection("notifications").insertOne({
        userId: userId,
        title: "Profile Update Approved",
        description: "Your profile edit request has been approved and your profile has been updated.",
        type: "profile_approval",
        createdAt: new Date(),
        read: false,
        readAt: null,
        relatedId: id,
        badgeColor: "#10B981",
      })
    } catch (notifError) {
      // Log error but don't fail the approval
      console.error("Error creating notification for profile approval:", notifError)
    }

    return NextResponse.json(
      { 
        ok: true, 
        message: "Profile edit request approved and user profile updated",
        updatedUser: userData
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error approving profile edit request:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to approve profile edit request" },
      { status: 500 }
    )
  }
}

