import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const complaints = await db
      .collection("complaints")
      .find({ user_id: params.userId })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({ complaints })
  } catch (error) {
    console.error("Fetch user complaints error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
