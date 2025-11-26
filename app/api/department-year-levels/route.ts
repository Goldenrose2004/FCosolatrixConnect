import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

type DepartmentYearSelection = {
  department: string
  yearLevel: string
  userId?: string
  createdAt: Date
}

export async function POST(request: NextRequest) {
  try {
    const { department, yearLevel, userId } = await request.json()

    if (!department || !yearLevel) {
      return NextResponse.json({ error: "department and yearLevel are required" }, { status: 400 })
    }

    const db = await connectToDatabase().then((res) => res.db)

    const doc: DepartmentYearSelection = {
      department: String(department),
      yearLevel: String(yearLevel),
      userId: userId ? String(userId) : undefined,
      createdAt: new Date(),
    }

    const result = await db.collection("departmentYearSelections").insertOne(doc)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Create Department-Year selection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || undefined

    const db = await connectToDatabase().then((res) => res.db)

    const query: Record<string, unknown> = {}
    if (userId) query.userId = userId

    const selections = await db.collection("departmentYearSelections").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, selections }, { status: 200 })
  } catch (error) {
    console.error("List Department-Year selections error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

