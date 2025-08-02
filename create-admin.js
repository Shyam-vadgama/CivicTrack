// Script to create a test admin user for MongoDB Atlas
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Use MongoDB Atlas URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civictrack';

// MongoDB Atlas connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function createAdminUser() {
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
    
    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@test.com');
      console.log('Password: admin123');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    const result = await db.collection('users').insertOne({
      name: 'Test Admin',
      email: 'admin@test.com',
      hashed_password: hashedPassword,
      is_admin: true,
      created_at: new Date(),
    });
    
    console.log('✅ Admin user created successfully');
    console.log('User ID:', result.insertedId);
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
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

createAdminUser(); 