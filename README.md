# 🚀 WorkQit Platform

> An AI-powered career development and job placement platform connecting students, job seekers, employers, and mentors.

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.2.0-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38bdf8)](https://tailwindcss.com/)

## ✨ Features

### 🎯 For Job Seekers & Students
- **AI-Powered Resume Builder** - Create ATS-optimized resumes with AI assistance and real-time scoring
- **Smart Job Matching** - AI-powered job recommendations based on your skills and profile
- **Skill Assessments** - Take assessments and earn verified certificates with unique verification codes
- **Career Path Visualization** - Interactive D3.js career roadmaps with personalized learning paths
- **Interview Preparation** - AI-generated interview tips and practice questions using GPT-4o-mini
- **Mentorship Matching** - Connect with industry mentors and request guidance
- **Application Tracking** - Monitor all your job applications with status updates
- **Job Search & Filters** - Advanced search with location, type, and remote work filters
- **Bookmarking** - Save interesting jobs for later review
- **Real-time Notifications** - Get notified about application updates and new opportunities
- **Direct Messaging** - Communicate with employers and mentors
- **Community Forum** - Engage with peers, share experiences, and get advice
- **Webinar Attendance** - Join career development webinars from industry experts

### 💼 For Employers
- **Job Posting Management** - Create, edit, and manage job listings with rich descriptions
- **Applicant Tracking System** - Review applications, update statuses, and manage candidates
- **Employer Verification** - Build trust with AI-powered verification and trust scores
- **Analytics Dashboard** - Track job performance, applicant metrics, and hiring statistics
- **AI-Powered Screening** - Smart candidate matching based on job requirements
- **Team Collaboration** - Invite team members and assign roles (recruiter, hiring manager)
- **Application Status Management** - Update candidates through the hiring pipeline
- **Success Modal** - Beautiful confirmation when jobs are posted successfully

### 👨‍🏫 For Mentors
- **Webinar Hosting** - Create and manage career development webinars with scheduling
- **Mentorship Requests** - Accept and manage mentee connections with request tracking
- **Resource Sharing** - Share learning materials, guides, and career advice
- **Community Engagement** - Participate in community discussions and answer questions
- **Attendee Management** - Track webinar registrations and attendees
- **Impact Tracking** - Monitor your influence and total attendees reached

### 🛡️ For Administrators
- **User Management** - Comprehensive user administration across all roles
- **Verification System** - Review and approve employer verifications with AI assistance
- **Assessment Creation** - AI-assisted assessment generation using GPT-4o-mini
- **Platform Analytics** - Detailed insights with Chart.js visualizations and metrics
- **Content Moderation** - Manage community posts, resources, and user reports
- **Certificate Management** - Oversee certificate issuance and verification
- **System Monitoring** - Track platform usage and performance metrics

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React
- **Charts**: Chart.js + D3.js
- **PDF Generation**: jsPDF + html2canvas

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (Serverless)
- **Authentication**: JWT + NextAuth
- **Password Security**: bcryptjs

### Database
- **Database**: MongoDB 6.2
- **ODM**: Mongoose 8.0
- **Connection**: Native MongoDB driver with pooling

### AI & Services
- **AI Provider**: Bytez.js (GPT-4o-mini)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **OAuth**: Google Auth Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Google OAuth credentials (optional)
- Bytez API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/workqit-platform.git
cd workqit-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/workqit
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/workqit

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Bytez AI
BYTEZ_API_KEY=your-bytez-api-key

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@workqit.com
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
workqit-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Backend)
│   ├── auth/              # Authentication pages
│   ├── jobs/              # Job management
│   ├── assessments/       # Skill assessments
│   ├── resume-builder/    # Resume builder
│   └── ...                # Other feature pages
├── components/            # React Components
│   ├── atoms/            # Basic UI elements
│   ├── molecules/        # Composite components
│   ├── organisms/        # Complex components
│   ├── templates/        # Page templates
│   └── layout/           # Layout components
├── contexts/             # React Context Providers
├── hooks/                # Custom React Hooks
├── lib/                  # Utility libraries
├── models/               # Mongoose Models
├── interfaces/           # TypeScript interfaces
└── middleware.ts         # Next.js Middleware
```

## 🎨 Key Features Explained

### AI-Powered Assessment Generation
Generate comprehensive skill assessments using GPT-4o-mini via Bytez API:
```typescript
// lib/ai-assessment-generator.ts
const assessment = await generateAssessment({
  topic: "JavaScript Fundamentals",
  difficulty: "intermediate",
  questionCount: 10
});
// Returns structured assessment with questions, options, and correct answers
```

### Real-Time Updates System
Polling-based real-time system for notifications and messages (30-second intervals):
```typescript
// contexts/RealtimeContext.tsx
// Automatically polls every 30 seconds for updates
const { notifications, messages, unreadCount } = useRealtimeData();
// Manual refresh available via RefreshButton component
```

### Role-Based Access Control
Dynamic navigation and features based on user roles with custom dashboards:
```typescript
// User roles: student, job_seeker, employer, mentor, admin
// Each role gets a customized homepage and navigation
if (user.role === 'employer') {
  return <EmployerHomepage />
} else if (user.role === 'student') {
  return <StudentHomepage />
}
// Sidebar navigation adapts to user role automatically
```

### Resume Builder with ATS Scoring
AI-powered resume optimization with ATS compatibility scoring and job matching:
```typescript
// lib/resume-builder-ai.ts
const atsScore = calculateATSScore(resume, jobDescription);
// Returns score out of 100 with detailed improvement suggestions
// Analyzes keywords, formatting, and content relevance
```

### Certificate Verification System
Public certificate verification with unique codes:
```typescript
// Server-side rendered verification page
// URL: /certificates/verify/[code]
// Displays certificate details, user info, and assessment scores
// Prevents fraud with cryptographically secure verification codes
```

### Employer Verification with AI
AI-powered employer verification using document analysis:
```typescript
// lib/ai-verification-service.ts
const verificationResult = await analyzeVerificationDocuments({
  companyName,
  documents,
  website
});
// Returns trust score and verification recommendations
```

## 🔐 Authentication & Security

### Local Authentication
- Email/password registration with validation
- Secure password hashing with bcrypt (10 rounds)
- JWT token-based sessions with expiration
- HTTP-only cookies for XSS protection
- Password strength validation
- Secure password reset flow

### OAuth Integration
- Google Sign-In with Google Auth Library
- Hybrid accounts (local + OAuth)
- Automatic account linking
- Set password for OAuth accounts

### Security Features
- Role-based access control (RBAC)
- Route protection via Next.js middleware
- Input validation and sanitization
- MongoDB injection prevention
- CSRF protection via SameSite cookies
- Secure file uploads via Cloudinary

## 📊 Database Models

### Core Collections
- **users** - User accounts, profiles, and verification status
- **jobs** - Job postings with requirements and skills
- **applications** - Job applications with status tracking
- **assessments** - Skill assessments with questions and answers
- **assessment_attempts** - User assessment submissions and scores
- **certificates** - Achievement certificates with verification codes
- **webinars** - Career webinars with scheduling and attendees
- **mentorship_requests** - Mentor-mentee connection requests
- **conversations** - Direct messaging threads
- **community_posts** - Forum posts with comments and likes
- **notifications** - User notifications and alerts
- **resources** - Learning materials shared by mentors

### Key Features
- Mongoose ODM for schema validation
- Indexed fields for optimized queries
- Relationship management with population
- Timestamps on all documents
- Soft delete capabilities where needed

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Test database connection
npm run test:db
```

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js config
- Tailwind CSS for styling
- Component-based architecture

