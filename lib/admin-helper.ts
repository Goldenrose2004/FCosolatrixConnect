import { type Db } from "mongodb"
import { ObjectId } from "mongodb"

/**
 * Find admin account - checks admins collection first, then users collection for backward compatibility
 */
export async function findAdmin(db: Db, query?: { email?: string; _id?: string | ObjectId }): Promise<any | null> {
  const adminsCollection = db.collection("admins")
  const usersCollection = db.collection("users")

  let admin = null

  if (query?.email) {
    const normalizedEmail = query.email.toLowerCase()
    admin = await adminsCollection.findOne({ email: normalizedEmail })
    if (!admin) {
      admin = await usersCollection.findOne({ email: normalizedEmail, role: "admin" })
    }
  } else if (query?._id) {
    const id = typeof query._id === "string" ? new ObjectId(query._id) : query._id
    admin = await adminsCollection.findOne({ _id: id })
    if (!admin) {
      admin = await usersCollection.findOne({ _id: id, role: "admin" })
    }
  } else {
    // Find any admin
    admin = await adminsCollection.findOne({})
    if (!admin) {
      admin = await usersCollection.findOne({ role: "admin" })
    }
  }

  return admin
}

/**
 * Get admin ID - returns the admin's ID or "admin" as fallback
 */
export async function getAdminId(db: Db): Promise<string> {
  const admin = await findAdmin(db)
  return admin ? admin._id.toString() : "admin"
}

