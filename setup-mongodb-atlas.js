// MongoDB Atlas Setup Script
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function setupMongoDBAtlas() {
  console.log('🚀 MongoDB Atlas Setup Script');
  console.log('==============================\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);

  if (!envExists) {
    console.log('📝 Creating .env.local file...');
    const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civictrack

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created');
    console.log('💡 Please update the MONGODB_URI with your MongoDB Atlas connection string\n');
  } else {
    console.log('✅ .env.local file already exists');
  }

  // Check if MONGODB_URI is set
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/civictrack') {
    console.log('❌ MONGODB_URI not configured');
    console.log('💡 Please set your MongoDB Atlas URI in the .env.local file');
    console.log('   Format: mongodb+srv://username:password@cluster.mongodb.net/civictrack');
    return;
  }

  console.log('🔗 Testing MongoDB Atlas connection...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

  let client;
  try {
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();

    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas');

    const db = client.db("civictrack");

    // Check if collections exist
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Database Collections:');
    if (collections.length === 0) {
      console.log('   No collections found (this is normal for a new database)');
    } else {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }

    // Check if users collection exists and has data
    const userCount = await db.collection('users').countDocuments();
    console.log(`\n👥 Users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('💡 No users found. You can create an admin user by running:');
      console.log('   node create-admin.js');
    }

    // Check if complaints collection exists and has data
    const complaintCount = await db.collection('complaints').countDocuments();
    console.log(`📝 Complaints in database: ${complaintCount}`);

    if (complaintCount === 0) {
      console.log('💡 No complaints found. You can create test complaints by running:');
      console.log('   node create-test-complaints.js');
    }

    console.log('\n🎉 MongoDB Atlas setup completed successfully!');
    console.log('💡 You can now start the development server with: npm run dev');

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   1. Your username and password in the MONGODB_URI');
      console.log('   2. Your MongoDB Atlas user has the correct permissions');
      console.log('   3. Your IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Connection failed. Please check:');
      console.log('   1. Your MongoDB Atlas cluster is running');
      console.log('   2. The cluster URL in your MONGODB_URI is correct');
      console.log('   3. Your network connection');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection refused. Please check:');
      console.log('   1. Your MongoDB Atlas cluster is accessible');
      console.log('   2. Your IP address is whitelisted');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('\n✅ Database connection closed');
    }
  }
}

setupMongoDBAtlas().catch(console.error); 