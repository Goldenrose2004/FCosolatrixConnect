import { NextResponse } from "next/server"

export async function GET() {
  const hasUri = Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0)
  return NextResponse.json(
    {
      ok: true,
      MONGODB_URI_present: hasUri,
      MONGODB_DB: process.env.MONGODB_DB || "consolatrix_db",
      // Do not echo actual URI for security
    },
    { status: 200 },
  )
}


