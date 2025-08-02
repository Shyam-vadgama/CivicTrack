"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, FileText, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Complaint {
  _id: string
  title: string
  category: string
  description: string
  location: string | { address: string; coordinates?: { lat: number; lng: number } }
  image_url?: string
  status: "Pending" | "In Progress" | "Resolved"
  admin_remarks?: string
  created_at: string
}

interface User {
  _id: string
  name: string
  email: string
  is_admin: boolean
}

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchComplaints(parsedUser._id, token)
  }, [router])

  const fetchComplaints = async (userId: string, token: string) => {
    try {
      const response = await fetch(`/api/complaints/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data.complaints)
      } else {
        toast.error("Failed to fetch complaints")
      }
    } catch (error) {
      toast.error("An error occurred while fetching complaints")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />
      case "In Progress":
        return <AlertCircle className="w-4 h-4" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
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
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your civic complaints</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/public-complaints">Public View</Link>
              </Button>
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{complaints.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {complaints.filter((c) => c.status === "Pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {complaints.filter((c) => c.status === "In Progress").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {complaints.filter((c) => c.status === "Resolved").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button asChild size="lg">
            <Link href="/submit-complaint">
              <Plus className="w-5 h-5 mr-2" />
              Submit New Complaint
            </Link>
          </Button>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Complaints</h2>

          {complaints.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No complaints yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Start by submitting your first civic complaint</p>
                <Button asChild>
                  <Link href="/submit-complaint">Submit Complaint</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {complaints.map((complaint) => (
                <Card key={complaint._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>
                          {complaint.category} • {getLocationDisplay(complaint.location)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{complaint.description}</p>

                    {complaint.image_url && (
                      <div className="mb-4">
                        <img
                          src={complaint.image_url || "/placeholder.svg"}
                          alt="Complaint"
                          className="w-full max-w-md h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {complaint.admin_remarks && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Admin Remarks:</h4>
                        <p className="text-blue-800 dark:text-blue-200">{complaint.admin_remarks}</p>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted on {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
