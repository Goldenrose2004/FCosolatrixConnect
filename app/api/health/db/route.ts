import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const collections = await db.listCollections({}, { nameOnly: true }).toArray()
    return NextResponse.json(
      {
        ok: true,
        db: db.databaseName,
        collections: collections.map((c) => c.name),
      },
      { status: 200 },
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Unknown DB error",
      },
      { status: 500 },
    )
  }
}
