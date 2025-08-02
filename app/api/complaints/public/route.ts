import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get public complaints (anonymized)
    const complaints = await db
      .collection("complaints")
      .aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            image_url: 1,
            status: 1,
            created_at: 1,
            upvotes: { $ifNull: ["$upvotes", 0] },
            views: { $ifNull: ["$views", 0] },
          },
        },
        {
          $sort: { created_at: -1 },
        },
      ])
      .toArray()

    return NextResponse.json({ complaints })
  } catch (error) {
    console.error("Fetch public complaints error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
