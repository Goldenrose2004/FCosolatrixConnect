import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { invalidateAnalyticsCache } from "@/lib/analytics-cache"

// PATCH - Update violation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 13+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Violation ID is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid violation ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json(
        { ok: false, error: "Status is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    const updateData: any = {
      status: status,
    }

    if (status === "resolved") {
      updateData.resolvedAt = new Date()
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    // Update the violation
    const updateResult = await db.collection("violations").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Violation not found" },
        { status: 404 }
      )
    }

    // Fetch the updated violation
    const updatedViolation = await db.collection("violations").findOne({
      _id: new ObjectId(id),
    })

    if (!updatedViolation) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch updated violation" },
        { status: 500 }
      )
    }

    // Format for response
    const formattedViolation = {
      id: updatedViolation._id.toString(),
      userId: updatedViolation.userId,
      studentId: updatedViolation.studentId,
      studentName: updatedViolation.studentName,
      studentDepartment: updatedViolation.studentDepartment || null,
      violation: updatedViolation.violation,
      violationType: updatedViolation.violationType || null,
      status: updatedViolation.status,
      managedBy: updatedViolation.managedBy || null,
      managedByName: updatedViolation.managedByName || "Admin",
      approverTitle: updatedViolation.approverTitle || null,
      createdAt: updatedViolation.createdAt ? new Date(updatedViolation.createdAt).toISOString() : new Date().toISOString(),
      resolvedAt: updatedViolation.resolvedAt ? new Date(updatedViolation.resolvedAt).toISOString() : null,
      notes: updatedViolation.notes || null,
      date: updatedViolation.createdAt
        ? new Date(updatedViolation.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      time: updatedViolation.createdAt
        ? new Date(updatedViolation.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
    }

    invalidateAnalyticsCache()

    return NextResponse.json(
      { ok: true, message: "Violation updated successfully", violation: formattedViolation },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating violation:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update violation" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a violation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 13+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Violation ID is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid violation ID" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase().then((r) => r.db)

    // Delete the violation
    const deleteResult = await db.collection("violations").deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Violation not found" },
        { status: 404 }
      )
    }

    invalidateAnalyticsCache()

    return NextResponse.json(
      { ok: true, message: "Violation deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting violation:", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to delete violation" },
      { status: 500 }
    )
  }
}

