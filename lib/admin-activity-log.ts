import { connectToDatabase } from "@/lib/mongodb"

export interface AdminActivityLog {
  adminId: string
  action: string
  timestamp: Date
  details?: Record<string, any> | null
  ipAddress?: string | null
}

export async function logAdminActivity(
  adminId: string,
  action: string,
  details?: Record<string, any> | null,
  ipAddress?: string | null
): Promise<void> {
  try {
    const { db } = await connectToDatabase()
    await db.collection("adminActivityLogs").insertOne({
      adminId,
      action,
      timestamp: new Date(),
      details: details || null,
      ipAddress: ipAddress || null,
    })
  } catch (error) {
    // Don't throw error - logging should not break the main functionality
    console.error("Failed to log admin activity:", error)
  }
}

export async function getAdminActivityLogs(
  adminId: string,
  limit: number = 100
): Promise<AdminActivityLog[]> {
  try {
    const { db } = await connectToDatabase()
    const logs = await db
      .collection("adminActivityLogs")
      .find({ adminId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    return logs.map((log) => ({
      adminId: log.adminId,
      action: log.action,
      timestamp: log.timestamp,
      details: log.details || null,
      ipAddress: log.ipAddress || null,
    }))
  } catch (error) {
    console.error("Failed to get admin activity logs:", error)
    return []
  }
}

