// Simple test to check if server is running
const testServer = async () => {
  try {
    console.log('Testing server connection...')
    
    // Test basic server response
    const response = await fetch('http://localhost:3000')
    console.log('Server status:', response.status)
    console.log('Content-Type:', response.headers.get('content-type'))
    
    if (response.ok) {
      console.log('✅ Server is running')
    } else {
      console.log('❌ Server responded with error status')
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message)
  }
}

testServer() 