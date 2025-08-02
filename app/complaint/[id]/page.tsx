"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, MapPin, Calendar, User, Eye, MessageSquare, Share2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface ComplaintDetail {
  _id: string
  title: string
  category: string
  description: string
  location: string | { address: string; coordinates?: { lat: number; lng: number } }
  image_url?: string
  status: "Pending" | "In Progress" | "Resolved"
  admin_remarks?: string
  created_at: string
  updated_at?: string
  upvotes: number
  views: number
  user_name?: string
  timeline: Array<{
    status: string
    timestamp: string
    remarks?: string
  }>
}

export default function ComplaintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchComplaintDetail(params.id as string)
    }
  }, [params.id])

  const fetchComplaintDetail = async (complaintId: string) => {
    try {
      const response = await fetch(`/api/complaints/detail/${complaintId}`)

      if (response.ok) {
        const data = await response.json()
        setComplaint(data.complaint)
      } else {
        toast.error("Failed to fetch complaint details")
        router.push("/public-complaints")
      }
    } catch (error) {
      toast.error("An error occurred while fetching complaint details")
      router.push("/public-complaints")
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (!complaint) return

    try {
      const response = await fetch(`/api/complaints/upvote/${complaint._id}`, {
        method: "POST",
      })

      if (response.ok) {
        setComplaint({ ...complaint, upvotes: complaint.upvotes + 1 })
        toast.success("Upvoted successfully!")
      }
    } catch (error) {
      toast.error("Failed to upvote")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: complaint?.title,
          text: complaint?.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getLocationDisplay = (location: string | { address: string; coordinates?: { lat: number; lng: number } }) => {
    if (typeof location === 'string') {
      return location
    }
    return location.address
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading complaint details...</p>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Complaint not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/public-complaints">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Complaints
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Details</h1>
                <p className="text-gray-600 dark:text-gray-300">View full complaint information</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Complaint Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-4">{complaint.title}</CardTitle>
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {getLocationDisplay(complaint.location)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {complaint.user_name || "Anonymous"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {complaint.views} views
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{complaint.category}</Badge>
                  <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">{complaint.description}</p>

              {complaint.image_url && (
                <div className="mb-6">
                  <img
                    src={complaint.image_url || "/placeholder.svg"}
                    alt="Complaint"
                    className="w-full max-w-2xl h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}

              {complaint.admin_remarks && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Official Response
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200">{complaint.admin_remarks}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button onClick={handleUpvote} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <span>👍</span>
                    Support this issue ({complaint.upvotes})
                  </Button>
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Timeline</CardTitle>
              <CardDescription>Track the progress of this complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {complaint.timeline?.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getStatusColor(event.status)} variant="outline">
                          {event.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.remarks && <p className="text-gray-600 dark:text-gray-300 text-sm">{event.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>Related Issues</CardTitle>
              <CardDescription>Other complaints in the same area or category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No related complaints found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
