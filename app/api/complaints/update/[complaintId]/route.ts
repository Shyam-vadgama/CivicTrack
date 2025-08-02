import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PUT(request: NextRequest, { params }: { params: { complaintId: string } }) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin (handle both isAdmin and is_admin)
    if (!decoded.isAdmin && !decoded.is_admin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 })
    }

    const { status, admin_remarks } = await request.json()

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("complaints").updateOne(
      { _id: new ObjectId(params.complaintId) },
      {
        $set: {
          status,
          admin_remarks: admin_remarks || null,
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Complaint updated successfully" })
  } catch (error) {
    console.error("Update complaint error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
