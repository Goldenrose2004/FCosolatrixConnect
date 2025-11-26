import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { deleteImageFromImgDB, uploadImageToImgDB } from "@/lib/image-storage"

// PATCH - Update user profile picture
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
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { profilePicture, profilePictureName } = body

    if (!profilePicture) {
      return NextResponse.json(
        { ok: false, error: "Profile picture data is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Handle userId as either ObjectId or string
    let userQuery: any = {}
    let isAdmin = false
    if (ObjectId.isValid(id)) {
      userQuery._id = new ObjectId(id)
    } else {
      // If not a valid ObjectId, try to find by email or studentId
      userQuery = {
        $or: [
          { email: id },
          { studentId: id },
        ],
      }
    }

    // Check if it's an admin first
    const admin = await db.collection("admins").findOne(userQuery)
    if (admin) {
      isAdmin = true
    }

    // Upload image to the imgDB service before persisting
    const base64Payload = profilePicture.includes(",")
      ? profilePicture.split(",").pop()?.trim() ?? ""
      : profilePicture.trim()

    if (!base64Payload) {
      return NextResponse.json(
        { ok: false, error: "Invalid profile picture payload" },
        { status: 400 }
      )
    }

    const uploadName = profilePictureName || `avatar-${id}-${Date.now()}`
    const imageMeta = await uploadImageToImgDB(base64Payload, uploadName)

    // Update profile picture in appropriate collection
    const collection = isAdmin ? db.collection("admins") : db.collection("users")
    const updateResult = await collection.updateOne(
      userQuery,
      {
        $set: {
          profilePicture: imageMeta.displayUrl,
          profilePictureName: profilePictureName || null,
          profilePictureImageId: imageMeta.imageId,
          profilePictureDeleteHash: imageMeta.deleteHash,
          profilePictureMetadataSource: "imgbb",
          profilePictureUpdatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Fetch the updated user
    const updatedUser = await collection.findOne(userQuery, { projection: { password: 0 } })

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
      role: isAdmin ? "admin" : (updatedUser.role || "user"),
      profilePicture: updatedUser.profilePicture || null,
      profilePictureName: updatedUser.profilePictureName || null,
    }

    return NextResponse.json(
      { 
        ok: true, 
        message: "Profile picture updated successfully",
        user: userData
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating profile picture:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update profile picture" },
      { status: 500 }
    )
  }
}

// DELETE - Remove user profile picture
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
        { ok: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Handle userId as either ObjectId or string
    let userQuery: any = {}
    let isAdmin = false
    if (ObjectId.isValid(id)) {
      userQuery._id = new ObjectId(id)
    } else {
      // If not a valid ObjectId, try to find by email or studentId
      userQuery = {
        $or: [
          { email: id },
          { studentId: id },
        ],
      }
    }

    // Check if it's an admin first
    const admin = await db.collection("admins").findOne(userQuery)
    if (admin) {
      isAdmin = true
    }

    // Remove profile picture from appropriate collection
    const collection = isAdmin ? db.collection("admins") : db.collection("users")

    const existingDocument = await collection.findOne(userQuery, {
      projection: { profilePictureDeleteHash: 1 },
    })

    if (existingDocument?.profilePictureDeleteHash) {
      try {
        await deleteImageFromImgDB(existingDocument.profilePictureDeleteHash)
      } catch (error) {
        console.error("Error deleting profile picture from imgDB:", error)
      }
    }

    const updateResult = await collection.updateOne(
      userQuery,
      {
        $unset: {
          profilePicture: "",
          profilePictureName: "",
          profilePictureImageId: "",
          profilePictureDeleteHash: "",
          profilePictureMetadataSource: "",
        },
        $set: {
          profilePictureUpdatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Fetch the updated user
    const updatedUser = await collection.findOne(userQuery, { projection: { password: 0 } })

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
      role: isAdmin ? "admin" : (updatedUser.role || "user"),
      profilePicture: null,
      profilePictureName: null,
    }

    return NextResponse.json(
      { 
        ok: true, 
        message: "Profile picture removed successfully",
        user: userData
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error removing profile picture:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to remove profile picture" },
      { status: 500 }
    )
  }
}

