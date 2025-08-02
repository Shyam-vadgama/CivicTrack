import { MongoClient, type Db } from "mongodb"

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/civictrack"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // MongoDB Atlas connection options (simplified for compatibility)
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }

  try {
    const client = new MongoClient(MONGODB_URI, options)
    await client.connect()

    // Test the connection
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Successfully connected to MongoDB Atlas")

    const db = client.db("civictrack")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    throw new Error(`Failed to connect to MongoDB: ${error}`)
  }
}

// Function to close the database connection
export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
    console.log("✅ Database connection closed")
  }
}
