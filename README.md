# CivicTrack - Advanced Civic Complaint Tracking Platform

A comprehensive full-stack platform for citizens to report civic issues and track their resolution progress, with an advanced admin dashboard for local authorities to manage complaints efficiently.

## 🚀 New Features & Improvements

### Enhanced User Experience
- **Multi-step Complaint Form**: Intuitive wizard-style form with progress tracking
- **Public Complaints View**: Citizens can view and support community issues
- **User Profile Management**: Complete profile settings with notification preferences
- **Advanced Analytics Dashboard**: Comprehensive insights for administrators
- **Detailed Complaint View**: Full complaint details with timeline and progress tracking
- **Dark Mode Support**: System-wide theme toggle
- **Loading States & Skeletons**: Improved user experience during data loading
- **Error Boundaries**: Graceful error handling throughout the application

### Advanced Admin Features
- **Analytics Dashboard**: 
  - Real-time complaint statistics
  - Category and location breakdowns
  - Resolution rate tracking
  - Monthly trends and insights
- **Enhanced Filtering**: Advanced search and filter capabilities
- **Bulk Operations**: Efficient complaint management tools
- **Activity Timeline**: Track all complaint status changes

### Technical Improvements
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimizations**: Efficient data loading and caching
- **Security Enhancements**: JWT-based authentication with role-based access
- **Image Optimization**: Cloudinary integration for efficient image handling
- **Database Optimization**: Efficient MongoDB queries and aggregations

## 🎯 Features

### For Citizens
- **Easy Registration & Login**: JWT-based authentication system
- **Multi-step Complaint Submission**: Wizard-style form with categories, priorities, and photo upload
- **Real-time Tracking**: Monitor complaint status from submission to resolution
- **Personal Dashboard**: View all your complaints with detailed status updates
- **Profile Management**: Update personal information and notification preferences
- **Public Engagement**: View and support community complaints
- **Mobile Responsive**: Works seamlessly on all devices
- **Dark Mode Support**: Toggle between light and dark themes

### For Administrators
- **Comprehensive Admin Dashboard**: Complete overview of all complaints
- **Advanced Analytics**: Detailed insights with charts and statistics
- **Status Management**: Update complaint status and add detailed remarks
- **Advanced Filtering**: Filter by status, category, location, and date ranges
- **User Management**: View complaint submitter information
- **Activity Tracking**: Monitor all system activities and changes
- **Bulk Operations**: Efficiently manage multiple complaints
- **Export Capabilities**: Generate reports and export data

### Technical Features
- **Image Upload**: Cloudinary integration for optimized photo storage
- **Database**: MongoDB with efficient indexing and aggregations
- **Security**: JWT authentication with role-based access control
- **Real-time Updates**: Live status tracking and notifications
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized loading states and data fetching

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support
- **React Hook Form** - Form handling and validation

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database with aggregation pipelines
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Secure password hashing
- **Cloudinary** - Image storage and optimization

## 📊 Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  hashed_password: String,
  phone: String (optional),
  address: String (optional),
  bio: String (optional),
  is_admin: Boolean,
  notifications: {
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },
  created_at: Date,
  updated_at: Date
}
\`\`\`

### Complaints Collection
\`\`\`javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: users),
  title: String,
  category: String,
  description: String,
  location: String,
  priority: String,
  image_url: String (optional),
  status: String (Pending/In Progress/Resolved),
  admin_remarks: String (optional),
  upvotes: Number,
  views: Number,
  timeline: [{
    status: String,
    timestamp: Date,
    remarks: String (optional)
  }],
  created_at: Date,
  updated_at: Date
}
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/civictrack.git
   cd civictrack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civictrack
   JWT_SECRET=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The application will automatically create the necessary collections in MongoDB:

- **users**: Store user accounts and authentication data
- **complaints**: Store complaint details and status information

### Creating an Admin User

To create an admin user:

1. **Register normally** and manually update the database:
   \`\`\`javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { is_admin: true } }
   )
   \`\`\`

2. **Use the admin checkbox** during login (if the user already has admin privileges)

## 📱 Usage Guide

### For Citizens

1. **Register/Login**: Create an account or sign in to the platform
2. **Submit Complaint**: Use the multi-step wizard to submit detailed complaints
3. **Upload Photos**: Add supporting images to strengthen your complaint
4. **Track Progress**: Monitor real-time status updates in your dashboard
5. **Manage Profile**: Update personal information and notification preferences
6. **Engage Publicly**: View and support other community complaints

### For Administrators

1. **Admin Login**: Use the admin checkbox during login
2. **Dashboard Overview**: Access comprehensive complaint statistics
3. **Analytics Insights**: View detailed analytics and trends
4. **Manage Complaints**: Filter, search, and update complaint statuses
5. **Add Remarks**: Provide detailed feedback and updates to citizens
6. **Monitor Activity**: Track all system activities and changes

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login with admin support

### Complaints
- `POST /api/complaints` - Submit new complaint with image upload
- `GET /api/complaints/user/[userId]` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (admin only)
- `GET /api/complaints/public` - Get public complaints (anonymized)
- `GET /api/complaints/detail/[complaintId]` - Get detailed complaint view
- `PUT /api/complaints/update/[complaintId]` - Update complaint (admin only)
- `POST /api/complaints/upvote/[complaintId]` - Upvote complaint

### Analytics
- `GET /api/analytics` - Get comprehensive analytics data (admin only)

### User Management
- `GET /api/user/profile/[userId]` - Get user profile
- `PUT /api/user/profile/[userId]` - Update user profile

## 📂 Project Structure

\`\`\`
civictrack/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── complaints/           # Complaint management endpoints
│   │   ├── analytics/            # Analytics endpoints
│   │   └── user/                 # User management endpoints
│   ├── admin/                    # Admin pages
│   │   └── dashboard/            # Admin dashboard
│   ├── analytics/                # Analytics dashboard
│   ├── dashboard/                # User dashboard
│   ├── submit-complaint/         # Complaint submission wizard
│   ├── public-complaints/        # Public complaint viewing
│   ├── complaint/[id]/           # Individual complaint details
│   ├── profile/                  # User profile management
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── complaint-form-wizard.tsx # Multi-step complaint form
│   ├── loading-skeleton.tsx      # Loading state components
│   ├── error-boundary.tsx        # Error handling component
│   └── theme-toggle.tsx          # Dark mode toggle
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # Database connection
│   └── cloudinary.ts             # Image upload utility
├── public/                       # Static assets
└── README.md                     # Project documentation
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civictrack

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@civictrack.com
- Phone: +1 (555) 123-4567
- Create an issue on GitHub

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
- Images hosted on [Cloudinary](https://cloudinary.com/)

---

**CivicTrack** - Empowering communities through transparent civic engagement.
