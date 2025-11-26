import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import * as bcrypt from "bcryptjs"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"
import { logAdminActivity } from "@/lib/admin-activity-log"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const normalizedPassword = String(password).trim()

    // Get IP address for rate limiting and logging
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"

    // Rate limiting for admin login attempts
    const rateLimitKey = `admin_login:${normalizedEmail}:${ipAddress}`
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

    if (!rateLimit.allowed) {
      await logAdminActivity(
        normalizedEmail,
        "login_rate_limit_exceeded",
        { ipAddress, attempts: 5 },
        ipAddress
      )
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    let db
    try {
      const dbResult = await connectToDatabase()
      db = dbResult.db
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        { error: "Login service temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    // Check admins collection first
    let admin = null
    try {
      admin = await db.collection("admins").findOne({ email: normalizedEmail })
    } catch (queryError) {
      console.error("Database query error:", queryError)
    }

    // If not found in admins, check users collection (for backward compatibility)
    let user = null
    if (!admin) {
      try {
        user = await db.collection("users").findOne({ email: normalizedEmail })
      } catch (queryError) {
        console.error("Database query error:", queryError)
        return NextResponse.json(
          { error: "Login service temporarily unavailable. Please try again later." },
          { status: 503 }
        )
      }
    }

    const account = admin || user

    // Generic error message for security - don't reveal if user exists or not
    if (!account) {
      await logAdminActivity(
        normalizedEmail,
        "login_failed_user_not_found",
        { ipAddress },
        ipAddress
      )
      return NextResponse.json(
        { error: "Invalid username or password. Please try again." },
        { status: 401 }
      )
    }

    // Check password using bcrypt (supports both hashed and plaintext for backward compatibility)
    const isPasswordValid = account.password.startsWith("$2")
      ? await bcrypt.compare(normalizedPassword, account.password)
      : account.password === normalizedPassword

    if (!isPasswordValid) {
      await logAdminActivity(
        account._id?.toString() || normalizedEmail,
        "login_failed_invalid_password",
        { ipAddress, isAdmin: !!admin },
        ipAddress
      )
      return NextResponse.json(
        { error: "Invalid username or password. Please try again." },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey)

    // Update lastActive on login
    if (admin) {
      await db.collection("admins").updateOne(
        { _id: admin._id },
        {
          $set: {
            lastActive: new Date(),
          },
        }
      )
      // Log successful admin login
      await logAdminActivity(
        admin._id.toString(),
        "login_success",
        { ipAddress },
        ipAddress
      )
    } else if (user) {
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            lastActive: new Date(),
          },
        }
      )
    }

    const accountData = admin || user
    return NextResponse.json(
      {
        success: true,
        user: {
          id: accountData._id.toString(),
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          studentId: accountData.studentId,
          department: accountData.department,
          yearLevel: accountData.yearLevel,
          role: admin ? "admin" : (user?.role ?? "user"),
          section: accountData.section || null,
          strand: accountData.strand || null,
          course: accountData.course || null,
          profilePicture: accountData.profilePicture || null,
          profilePictureName: accountData.profilePictureName || null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login service temporarily unavailable. Please try again later." },
      { status: 500 }
    )
  }
}
