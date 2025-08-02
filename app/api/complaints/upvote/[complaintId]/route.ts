import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest, { params }: { params: { complaintId: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db
      .collection("complaints")
      .updateOne({ _id: new ObjectId(params.complaintId) }, { $inc: { upvotes: 1 } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Upvoted successfully" })
  } catch (error) {
    console.error("Upvote error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
