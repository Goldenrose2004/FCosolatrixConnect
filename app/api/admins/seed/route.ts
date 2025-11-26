import { type NextRequest, NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

type SeedResult = {
  email: string
  created: boolean
}

// Get admin credentials from environment variables (fallback to defaults for development)
const getAdminSeedData = () => [
  {
    firstName: "System",
    lastName: "Administrator",
    email: (process.env.ADMIN_EMAIL || "admin@consolatrix.edu").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@2025",
    studentId: "90000001",
    department: "Administration",
    yearLevel: "Administrator",
  },
]

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
    const adminsCollection = db.collection("admins")
    const usersCollection = db.collection("users")
    const results: SeedResult[] = []

    // Remove all existing admin accounts from both collections
    await adminsCollection.deleteMany({})
    await usersCollection.deleteMany({ role: "admin" })

    const adminSeedData = getAdminSeedData()
    for (const admin of adminSeedData) {
      const hashedPassword = await bcrypt.hash(admin.password, 10)
      await adminsCollection.insertOne({
        ...admin,
        email: admin.email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date(),
      })

      results.push({ email: admin.email.toLowerCase(), created: true })
    }

    const createdCount = results.filter((result) => result.created).length
    return NextResponse.json(
      {
        success: true,
        message: `${createdCount} admin account${createdCount === 1 ? "" : "s"} created.`,
        results,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[admin-seed] Failed to seed admins.", error)
    return NextResponse.json({ error: "Failed to seed admin accounts." }, { status: 500 })
  }
}

