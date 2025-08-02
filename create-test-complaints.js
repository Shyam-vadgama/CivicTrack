// Script to create test complaints for MongoDB Atlas
const { MongoClient } = require('mongodb');

// Use MongoDB Atlas URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civictrack';

// MongoDB Atlas connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function createTestComplaints() {
  let client;
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    const db = client.db("civictrack");
    
    // Get the admin user ID
    const adminUser = await db.collection('users').findOne({ email: 'admin@test.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run create-admin.js first.');
      return;
    }
    
    // Check if complaints already exist
    const existingComplaints = await db.collection('complaints').countDocuments();
    if (existingComplaints > 0) {
      console.log(`✅ ${existingComplaints} complaints already exist`);
      return;
    }
    
    // Create test complaints
    const testComplaints = [
      {
        user_id: adminUser._id,
        title: 'Broken Streetlight on Main Street',
        category: 'Streetlight',
        description: 'The streetlight at the corner of Main Street and Oak Avenue has been broken for 3 days. It\'s very dark and unsafe for pedestrians.',
        location: 'Main Street & Oak Avenue',
        status: 'Pending',
        admin_remarks: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        user_id: adminUser._id,
        title: 'Pothole on Highway 101',
        category: 'Road',
        description: 'Large pothole on Highway 101 near exit 15. It\'s causing damage to vehicles and is a safety hazard.',
        location: 'Highway 101, Exit 15',
        status: 'In Progress',
        admin_remarks: 'Work crew assigned, repair scheduled for next week',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        user_id: adminUser._id,
        title: 'Clogged Drainage System',
        category: 'Drainage',
        description: 'The drainage system in the downtown area is clogged and causing water to pool on the streets during rain.',
        location: 'Downtown Area',
        status: 'Resolved',
        admin_remarks: 'Drainage system cleared and cleaned. Issue resolved.',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        user_id: adminUser._id,
        title: 'Garbage Not Collected',
        category: 'Garbage Collection',
        description: 'Garbage collection was missed on Elm Street yesterday. Bins are overflowing.',
        location: 'Elm Street',
        status: 'Pending',
        admin_remarks: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user_id: adminUser._id,
        title: 'Water Supply Issue',
        category: 'Water Supply',
        description: 'Low water pressure in the residential area. Residents are experiencing difficulty with daily activities.',
        location: 'Residential Area',
        status: 'In Progress',
        admin_remarks: 'Investigating the issue. Temporary water supply arranged.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      }
    ];
    
    const result = await db.collection('complaints').insertMany(testComplaints);
    
    console.log(`✅ Created ${result.insertedCount} test complaints`);
    console.log('Complaint IDs:', result.insertedIds);
    
  } catch (error) {
    console.error('❌ Error creating test complaints:', error);
    if (error.message.includes('authentication')) {
      console.log('💡 Make sure your MongoDB Atlas credentials are correct in the MONGODB_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Make sure your MongoDB Atlas cluster is accessible and the URI is correct');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('✅ Database connection closed');
    }
  }
}

createTestComplaints(); 