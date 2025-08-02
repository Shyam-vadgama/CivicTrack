// Test script to update existing complaints
const testUpdate = async () => {
  console.log('Testing complaint update...')
  
  // Test login
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@test.com',
      password: 'admin123',
      isAdmin: true
    })
  })
  
  if (loginResponse.ok) {
    const loginData = await loginResponse.json()
    console.log('✅ Login successful')
    
    // Test fetching complaints
    const complaintsResponse = await fetch('http://localhost:3000/api/complaints/all', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    })
    
    if (complaintsResponse.ok) {
      const complaintsData = await complaintsResponse.json()
      console.log('✅ Complaints fetched successfully')
      console.log('Number of complaints:', complaintsData.complaints?.length || 0)
      
      if (complaintsData.complaints && complaintsData.complaints.length > 0) {
        const firstComplaint = complaintsData.complaints[0]
        console.log('First complaint ID:', firstComplaint._id)
        console.log('Current status:', firstComplaint.status)
        
        // Test updating a complaint
        const updateResponse = await fetch(`http://localhost:3000/api/complaints/update/${firstComplaint._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'In Progress',
            admin_remarks: 'Test update from API - Working on this issue'
          })
        })
        
        if (updateResponse.ok) {
          console.log('✅ Complaint updated successfully')
          
          // Verify the update by fetching the complaint again
          const verifyResponse = await fetch('http://localhost:3000/api/complaints/all', {
            headers: {
              'Authorization': `Bearer ${loginData.token}`,
              'Content-Type': 'application/json',
            }
          })
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()
            const updatedComplaint = verifyData.complaints.find(c => c._id === firstComplaint._id)
            if (updatedComplaint) {
              console.log('✅ Update verified - New status:', updatedComplaint.status)
              console.log('✅ Admin remarks:', updatedComplaint.admin_remarks)
            }
          }
        } else {
          const errorData = await updateResponse.json()
          console.log('❌ Update failed:', errorData)
        }
      } else {
        console.log('ℹ️ No complaints found to test update')
      }
    } else {
      const errorData = await complaintsResponse.json()
      console.log('❌ Failed to fetch complaints:', errorData)
    }
  } else {
    const errorData = await loginResponse.json()
    console.log('❌ Login failed:', errorData)
  }
}

testUpdate().catch(console.error) 