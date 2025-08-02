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

    const { searchParams } = new URL(request.url)
    const range = Number.parseInt(searchParams.get("range") || "30")

    const { db } = await connectToDatabase()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - range)

    // Get total complaints
    const totalComplaints = await db.collection("complaints").countDocuments({
      created_at: { $gte: startDate, $lte: endDate },
    })

    // Get status counts
    const statusCounts = await db
      .collection("complaints")
      .aggregate([
        { $match: { created_at: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray()

    const pendingComplaints = statusCounts.find((s) => s._id === "Pending")?.count || 0
    const inProgressComplaints = statusCounts.find((s) => s._id === "In Progress")?.count || 0
    const resolvedComplaints = statusCounts.find((s) => s._id === "Resolved")?.count || 0

    // Get category stats
    const categoryStats = await db
      .collection("complaints")
      .aggregate([
        { $match: { created_at: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    const categoryStatsFormatted = categoryStats.map((cat) => ({
      category: cat._id,
      count: cat.count,
      percentage: totalComplaints > 0 ? Math.round((cat.count / totalComplaints) * 100) : 0,
    }))

    // Get location stats
    const locationStats = await db
      .collection("complaints")
      .aggregate([
        { $match: { created_at: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    const locationStatsFormatted = locationStats.map((loc) => ({
      location: loc._id,
      count: loc.count,
    }))

    // Calculate average resolution time (mock data for now)
    const avgResolutionTime = 5

    // Get recent activity (mock data)
    const recentActivity = [
      {
        type: "complaint_resolved",
        description: "Streetlight complaint resolved on Main Street",
        timestamp: new Date().toISOString(),
      },
      {
        type: "complaint_submitted",
        description: "New drainage complaint submitted",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        type: "status_updated",
        description: "Road repair complaint moved to In Progress",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    // Monthly stats (mock data)
    const monthlyStats = [
      { month: "Jan", complaints: 45, resolved: 38 },
      { month: "Feb", complaints: 52, resolved: 41 },
      { month: "Mar", complaints: 38, resolved: 35 },
      { month: "Apr", complaints: 61, resolved: 48 },
    ]

    return NextResponse.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      avgResolutionTime,
      categoryStats: categoryStatsFormatted,
      monthlyStats,
      locationStats: locationStatsFormatted,
      recentActivity,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
