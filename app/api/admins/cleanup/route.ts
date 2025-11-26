import { type NextRequest, NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  const seedToken = process.env.ADMIN_SEED_TOKEN

  if (!seedToken) {
    return NextResponse.json(
      {
        error: "ADMIN_SEED_TOKEN environment variable is not configured.",
      },
      { status: 500 },
    )
  }

  const providedToken = request.headers.get("x-seed-token")
  if (providedToken !== seedToken) {
    return NextResponse.json({ error: "Unauthorized request." }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection("users")

    // Target admin account (from environment variables or defaults)
    const targetAdmin = {
      firstName: "System",
      lastName: "Administrator",
      email: (process.env.ADMIN_EMAIL || "admin@consolatrix.edu").toLowerCase(),
      password: process.env.ADMIN_PASSWORD || "Admin@2025",
      studentId: "90000001",
      department: "Administration",
      yearLevel: "Administrator",
    }

    const adminsCollection = db.collection("admins")
    const usersCollection = db.collection("users")

    // Delete all existing admin accounts from both collections
    const deleteResultAdmins = await adminsCollection.deleteMany({})
    const deleteResultUsers = await usersCollection.deleteMany({ role: "admin" })
    const totalDeleted = deleteResultAdmins.deletedCount + deleteResultUsers.deletedCount
    
    // Create the single admin account with lowercase email
    const hashedPassword = await bcrypt.hash(targetAdmin.password, 10)
    await adminsCollection.insertOne({
      ...targetAdmin,
      email: targetAdmin.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: `Removed ${totalDeleted} admin account(s) and created single admin account.`,
        adminEmail: targetAdmin.email,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[admin-cleanup] Failed to cleanup admins.", error)
    return NextResponse.json({ error: "Failed to cleanup admin accounts." }, { status: 500 })
  }
}

