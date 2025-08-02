import { useState, useEffect, useCallback } from 'react'
import { LocationData, getCurrentLocationWithAddress, checkLocationPermission, getGeolocationErrorMessage } from '@/lib/geocoding'

interface UseLocationReturn {
  locationData: LocationData | null
  locationPermission: PermissionState | null
  isGettingLocation: boolean
  locationError: string | null
  getCurrentLocation: () => Promise<void>
  clearLocationError: () => void
}

export function useLocation(): UseLocationReturn {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission().then(setLocationPermission)
  }, [])

  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true)
    setLocationError(null)

    try {
      const data = await getCurrentLocationWithAddress()
      setLocationData(data)
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
  }, [])

  const clearLocationError = useCallback(() => {
    setLocationError(null)
  }, [])

  return {
    locationData,
    locationPermission,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    clearLocationError
  }
} 