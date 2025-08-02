# MongoDB Atlas Setup Guide

This guide will help you configure the CivicTrack application to use MongoDB Atlas instead of a local MongoDB instance.

## 🚀 Quick Setup

1. **Run the setup script:**
   ```bash
   node setup-mongodb-atlas.js
   ```

2. **Update your `.env.local` file** with your MongoDB Atlas credentials

3. **Test the connection:**
   ```bash
   node check-database.js
   ```

## 📋 Prerequisites

- A MongoDB Atlas account
- A MongoDB Atlas cluster (free tier works fine)
- Your MongoDB Atlas connection string

## 🔧 Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project
4. Build a free cluster (M0 tier)

### 2. Configure Database Access

1. In your MongoDB Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set a username and password (save these!)
5. Set privileges to **Read and write to any database**
6. Click **Add User**

### 3. Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development, you can add `0.0.0.0/0` to allow all IPs
4. For production, add only your specific IP addresses
5. Click **Confirm**

### 4. Get Your Connection String

1. Go to **Database** in your cluster
2. Click **Connect**
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `civictrack`

### 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/civictrack

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 6. Test the Connection

Run the setup script to test your connection:

```bash
node setup-mongodb-atlas.js
```

## 🛠️ Available Scripts

### Setup and Testing
- `node setup-mongodb-atlas.js` - Initial setup and connection test
- `node check-database.js` - Check database contents and connection
- `node create-admin.js` - Create a test admin user
- `node create-test-complaints.js` - Create sample complaints

### API Testing
- `node test-api.js` - Test API endpoints
- `node test-api-direct.js` - Direct API testing
- `node test-update.js` - Test complaint update functionality

## 🔍 Troubleshooting

### Connection Issues

**Error: Authentication failed**
- Check your username and password in the MONGODB_URI
- Verify your database user has the correct permissions
- Make sure your IP address is whitelisted

**Error: ENOTFOUND**
- Verify your MongoDB Atlas cluster is running
- Check the cluster URL in your MONGODB_URI
- Ensure your network connection is stable

**Error: ECONNREFUSED**
- Check if your MongoDB Atlas cluster is accessible
- Verify your IP address is whitelisted
- Try connecting from a different network

### Database Issues

**No collections found**
- This is normal for a new database
- Run `node create-admin.js` to create initial data
- Run `node create-test-complaints.js` to add sample complaints

**Permission denied**
- Ensure your database user has read/write permissions
- Check if you're connecting to the correct database

## 📊 Database Structure

The application will automatically create these collections:

- **users** - User accounts and authentication data
- **complaints** - Complaint details and status information

## 🔐 Security Best Practices

1. **Use strong passwords** for your database users
2. **Whitelist specific IP addresses** instead of allowing all IPs
3. **Use environment variables** for sensitive data
4. **Regularly rotate your JWT secret**
5. **Monitor your database access** through MongoDB Atlas

## 🚀 Production Deployment

For production deployment:

1. **Use a dedicated cluster** (not free tier)
2. **Set up proper IP whitelisting**
3. **Use strong, unique passwords**
4. **Enable MongoDB Atlas monitoring**
5. **Set up automated backups**
6. **Configure proper indexes** for performance

## 📞 Support

If you encounter issues:

1. Check the MongoDB Atlas documentation
2. Verify your connection string format
3. Test with the provided scripts
4. Check the application logs for detailed error messages

## 🔄 Migration from Local MongoDB

If you're migrating from a local MongoDB instance:

1. Export your data from local MongoDB
2. Import the data to MongoDB Atlas
3. Update your environment variables
4. Test the connection
5. Update your application configuration

---

**Note:** The application is now configured to work with MongoDB Atlas by default. All API endpoints and database operations will use your MongoDB Atlas cluster. 