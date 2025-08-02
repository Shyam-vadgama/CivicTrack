# Geolocation Feature Documentation

This document describes the complete geolocation feature implementation in the CivicTrack application.

## 🎯 Features Implemented

### ✅ Core Functionality
- **Browser Location Permission**: Requests and manages location permissions
- **Geolocation API Integration**: Uses browser's Geolocation API to get coordinates
- **Reverse Geocoding**: Converts coordinates to human-readable addresses
- **Auto-fill Location**: Automatically fills the location input field
- **Error Handling**: Comprehensive error handling for various scenarios
- **MongoDB Storage**: Stores coordinates and address in the database
- **Geospatial Indexing**: MongoDB 2dsphere index for future geo-queries

### ✅ User Experience
- **Permission Status Display**: Shows current permission status
- **Loading States**: Visual feedback during location detection
- **Error Messages**: Clear error messages for different failure scenarios
- **Fallback Options**: Manual address entry when location fails
- **Toast Notifications**: Success/error notifications

## 🏗️ Architecture

### Frontend Components
```
components/
├── complaint-form-wizard.tsx    # Main form with geolocation
└── ui/                          # UI components

hooks/
└── use-location.ts             # Custom hook for location management

lib/
├── geocoding.ts                # Geocoding utilities
└── mongodb.ts                  # Database with geospatial indexing
```

### Backend API Routes
```
app/api/
├── complaints/route.ts         # Handles complaint submission with location
├── complaints/all/route.ts     # Returns complaints with location data
└── geocoding/reverse/route.ts  # Server-side reverse geocoding
```

## 🔧 Technical Implementation

### 1. Geolocation Utilities (`lib/geocoding.ts`)

```typescript
// Key functions:
- reverseGeocode(lat, lng): Promise<string>
- getCurrentLocation(): Promise<GeolocationPosition>
- getCurrentLocationWithAddress(): Promise<LocationData>
- checkLocationPermission(): Promise<PermissionState>
- getGeolocationErrorMessage(error): string
```

### 2. Custom Hook (`hooks/use-location.ts`)

```typescript
// Provides:
- locationData: LocationData | null
- locationPermission: PermissionState | null
- isGettingLocation: boolean
- locationError: string | null
- getCurrentLocation(): Promise<void>
- clearLocationError(): void
```

### 3. Form Integration (`components/complaint-form-wizard.tsx`)

- **Step 3**: Location step with geolocation button
- **Permission Handling**: Shows permission status and errors
- **Auto-fill**: Automatically fills location field with detected address
- **Coordinates Storage**: Stores lat/lng for future geo-queries

### 4. Database Schema

```javascript
// Complaint document structure:
{
  _id: ObjectId,
  user_id: ObjectId,
  title: String,
  category: String,
  description: String,
  location: {
    address: String,        // Human-readable address
    coordinates: {
      lat: Number,          // Latitude
      lng: Number           // Longitude
    }
  },
  priority: String,
  image_url: String,
  status: String,
  admin_remarks: String,
  created_at: Date
}
```

### 5. Geospatial Indexing

```javascript
// MongoDB 2dsphere index for location queries
db.complaints.createIndex(
  { "location.coordinates": "2dsphere" },
  { 
    name: "location_2dsphere",
    background: true 
  }
)
```

## 🌐 Reverse Geocoding Service

### Nominatim (OpenStreetMap)
- **Service**: Free, no API key required
- **Rate Limit**: 1 request per second
- **Coverage**: Global
- **Accuracy**: Good for most use cases

### API Endpoint
```
GET /api/geocoding/reverse?lat={latitude}&lng={longitude}
```

### Response Format
```json
{
  "address": "123 Main St, City, State",
  "fullAddress": "123 Main St, Downtown, City, State, Country",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

## 🔒 Privacy & Security

### Location Permission States
- **granted**: User allowed location access
- **denied**: User blocked location access
- **prompt**: Permission not yet requested

### Data Handling
- **Client-side**: Coordinates obtained via browser API
- **Server-side**: Only stored after user consent
- **Fallback**: Manual address entry always available

## 🚀 Usage Examples

### 1. Basic Location Detection

```typescript
import { getCurrentLocationWithAddress } from '@/lib/geocoding'

const locationData = await getCurrentLocationWithAddress()
console.log(locationData)
// Output: { lat: 40.7128, lng: -74.0060, address: "123 Main St, City, State" }
```

### 2. Using the Custom Hook

```typescript
import { useLocation } from '@/hooks/use-location'

function MyComponent() {
  const { 
    locationData, 
    getCurrentLocation, 
    isGettingLocation, 
    locationError 
  } = useLocation()

  return (
    <button onClick={getCurrentLocation} disabled={isGettingLocation}>
      {isGettingLocation ? "Getting Location..." : "Get My Location"}
    </button>
  )
}
```

### 3. Form Integration

```typescript
// In complaint form
const handleLocationDetection = async () => {
  try {
    const locationData = await getCurrentLocationWithAddress()
    setFormData(prev => ({
      ...prev,
      location: locationData.address,
      coordinates: locationData
    }))
  } catch (error) {
    // Handle error
  }
}
```

## 🔍 Error Handling

### Common Error Scenarios

1. **Permission Denied**
   - Message: "Location access was denied. Please enable location permissions in your browser settings."
   - Action: User can still enter address manually

2. **Location Unavailable**
   - Message: "Location unavailable. Please check your GPS settings."
   - Action: Retry or manual entry

3. **Timeout**
   - Message: "Location request timed out. Please try again."
   - Action: Retry with better connection

4. **Geocoding Failure**
   - Message: "Failed to get address. Using coordinates instead."
   - Action: Fallback to coordinate display

## 🗺️ Future Geo-Queries

With the 2dsphere index, you can perform advanced geo-queries:

```javascript
// Find complaints within 5km of a point
db.complaints.find({
  "location.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000
    }
  }
})

// Find complaints in a specific area
db.complaints.find({
  "location.coordinates": {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[[lng1, lat1], [lng2, lat2], ...]]
      }
    }
  }
})
```

## 🧪 Testing

### Manual Testing
1. **Permission Grant**: Allow location access and verify auto-fill
2. **Permission Deny**: Block location access and verify manual entry
3. **Network Issues**: Test with poor connection
4. **Different Browsers**: Test on Chrome, Firefox, Safari

### API Testing
```bash
# Test reverse geocoding API
curl "http://localhost:3000/api/geocoding/reverse?lat=40.7128&lng=-74.0060"
```

## 📱 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Full support

## 🔧 Configuration

### Environment Variables
```env
# No additional environment variables needed
# Uses free Nominatim service
```

### Rate Limiting
- Nominatim: 1 request per second
- Consider caching for production use

## 🚀 Deployment Considerations

1. **HTTPS Required**: Geolocation API requires HTTPS in production
2. **User-Agent**: Nominatim requires proper User-Agent header
3. **Rate Limiting**: Implement caching for high-traffic applications
4. **Fallback Services**: Consider multiple geocoding services for reliability

## 📊 Performance

- **Location Detection**: ~2-5 seconds (GPS + geocoding)
- **Geocoding**: ~200-500ms (Nominatim API)
- **Database Index**: Optimized for geo-queries
- **Caching**: Consider implementing for repeated locations

---

This geolocation feature provides a seamless user experience while maintaining privacy and offering robust error handling for various scenarios. 