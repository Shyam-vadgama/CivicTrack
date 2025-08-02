"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, FileText, Clock, CheckCircle, AlertCircle, LogOut, Filter, Edit, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface Complaint {
  _id: string
  user_id: string
  title: string
  category: string
  description: string
  location: string
  image_url?: string
  status: "Pending" | "In Progress" | "Resolved"
  admin_remarks?: string
  created_at: string
  user_name?: string
  user_email?: string
}

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [updateData, setUpdateData] = useState({
    status: "",
    admin_remarks: "",
  })
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const categories = [
    "Road",
    "Drainage", 
    "Streetlight",
    "Water Supply",
    "Garbage Collection",
    "Public Transport",
    "Parks & Recreation",
    "Other",
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userData)
      if (!user.is_admin) {
        router.push("/dashboard")
        return
      }
    } catch (err) {
      console.error("Error parsing user data:", err)
      router.push("/login")
      return
    }

    fetchComplaints(token)
  }, [router])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, categoryFilter])

  const fetchComplaints = async (token: string) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log("Fetching complaints with token:", token.substring(0, 20) + "...")
      
      // Use the correct endpoint for fetching all complaints
      const response = await fetch("/api/complaints/all", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Complaints data received:", data)
        
        // Handle the response structure
        let complaintsData: Complaint[] = []
        if (data.complaints && Array.isArray(data.complaints)) {
          complaintsData = data.complaints
        } else if (Array.isArray(data)) {
          complaintsData = data
        }

        setComplaints(complaintsData)
        
        if (complaintsData.length === 0) {
          toast.info("No complaints found in the system")
        } else {
          toast.success(`Loaded ${complaintsData.length} complaints`)
        }

      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(`Failed to fetch complaints: ${errorData.message || response.statusText}`)
      }

    } catch (error) {
      console.error("Error fetching complaints:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(`Failed to fetch complaints: ${errorMessage}`)
      toast.error("Failed to load complaints. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }



  const filterComplaints = () => {
    let filtered = complaints

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return

    setUpdating(true)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.")
        return
      }

      console.log("Starting complaint update process...")
      console.log("Selected complaint ID:", selectedComplaint._id)
      console.log("Update data:", updateData)
      
      // Use the correct update endpoint
      const response = await fetch(`/api/complaints/update/${selectedComplaint._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: updateData.status,
          admin_remarks: updateData.admin_remarks,
        }),
      })

      console.log(`Response status: ${response.status}`)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log("Update successful:", responseData)
        
        toast.success("Complaint updated successfully!")
        
        // Update the complaint in the local state
        setComplaints(prev => prev.map(complaint => 
          complaint._id === selectedComplaint._id 
            ? { ...complaint, status: updateData.status as any, admin_remarks: updateData.admin_remarks }
            : complaint
        ))
        
        setSelectedComplaint(null)
        setUpdateData({ status: "", admin_remarks: "" })
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("Update failed:", errorData)
        
        // Handle specific error cases
        if (response.status === 401) {
          toast.error("Authentication failed. Please login again.")
          router.push("/login")
        } else if (response.status === 403) {
          toast.error("Admin access required. You don't have permission to update complaints.")
        } else if (response.status === 404) {
          toast.error("Complaint not found. It may have been deleted.")
        } else {
          toast.error(`Update failed: ${errorData.message || "Unknown error"}`)
        }
      }

    } catch (error) {
      console.error("Error updating complaint:", error)
      toast.error("Network error occurred while updating complaint.")
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleRefresh = () => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchComplaints(token)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/analytics">
                  View Analytics Instead
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage civic complaints</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/analytics">Analytics</Link>
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

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filter by Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Complaints ({filteredComplaints.length})
          </h2>

          {filteredComplaints.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No complaints found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {complaints.length === 0 
                    ? "No complaints have been submitted yet" 
                    : "No complaints match the current filters"
                  }
                </p>
                <Button asChild variant="outline">
                  <Link href="/analytics">
                    View Analytics Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredComplaints.map((complaint) => (
                <Card key={complaint._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>
                          {complaint.category} • {complaint.location}
                        </CardDescription>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Submitted by: {complaint.user_name || "Unknown"} ({complaint.user_email || "No email"})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </div>
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedComplaint(complaint)
                                setUpdateData({
                                  status: complaint.status,
                                  admin_remarks: complaint.admin_remarks || "",
                                })
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Complaint</DialogTitle>
                              <DialogDescription>
                                Update the status and add remarks for this complaint
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                  value={updateData.status}
                                  onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Admin Remarks</Label>
                                <Textarea
                                  placeholder="Add remarks or updates..."
                                  value={updateData.admin_remarks}
                                  onChange={(e) => setUpdateData({ ...updateData, admin_remarks: e.target.value })}
                                  rows={3}
                                />
                              </div>

                              <Button onClick={handleUpdateComplaint} disabled={updating} className="w-full">
                                {updating ? "Updating..." : "Update Complaint"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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