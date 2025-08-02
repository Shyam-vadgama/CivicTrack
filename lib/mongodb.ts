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

    // Create geospatial index for location queries
    await createGeospatialIndex(db)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    throw new Error(`Failed to connect to MongoDB: ${error}`)
  }
}

// Function to create geospatial index for location queries
async function createGeospatialIndex(db: Db) {
  try {
    // Create a 2dsphere index on the location.coordinates field
    await db.collection("complaints").createIndex(
      { "location.coordinates": "2dsphere" },
      { 
        name: "location_2dsphere",
        background: true 
      }
    )
    console.log("✅ Geospatial index created for location queries")
  } catch (error) {
    // Index might already exist, which is fine
    console.log("ℹ️ Geospatial index setup:", error instanceof Error ? error.message : "Unknown error")
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
