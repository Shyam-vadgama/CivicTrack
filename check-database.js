// Script to check database contents for MongoDB Atlas
const { MongoClient } = require('mongodb');

// Use MongoDB Atlas URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civictrack';

// MongoDB Atlas connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function checkDatabase() {
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
    
    // Check users
    console.log('\n=== USERS ===');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Total users: ${users.length}`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Admin: ${user.is_admin}`);
    });
    
    // Check complaints
    console.log('\n=== COMPLAINTS ===');
    const complaints = await db.collection('complaints').find({}).toArray();
    console.log(`Total complaints: ${complaints.length}`);
    complaints.forEach(complaint => {
      console.log(`- ${complaint.title} (${complaint.status}) - User: ${complaint.user_id}`);
    });
    
    // Check if there's a mismatch in user IDs
    if (complaints.length > 0 && users.length > 0) {
      console.log('\n=== USER ID ANALYSIS ===');
      const adminUser = users.find(u => u.email === 'admin@test.com');
      if (adminUser) {
        console.log(`Admin user ID: ${adminUser._id}`);
        const adminComplaints = complaints.filter(c => c.user_id.toString() === adminUser._id.toString());
        console.log(`Complaints associated with admin: ${adminComplaints.length}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
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

checkDatabase(); 