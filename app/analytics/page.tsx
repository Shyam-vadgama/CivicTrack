"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AnalyticsData {
  totalComplaints: number
  pendingComplaints: number
  inProgressComplaints: number
  resolvedComplaints: number
  avgResolutionTime: number
  categoryStats: Array<{
    category: string
    count: number
    percentage: number
  }>
  monthlyStats: Array<{
    month: string
    complaints: number
    resolved: number
  }>
  locationStats: Array<{
    location: string
    count: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    if (!user.is_admin) {
      router.push("/dashboard")
      return
    }

    fetchAnalytics(token, timeRange)
  }, [router, timeRange])

  const fetchAnalytics = async (token: string, range: string) => {
    try {
      const response = await fetch(`/api/analytics?range=${range}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        toast.error("Failed to fetch analytics")
      }
    } catch (error) {
      toast.error("An error occurred while fetching analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const resolutionRate =
    analytics.totalComplaints > 0 ? Math.round((analytics.resolvedComplaints / analytics.totalComplaints) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-300">Comprehensive complaint analytics and insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Complaints</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalComplaints}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last period
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Resolution Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{resolutionRate}%</p>
                  <Progress value={resolutionRate} className="mt-2" />
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Resolution Time</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.avgResolutionTime}</p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Issues</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.pendingComplaints}</p>
                  <p className="text-sm text-yellow-600">Needs attention</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Complaints by Category
              </CardTitle>
              <CardDescription>Distribution of complaints across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full bg-blue-600"
                        style={{
                          backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
                        }}
                      />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={category.percentage} className="w-20" />
                      <span className="text-sm font-medium w-12 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Status Distribution
              </CardTitle>
              <CardDescription>Current status of all complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={(analytics.pendingComplaints / analytics.totalComplaints) * 100}
                      className="w-24"
                    />
                    <span className="font-medium w-12 text-right">{analytics.pendingComplaints}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={(analytics.inProgressComplaints / analytics.totalComplaints) * 100}
                      className="w-24"
                    />
                    <span className="font-medium w-12 text-right">{analytics.inProgressComplaints}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolved
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={(analytics.resolvedComplaints / analytics.totalComplaints) * 100}
                      className="w-24"
                    />
                    <span className="font-medium w-12 text-right">{analytics.resolvedComplaints}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Complaint Locations
              </CardTitle>
              <CardDescription>Areas with the most reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.locationStats.slice(0, 5).map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <Badge variant="secondary">{location.count} complaints</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border-l-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
