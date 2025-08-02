"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, Upload, MapPin, FileText, Camera, CheckCircle, Navigation, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { 
  LocationData, 
  getCurrentLocationWithAddress, 
  checkLocationPermission, 
  getGeolocationErrorMessage 
} from "@/lib/geocoding"

interface FormData {
  title: string
  category: string
  description: string
  location: string
  priority: string
  image: File | null
  coordinates?: LocationData
}

interface ComplaintFormWizardProps {
  onSubmit: (data: FormData) => void
  loading?: boolean
}

const categories = [
  { value: "Road", icon: "🛣️", description: "Potholes, road damage, traffic issues" },
  { value: "Drainage", icon: "🌊", description: "Blocked drains, flooding, water logging" },
  { value: "Streetlight", icon: "💡", description: "Broken lights, dark areas" },
  { value: "Water Supply", icon: "🚰", description: "Water shortage, quality issues" },
  { value: "Garbage Collection", icon: "🗑️", description: "Waste management, cleanliness" },
  { value: "Public Transport", icon: "🚌", description: "Bus stops, transport issues" },
  { value: "Parks & Recreation", icon: "🌳", description: "Park maintenance, facilities" },
  { value: "Other", icon: "📋", description: "Other civic issues" },
]

const priorities = [
  { value: "Low", color: "bg-green-100 text-green-800", description: "Non-urgent, can wait" },
  { value: "Medium", color: "bg-yellow-100 text-yellow-800", description: "Moderate urgency" },
  { value: "High", color: "bg-red-100 text-red-800", description: "Urgent attention needed" },
]

export function ComplaintFormWizard({ onSubmit, loading = false }: ComplaintFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "Medium",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission().then(setLocationPermission)
  }, [])

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    setLocationError(null)

    try {
      const locationData = await getCurrentLocationWithAddress()
      
      setFormData(prev => ({
        ...prev,
        location: locationData.address,
        coordinates: locationData
      }))

      toast.success("Location detected and address filled automatically!")
      setLocationPermission('granted')

    } catch (error: any) {
      console.error('Error getting location:', error)
      
      if (error.code) {
        // GeolocationPositionError
        setLocationError(getGeolocationErrorMessage(error))
        if (error.code === 1) {
          setLocationPermission('denied')
        }
      } else {
        // Other errors (like geocoding failures)
        setLocationError(error.message || "Failed to get location. Please enter the address manually.")
      }
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.category !== ""
      case 2:
        return formData.title.trim() !== "" && formData.description.trim() !== ""
      case 3:
        return formData.location.trim() !== ""
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <FileText className="w-5 h-5" />}
            {currentStep === 2 && <FileText className="w-5 h-5" />}
            {currentStep === 3 && <MapPin className="w-5 h-5" />}
            {currentStep === 4 && <Camera className="w-5 h-5" />}
            {currentStep === 1 && "Select Category"}
            {currentStep === 2 && "Describe the Issue"}
            {currentStep === 3 && "Location Details"}
            {currentStep === 4 && "Add Photo & Priority"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Choose the category that best describes your complaint"}
            {currentStep === 2 && "Provide detailed information about the issue"}
            {currentStep === 3 && "Specify the exact location of the problem"}
            {currentStep === 4 && "Add supporting photo and set priority level"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                      formData.category === category.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setFormData({ ...formData, category: category.value })}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-semibold">{category.value}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Title and Description */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief, descriptive title for your complaint"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the issue. Include when you first noticed it, how it affects you or the community, and any other relevant details..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">{formData.description.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Location Permission Status */}
              {locationPermission === 'denied' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Location access was denied. You can still enter the address manually, or enable location permissions in your browser settings.
                  </AlertDescription>
                </Alert>
              )}

              {/* Location Error */}
              {locationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}

              {/* Get Current Location Button */}
              <div className="space-y-2">
                <Label>Get Current Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation || locationPermission === 'denied'}
                  className="w-full flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isGettingLocation ? "Getting Location..." : "Use My Current Location"}
                </Button>
                {formData.coordinates && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ Location detected: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Specific Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter the exact address or landmark (e.g., '123 Main St, near City Park')"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Location Tips:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Click "Use My Current Location" to auto-fill your address</li>
                  <li>• Be as specific as possible (street address, building number)</li>
                  <li>• Include nearby landmarks or cross streets</li>
                  <li>• Mention the ward or district if known</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Photo and Priority */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <div className="grid grid-cols-3 gap-3">
                  {priorities.map((priority) => (
                    <div
                      key={priority.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.priority === priority.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setFormData({ ...formData, priority: priority.value })}
                    >
                      <Badge className={priority.color} variant="secondary">
                        {priority.value}
                      </Badge>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{priority.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Photo (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData({ ...formData, image: null })
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <Label htmlFor="image" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || !isStepValid()} className="flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Complaint
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
