import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (!lat || !lng) {
      return NextResponse.json({ message: "Latitude and longitude are required" }, { status: 400 })
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 })
    }

    // Use Nominatim (OpenStreetMap) for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CivicTrack/1.0' // Required by Nominatim terms of service
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ message: "Geocoding service unavailable" }, { status: 503 })
    }

    const data = await response.json()

    if (data.display_name) {
      // Nominatim returns a full display name, but we can make it more readable
      const addressParts = data.display_name.split(', ')
      
      // Take the first few parts for a shorter, more readable address
      const shortAddress = addressParts.slice(0, 4).join(', ')
      
      return NextResponse.json({
        address: shortAddress,
        fullAddress: data.display_name,
        coordinates: {
          lat: latitude,
          lng: longitude
        },
        raw: data
      })
    }

    // Fallback to coordinates
    return NextResponse.json({
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      coordinates: {
        lat: latitude,
        lng: longitude
      }
    })

  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
} 