import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { uploadToCloudinary } from "@/lib/cloudinary"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const userId = formData.get("user_id") as string
    const image = formData.get("image") as File | null

    if (!title || !category || !description || !location || !userId) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    let imageUrl = null
    if (image) {
      try {
        imageUrl = await uploadToCloudinary(image)
      } catch (error) {
        console.error("Image upload error:", error)
        // Continue without image if upload fails
      }
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("complaints").insertOne({
      user_id: userId,
      title,
      category,
      description,
      location,
      image_url: imageUrl,
      status: "Pending",
      admin_remarks: null,
      created_at: new Date(),
    })

    return NextResponse.json(
      {
        message: "Complaint submitted successfully",
        complaintId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Complaint submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
