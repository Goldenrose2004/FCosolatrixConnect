import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase().then((r) => r.db)
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    const total = await db.collection("users").countDocuments()

    return NextResponse.json({ ok: true, total, users }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Failed to read users" }, { status: 500 })
  }
}


