import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch pending profile edit requests (for admin)
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    
    const url = new URL(request.url)
    const status = url.searchParams.get("status") || "pending"
    
    const requests = await db
      .collection("profileEditRequests")
      .find({ status })
      .sort({ submittedAt: -1 })
      .toArray()

    // Convert MongoDB _id to string id for frontend
    const formattedRequests = requests.map((req) => ({
      id: req._id.toString(),
      userId: req.userId,
      studentId: req.studentId,
      studentName: req.studentName,
      studentDepartment: req.studentDepartment,
      studentYearLevel: req.studentYearLevel || null,
      currentProfile: req.currentProfile,
      editedProfile: req.editedProfile,
      status: req.status,
      submittedAt: req.submittedAt ? new Date(req.submittedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) : "",
      reviewedAt: req.reviewedAt || null,
      reviewedBy: req.reviewedBy || null,
    }))

    return NextResponse.json({ ok: true, requests: formattedRequests }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching profile edit requests:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch profile edit requests" },
      { status: 500 }
    )
  }
}

// POST - Submit a new profile edit request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentProfile, editedProfile } = body

    if (!userId || !currentProfile || !editedProfile) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Get user information - handle userId as either ObjectId or string
    let userQuery: any = {}
    if (ObjectId.isValid(userId)) {
      userQuery._id = new ObjectId(userId)
    } else {
      // If not a valid ObjectId, try to find by email or studentId
      userQuery = {
        $or: [
          { email: userId },
          { studentId: userId },
        ],
      }
    }

    const user = await db.collection("users").findOne(userQuery)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Check if there's already a pending request for this user
    const existingRequest = await db.collection("profileEditRequests").findOne({
      userId: user._id.toString(),
      status: "pending",
    })

    if (existingRequest) {
      // Update existing pending request
      await db.collection("profileEditRequests").updateOne(
        { _id: existingRequest._id },
        {
          $set: {
            currentProfile,
            editedProfile,
            submittedAt: new Date(),
          },
        }
      )

      // Create notifications for all admins about the updated profile edit request
      try {
        // Get admins from both collections
        const adminsFromAdmins = await db.collection("admins").find({}).toArray()
        const adminsFromUsers = await db.collection("users").find({ role: "admin" }).toArray()
        const allAdmins = [...adminsFromAdmins, ...adminsFromUsers]
        const notificationsToInsert: any[] = []
        const now = new Date()
        
        for (const admin of allAdmins) {
          notificationsToInsert.push({
            userId: admin._id.toString(),
            title: "Profile Edit Request Updated",
            description: `${user.firstName} ${user.lastName} (${user.studentId}) has updated their profile edit request.`,
            type: "other",
            createdAt: now,
            read: false,
            readAt: null,
            relatedId: existingRequest._id.toString(),
            badgeColor: "#F59E0B",
          })
        }
        
        if (notificationsToInsert.length > 0) {
          await db.collection("notifications").insertMany(notificationsToInsert)
        }
      } catch (notifError) {
        // Log error but don't fail the request update
        console.error("Error creating notifications for profile edit request update:", notifError)
      }

      return NextResponse.json(
        { ok: true, message: "Profile edit request updated", requestId: existingRequest._id.toString() },
        { status: 200 }
      )
    }

    // Create new request
    const newRequest = {
      userId: user._id.toString(),
      studentId: user.studentId,
      studentName: `${user.firstName} ${user.lastName}`,
      studentDepartment: user.department,
      studentYearLevel: user.yearLevel || null,
      currentProfile,
      editedProfile,
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    }

    const result = await db.collection("profileEditRequests").insertOne(newRequest)

    // Create notifications for all admins about the new profile edit request
    try {
      const adminsFromAdmins = await db.collection("admins").find({}).toArray()
      const adminsFromUsers = await db.collection("users").find({ role: "admin" }).toArray()
      const allAdmins = [...adminsFromAdmins, ...adminsFromUsers]

      const notificationsToInsert: any[] = []
      const now = new Date()
      
      for (const admin of allAdmins) {
        notificationsToInsert.push({
          userId: admin._id.toString(),
          title: "New Profile Edit Request",
          description: `${user.firstName} ${user.lastName} (${user.studentId}) has submitted a profile edit request for review.`,
          type: "other",
          createdAt: now,
          read: false,
          readAt: null,
          relatedId: result.insertedId.toString(),
          badgeColor: "#F59E0B",
        })
      }
      
      if (notificationsToInsert.length > 0) {
        await db.collection("notifications").insertMany(notificationsToInsert)
      }
    } catch (notifError) {
      // Log error but don't fail the request creation
      console.error("Error creating notifications for profile edit request:", notifError)
    }

    return NextResponse.json(
      { ok: true, message: "Profile edit request submitted", requestId: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error submitting profile edit request:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to submit profile edit request" },
      { status: 500 }
    )
  }
}

