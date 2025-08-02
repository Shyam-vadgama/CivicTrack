import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { complaintId: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Increment view count
    await db.collection("complaints").updateOne({ _id: new ObjectId(params.complaintId) }, { $inc: { views: 1 } })

    // Get complaint details
    const complaint = await db
      .collection("complaints")
      .aggregate([
        { $match: { _id: new ObjectId(params.complaintId) } },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            image_url: 1,
            status: 1,
            admin_remarks: 1,
            created_at: 1,
            updated_at: 1,
            upvotes: { $ifNull: ["$upvotes", 0] },
            views: { $ifNull: ["$views", 0] },
            user_name: "$user.name",
            timeline: {
              $ifNull: [
                "$timeline",
                [
                  {
                    status: "$status",
                    timestamp: "$created_at",
                    remarks: "Complaint submitted",
                  },
                ],
              ],
            },
          },
        },
      ])
      .toArray()

    if (complaint.length === 0) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({ complaint: complaint[0] })
  } catch (error) {
    console.error("Fetch complaint detail error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
