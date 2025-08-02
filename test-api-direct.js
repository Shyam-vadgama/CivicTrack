// Direct API test using Node.js http module
const http = require('http');

const makeRequest = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const testAPI = async () => {
  try {
    console.log('Testing API endpoints directly...');
    
    // Test login
    console.log('\n1. Testing login...');
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@test.com',
      password: 'admin123',
      isAdmin: true
    });
    
    console.log('Login status:', loginResult.status);
    console.log('Login response:', loginResult.data);
    
    if (loginResult.status === 200 && loginResult.data.token) {
      const token = loginResult.data.token;
      console.log('✅ Login successful');
      
      // Test complaints endpoint
      console.log('\n2. Testing complaints endpoint...');
      const complaintsResult = await makeRequest('/api/complaints/all', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      console.log('Complaints status:', complaintsResult.status);
      console.log('Complaints response:', complaintsResult.data);
      
      if (complaintsResult.status === 200) {
        console.log('✅ Complaints endpoint working');
        
        if (complaintsResult.data.complaints && complaintsResult.data.complaints.length > 0) {
          const firstComplaint = complaintsResult.data.complaints[0];
          console.log('First complaint:', firstComplaint._id);
          
          // Test update
          console.log('\n3. Testing update endpoint...');
          const updateResult = await makeRequest(`/api/complaints/update/${firstComplaint._id}`, 'PUT', {
            status: 'In Progress',
            admin_remarks: 'Test update from direct API'
          }, {
            'Authorization': `Bearer ${token}`
          });
          
          console.log('Update status:', updateResult.status);
          console.log('Update response:', updateResult.data);
          
          if (updateResult.status === 200) {
            console.log('✅ Update successful!');
          } else {
            console.log('❌ Update failed');
          }
        } else {
          console.log('ℹ️ No complaints found');
        }
      } else {
        console.log('❌ Complaints endpoint failed');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testAPI(); 