## 🚢 Deployment

### Recommended Platform: Vercel

1. **Connect your repository to Vercel**
2. **Configure environment variables** (same as `.env.local`)
3. **Deploy**

```bash
# Or deploy manually
npm run build
npm start
```

### Database: MongoDB Atlas
- Create a cluster on MongoDB Atlas
- Whitelist Vercel IP addresses
- Update `MONGODB_URI` in environment variables

### File Storage: Cloudinary
- Configure upload presets
- Set up transformation rules
- Update Cloudinary credentials

## 🔒 Security

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection
- CSRF protection via SameSite cookies

## 📈 Performance

- Next.js automatic code splitting
- Image optimization with next/image
- MongoDB connection pooling
- Efficient database indexing
- API response optimization
- Lazy loading components

## 🧪 Testing

### Recommended Testing Stack
```bash
# Unit tests
npm install --save-dev jest @testing-library/react

# E2E tests
npm install --save-dev cypress

# API tests
# Use Postman or similar tools
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/login       - User login
POST /api/auth/register    - User registration
POST /api/auth/logout      - User logout
GET  /api/user/profile     - Get current user
```

### Job Endpoints
```
GET    /api/jobs           - List jobs (with filters)
POST   /api/jobs           - Create job
GET    /api/jobs/[id]      - Get job details
PUT    /api/jobs/[id]      - Update job
DELETE /api/jobs/[id]      - Delete job
```

### AI Endpoints
```
POST /api/ai/career-suggestions  - Get career advice
POST /api/ai/interview-tips      - Get interview tips
POST /api/assessments/generate   - Generate assessment
```

See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for complete API documentation.

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Test connection
npm run test:db
```

### Environment Variables Not Loading
- Ensure `.env.local` is in the root directory
- Restart the development server
- Check for typos in variable names

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Detailed technical architecture
- [API Reference](./docs/api.md) - Complete API documentation (coming soon)
- [Component Library](./docs/components.md) - UI component guide (coming soon)

## 🗺️ Roadmap

### Phase 1 (Completed ✅)
- ✅ Core job posting and application system
- ✅ AI-powered resume builder with ATS scoring
- ✅ Skill assessments and certificates
- ✅ Certificate verification system
- ✅ Mentorship matching and requests
- ✅ Community forum with posts and comments
- ✅ Real-time notifications (polling-based)
- ✅ Webinar hosting and management
- ✅ Role-based dashboards (5 user types)
- ✅ Employer verification system
- ✅ Interview preparation with AI tips
- ✅ Career path visualization
- ✅ Direct messaging system
- ✅ Google OAuth integration
- ✅ Job search and filtering
- ✅ Application tracking system
- ✅ Admin analytics dashboard

### Phase 2 (In Progress 🔄)
- 🔄 Enhanced AI job matching algorithms
- 🔄 Advanced analytics and insights
- 🔄 Performance optimizations
- 🔄 Comprehensive testing suite
- 🔄 Mobile-responsive improvements

### Phase 3 (Planned 📋)
- 📋 WebSocket real-time messaging
- 📋 Video interview integration
- 📋 Mobile application (React Native)
- 📋 Payment processing for premium features
- 📋 Multi-language support
- 📋 Resume parsing from PDF
- 📋 Automated interview scheduling
- 📋 Company culture insights
- 📋 Advanced reporting and exports

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Full-stack development
- **Design Team** - UI/UX design
- **AI Team** - AI integration and optimization

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database
- Bytez.js for AI integration
- Cloudinary for file storage
- All open-source contributors

## 📞 Support

- **Email**: support@workqit.com
- **Documentation**: [docs.workqit.com](https://docs.workqit.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/workqit-platform/issues)

## 🌟 Star Us!

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ using Next.js, React, and TypeScript**

*Last Updated: November 28, 2025*
