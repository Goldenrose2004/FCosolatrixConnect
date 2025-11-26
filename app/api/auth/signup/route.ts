import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import * as bcrypt from "bcryptjs"
import { invalidateAnalyticsCache } from "@/lib/analytics-cache"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, studentId, department, yearLevel } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !studentId || !department || !yearLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalized = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      studentId: String(studentId).trim(),
      department: String(department).trim(),
      yearLevel: String(yearLevel).trim(),
    }

    // Additional validation
    if (!/^[A-Za-z\s]+$/.test(normalized.firstName)) {
      return NextResponse.json({ error: "First name must contain only letters and spaces" }, { status: 400 })
    }
    if (!/^[A-Za-z\s]+$/.test(normalized.lastName)) {
      return NextResponse.json({ error: "Last name must contain only letters and spaces" }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalized.email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }
    if (normalized.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }
    if (!/^\d{8}$/.test(normalized.studentId)) {
      return NextResponse.json({ error: "Student ID must be exactly 8 digits" }, { status: 400 })
    }

    let db
    try {
      const dbResult = await connectToDatabase()
      db = dbResult.db
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        { error: "Signup service temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    // Check if user already exists
    let existingUser
    try {
      existingUser = await db.collection("users").findOne({
        $or: [{ email: normalized.email }, { studentId: normalized.studentId }],
      })
    } catch (queryError) {
      console.error("Database query error:", queryError)
      return NextResponse.json(
        { error: "Signup service temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "This email or Student ID is already registered." },
        { status: 409 }
      )
    }

    // Hash password using bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(normalized.password, saltRounds)

    // Create new user
    const newUser = {
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      email: normalized.email,
      password: hashedPassword,
      studentId: normalized.studentId,
      department: normalized.department,
      yearLevel: normalized.yearLevel,
      createdAt: new Date(),
      role: "user",
    }

    let result
    try {
      result = await db.collection("users").insertOne(newUser)
      invalidateAnalyticsCache()
    } catch (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json(
        { error: "Signup service temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        userId: result.insertedId,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Signup service temporarily unavailable. Please try again later." },
      { status: 500 }
    )
  }
}
