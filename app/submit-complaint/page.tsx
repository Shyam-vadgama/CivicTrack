"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { ComplaintFormWizard } from "@/components/complaint-form-wizard"

export default function SubmitComplaintPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("category", formData.category)
      submitData.append("description", formData.description)
      submitData.append("location", formData.location)
      submitData.append("priority", formData.priority)
      submitData.append("user_id", user._id)

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Complaint submitted successfully!")
        router.push("/dashboard")
      } else {
        toast.error(data.message || "Failed to submit complaint")
      }
    } catch (error) {
      toast.error("An error occurred while submitting the complaint")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Complaint</h1>
              <p className="text-gray-600 dark:text-gray-300">Report a civic issue in your area</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ComplaintFormWizard onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
