// Geocoding utilities for the CivicTrack application

export interface LocationData {
  lat: number
  lng: number
  address: string
}

export interface GeocodingResult {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
}

/**
 * Reverse geocode coordinates to get a human-readable address
 * Uses Nominatim (OpenStreetMap) - completely free, no API key required
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CivicTrack/1.0' // Required by Nominatim terms of service
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await response.json()
    
    if (data.display_name) {
      // Nominatim returns a full display name, but we can make it more readable
      const addressParts = data.display_name.split(', ')
      
      // Take the first few parts for a shorter, more readable address
      const shortAddress = addressParts.slice(0, 4).join(', ')
      return shortAddress
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    // Fallback to coordinates
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

/**
 * Get current location using browser's Geolocation API
 */
export async function getCurrentLocation(): Promise<GeolocationPosition> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser")
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    })
  })
}

/**
 * Get current location with reverse geocoding
 */
export async function getCurrentLocationWithAddress(): Promise<LocationData> {
  const position = await getCurrentLocation()
  const { latitude: lat, longitude: lng } = position.coords
  
  const address = await reverseGeocode(lat, lng)
  
  return {
    lat,
    lng,
    address
  }
}

/**
 * Check location permission status
 */
export async function checkLocationPermission(): Promise<PermissionState | null> {
  if ('permissions' in navigator) {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      return permission.state
    } catch (error) {
      console.log('Permission API not supported')
      return null
    }
  }
  return null
}

/**
 * Get error message for geolocation errors
 */
export function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case 1:
      return "Location access was denied. Please enable location permissions in your browser settings."
    case 2:
      return "Location unavailable. Please check your GPS settings."
    case 3:
      return "Location request timed out. Please try again."
    default:
      return "Failed to get location. Please enter the address manually."
  }
} 