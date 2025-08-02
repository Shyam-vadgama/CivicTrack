import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
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

    const { db } = await connectToDatabase()

    // Get all complaints with user information
    const complaints = await db
      .collection("complaints")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $addFields: {
            user: {
              $cond: {
                if: { $gt: [{ $size: "$user" }, 0] },
                then: { $arrayElemAt: ["$user", 0] },
                else: { name: "Unknown User", email: "unknown@example.com" }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            priority: 1,
            image_url: 1,
            status: 1,
            admin_remarks: 1,
            created_at: 1,
            user_name: "$user.name",
            user_email: "$user.email",
          },
        },
        {
          $sort: { created_at: -1 },
        },
      ])
      .toArray()

    return NextResponse.json({ complaints })
  } catch (error) {
    console.error("Fetch all complaints error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
