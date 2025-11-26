import { MongoClient, type Db } from "mongodb"
import * as bcrypt from "bcryptjs"

const MONGODB_DB = process.env.MONGODB_DB || "consolatrix_db"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

// Get admin credentials from environment variables (fallback to defaults for development)
const getDefaultAdminAccount = () => ({
  firstName: "System",
  lastName: "Administrator",
  email: (process.env.ADMIN_EMAIL || "admin@consolatrix.edu").toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "Admin@2025",
  studentId: "90000001",
  department: "Administration",
  yearLevel: "Administrator",
  role: "admin",
})

async function ensureDefaultAdmins(db: Db) {
  const adminsCollection = db.collection("admins")
  const usersCollection = db.collection("users")

  // Migrate any existing admin accounts from users collection to admins collection
  const existingAdminsInUsers = await usersCollection.find({ role: "admin" }).toArray()
  if (existingAdminsInUsers.length > 0) {
    for (const admin of existingAdminsInUsers) {
      // Check if admin already exists in admins collection
      const existing = await adminsCollection.findOne({ email: admin.email?.toLowerCase() })
      if (!existing) {
        await adminsCollection.insertOne({
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email?.toLowerCase(),
          password: admin.password,
          studentId: admin.studentId,
          department: admin.department,
          yearLevel: admin.yearLevel,
          createdAt: admin.createdAt || new Date(),
          lastActive: admin.lastActive || null,
          profilePicture: admin.profilePicture || null,
          profilePictureName: admin.profilePictureName || null,
        })
      }
    }
    // Remove admins from users collection
    await usersCollection.deleteMany({ role: "admin" })
  }

  // Ensure the single admin account exists with correct password
  const admin = getDefaultAdminAccount()
  const normalizedEmail = admin.email.toLowerCase()
  
  // Use case-insensitive lookup to find existing admin
  const existing = await adminsCollection.findOne({ 
    email: { $regex: new RegExp(`^${admin.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
  })
  
  const hashedPassword = await bcrypt.hash(admin.password, 10)
  
  // Delete all admin accounts except the one we found (if any)
  if (existing) {
    await adminsCollection.deleteMany({ 
      _id: { $ne: existing._id }
    })
    
    // Update the existing admin account to use lowercase email and correct password
    await adminsCollection.updateOne(
      { _id: existing._id },
      { 
        $set: { 
          email: normalizedEmail,
          password: hashedPassword,
          firstName: admin.firstName,
          lastName: admin.lastName,
          studentId: admin.studentId,
          department: admin.department,
          yearLevel: admin.yearLevel,
        } 
      }
    )
    return
  }

  // If no existing admin found, delete all admins and create the new one
  await adminsCollection.deleteMany({})
  
  // Create the admin account
  await adminsCollection.insertOne({
    ...admin,
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date(),
  })
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable (e.g. in .env.local)")
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  const db = client.db(MONGODB_DB)

  // Ensure required collections exist (idempotent)
  try {
    const collections = await db.listCollections({}, { nameOnly: true }).toArray()
    const existingNames = new Set(collections.map((c) => c.name))

    // Create departmentYearSelections collection with a simple validator and indexes
    if (!existingNames.has("departmentYearSelections")) {
      await db.createCollection("departmentYearSelections", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["department", "yearLevel", "createdAt"],
            properties: {
              department: { bsonType: "string" },
              yearLevel: { bsonType: "string" },
              userId: { bsonType: ["string", "null"] },
              createdAt: { bsonType: "date" },
            },
          },
        },
      })
      await db.collection("departmentYearSelections").createIndexes([
        { key: { userId: 1 }, name: "userId_1" },
        { key: { department: 1 }, name: "department_1" },
        { key: { yearLevel: 1 }, name: "yearLevel_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
      ])
    }

    // Ensure users collection exists with indexes used by auth flows
    if (!existingNames.has("users")) {
      await db.createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "email", "password", "studentId", "department", "yearLevel", "createdAt"],
            properties: {
              firstName: { bsonType: "string" },
              lastName: { bsonType: "string" },
              email: { bsonType: "string" },
              password: { bsonType: "string" },
              studentId: { bsonType: "string" },
              department: { bsonType: "string" },
              yearLevel: { bsonType: "string" },
              createdAt: { bsonType: "date" },
              role: { bsonType: "string" },
            },
          },
        },
      })
    }
    // Create indexes (idempotent; duplicates are ignored)
    await db.collection("users").createIndexes([
      { key: { email: 1 }, name: "email_1", unique: true },
      { key: { studentId: 1 }, name: "studentId_1", unique: true },
      { key: { createdAt: -1 }, name: "createdAt_-1" },
      { key: { department: 1 }, name: "department_1" },
      { key: { role: 1 }, name: "role_1" },
      { key: { department: 1, role: 1 }, name: "department_role_1" },
    ])

    // Create messages collection for chat system (user to admin only)
    if (!existingNames.has("messages")) {
      await db.createCollection("messages", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["senderId", "receiverId", "text", "createdAt"],
            properties: {
              senderId: { bsonType: "string" },
              receiverId: { bsonType: "string" },
              senderName: { bsonType: "string" },
              senderInitials: { bsonType: "string" },
              text: { bsonType: "string" },
              createdAt: { bsonType: "date" },
              read: { bsonType: "bool" },
            },
          },
        },
      })
      await db.collection("messages").createIndexes([
        { key: { senderId: 1, receiverId: 1 }, name: "conversation_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
        { key: { read: 1 }, name: "read_1" },
      ])
    }

    // Create profileEditRequests collection for profile edit approval system
    if (!existingNames.has("profileEditRequests")) {
      await db.createCollection("profileEditRequests", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userId", "currentProfile", "editedProfile", "status", "submittedAt"],
            properties: {
              userId: { bsonType: "string" },
              studentId: { bsonType: "string" },
              studentName: { bsonType: "string" },
              studentDepartment: { bsonType: "string" },
              studentYearLevel: { bsonType: ["string", "null"] },
              currentProfile: { bsonType: "object" },
              editedProfile: { bsonType: "object" },
              status: { bsonType: "string", enum: ["pending", "approved", "rejected"] },
              submittedAt: { bsonType: "date" },
              reviewedAt: { bsonType: ["date", "null"] },
              reviewedBy: { bsonType: ["string", "null"] },
            },
          },
        },
      })
      await db.collection("profileEditRequests").createIndexes([
        { key: { userId: 1 }, name: "userId_1" },
        { key: { status: 1 }, name: "status_1" },
        { key: { submittedAt: -1 }, name: "submittedAt_-1" },
      ])
    }

    // Create announcements collection
    if (!existingNames.has("announcements")) {
      await db.createCollection("announcements", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["title", "content", "createdAt", "createdBy"],
            properties: {
              title: { bsonType: "string" },
              content: { bsonType: "string" },
              createdAt: { bsonType: "date" },
              createdBy: { bsonType: "string" },
              createdByName: { bsonType: "string" },
              isImportant: { bsonType: ["bool", "null"] },
            },
          },
        },
      })
      await db.collection("announcements").createIndexes([
        { key: { createdAt: -1 }, name: "createdAt_-1" },
        { key: { createdBy: 1 }, name: "createdBy_1" },
      ])
    }

    // Create violations collection
    if (!existingNames.has("violations")) {
      await db.createCollection("violations", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userId", "studentId", "studentName", "violation", "status", "createdAt", "managedBy"],
            properties: {
              userId: { bsonType: "string" },
              studentId: { bsonType: "string" },
              studentName: { bsonType: "string" },
              studentDepartment: { bsonType: "string" },
              violation: { bsonType: "string" },
              violationType: { bsonType: ["string", "null"] },
              status: { bsonType: "string", enum: ["pending", "resolved", "warning"] },
              managedBy: { bsonType: "string" },
              managedByName: { bsonType: "string" },
              approverTitle: { bsonType: ["string", "null"] },
              createdAt: { bsonType: "date" },
              resolvedAt: { bsonType: ["date", "null"] },
              notes: { bsonType: ["string", "null"] },
            },
          },
        },
      })
      await db.collection("violations").createIndexes([
        { key: { userId: 1 }, name: "userId_1" },
        { key: { studentId: 1 }, name: "studentId_1" },
        { key: { status: 1 }, name: "status_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
        { key: { studentDepartment: 1 }, name: "studentDepartment_1" },
        { key: { violationType: 1 }, name: "violationType_1" },
        { key: { studentDepartment: 1, userId: 1 }, name: "studentDepartment_userId_1" },
      ])
    }

    // Create notifications collection
    if (!existingNames.has("notifications")) {
      await db.createCollection("notifications", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userId", "title", "description", "type", "createdAt", "read"],
            properties: {
              userId: { bsonType: "string" },
              title: { bsonType: "string" },
              description: { bsonType: "string" },
              type: { bsonType: "string", enum: ["announcement", "message", "profile_approval", "profile_rejection", "other"] },
              createdAt: { bsonType: "date" },
              read: { bsonType: "bool" },
              readAt: { bsonType: ["date", "null"] },
              relatedId: { bsonType: ["string", "null"] },
              badgeColor: { bsonType: ["string", "null"] },
            },
          },
        },
      })
      await db.collection("notifications").createIndexes([
        { key: { userId: 1 }, name: "userId_1" },
        { key: { read: 1 }, name: "read_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
        { key: { userId: 1, read: 1 }, name: "userId_read_1" },
      ])
    }

    await ensureDefaultAdmins(db)
  } catch (e) {
    // If ensuring collections fails, continue; application can still operate,
    // and MongoDB will create the collection on first insert.
    // Consider logging if you have a logger configured.
  }

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
