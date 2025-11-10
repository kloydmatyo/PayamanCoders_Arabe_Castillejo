# Data Fetching Service & Hooks Implementation

This document describes the implementation of a comprehensive data fetching service and custom hooks system for the job platform application.

## 📁 File Structure

```
/services/
  └── RequestService.tsx         # HTTP service handler for requests

/hooks/
  ├── index.ts                   # Central export for all hooks
  ├── useBaseHooks.ts           # Base hook utilities and patterns
  ├── useAuth.ts                # Authentication hooks
  ├── useJobs.ts                # Job-related hooks
  ├── useApplications.ts        # Application-related hooks
  ├── useDashboard.ts           # Dashboard hooks
  ├── useAdmin.ts               # Admin panel hooks
  ├── useUpload.ts              # File upload hooks
  └── useNotifications.ts       # Notification hooks

/interfaces/
  ├── index.ts                  # Export all interfaces
  ├── common.ts                 # Common API response interfaces
  ├── user.ts                   # User-related interfaces
  ├── job.ts                    # Job-related interfaces
  ├── application.ts            # Application-related interfaces
  └── dashboard.ts              # Dashboard-related interfaces

/constants/
  └── api.ts                    # API endpoints and constants

/examples/
  └── RefactoredJobsPage.tsx    # Example of refactored component
```

## 🛠️ Core Components

### 1. RequestService (HTTP Handler)

The `RequestService` class provides a centralized way to handle all HTTP requests with proper error handling, authentication, and response formatting.

**Key Features:**
- ✅ Automatic JSON serialization/deserialization
- ✅ Error handling and response formatting
- ✅ File upload support with FormData
- ✅ AbortController support for request cancellation
- ✅ Query parameter building utilities
- ✅ Credential management (cookies)

**Usage Example:**
```typescript
import { RequestService } from '@/services/RequestService'

// GET request
const response = await RequestService.get('/api/jobs')

// POST request
const response = await RequestService.post('/api/jobs', jobData)

// File upload
const formData = new FormData()
formData.append('resume', file)
const response = await RequestService.uploadFile('/api/upload/resume', formData)
```

### 2. Custom Hooks System

#### Base Hooks (`useBaseHooks.ts`)

Provides foundational utilities for all other hooks:

- **`useBaseState<T>`** - Basic state management for data, loading, and error
- **`useBaseMutation<TData, TVariables>`** - For create/update/delete operations
- **`useBaseQuery<T>`** - For data fetching with retry logic and caching
- **`useDebounce<T>`** - Debounces values to prevent excessive API calls
- **`useLocalStorage<T>`** - Local storage management

#### Authentication Hooks (`useAuth.ts`)

- **`useLogin()`** - User login functionality
- **`useRegister()`** - User registration
- **`useLogout()`** - User logout
- **`useProfile()`** - Fetch user profile
- **`useUpdateProfile()`** - Update user profile
- **`useGoogleCallback()`** - Google OAuth handling

#### Job Hooks (`useJobs.ts`)

- **`useJobs(params)`** - Fetch jobs list with filters and pagination
- **`useJob(id)`** - Fetch single job details
- **`useCreateJob()`** - Create new job posting
- **`useUpdateJob()`** - Update existing job
- **`useDeleteJob()`** - Delete job posting
- **`useApplyToJob()`** - Apply to a job
- **`useJobApplicants(jobId)`** - Fetch job applicants (employer only)
- **`useEmployerJobs()`** - Fetch employer's jobs
- **`useJobSearch(searchParams)`** - Job search with debouncing

#### Application Hooks (`useApplications.ts`)

- **`useApplications(params)`** - Fetch applications list
- **`useApplication(id)`** - Fetch single application
- **`useSubmitApplication()`** - Submit job application
- **`useUpdateApplicationStatus()`** - Update application status
- **`useAddApplicationFeedback()`** - Add feedback to application
- **`useDashboardApplications()`** - Fetch user's applications for dashboard
- **`useApplicationStatus(jobId)`** - Check if user applied to specific job

#### Admin Hooks (`useAdmin.ts`)

- **`useAdminStats()`** - Admin dashboard statistics
- **`useAdminJobs(params)`** - Admin jobs management
- **`useAdminUsers(params)`** - Admin users management
- **`useAdminApplications(params)`** - Admin applications overview
- **`useUpdateUserStatus()`** - Update user status
- **`useUpdateJobStatus()`** - Update job status
- **`useExportData()`** - Export system data
- **`useDeleteUser()`** - Delete user (admin only)

### 3. TypeScript Interfaces

Comprehensive type definitions for all data structures:

- **Common interfaces** - API responses, pagination, query parameters
- **User interfaces** - User profile, authentication, registration
- **Job interfaces** - Job posting, search parameters, statistics
- **Application interfaces** - Job applications, status updates, feedback
- **Dashboard interfaces** - Statistics, recommendations, admin data

### 4. API Constants

Centralized API endpoint definitions and configuration:

```typescript
import { API_ENDPOINTS } from '@/constants/api'

// Usage
const jobsResponse = await RequestService.get(API_ENDPOINTS.JOBS.LIST)
const jobResponse = await RequestService.get(API_ENDPOINTS.JOBS.BY_ID(jobId))
```

## 🚀 Usage Examples

### Basic Job Listing Component

```typescript
import { useJobs } from '@/hooks'

function JobsComponent() {
  const { jobs, loading, error, pagination, refetch } = useJobs({
    page: 1,
    limit: 10,
    type: 'full-time'
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />

  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  )
}
```

### Job Application Component

```typescript
import { useApplyToJob } from '@/hooks'

function ApplyButton({ jobId }: { jobId: string }) {
  const { applyToJob, loading, error } = useApplyToJob()

  const handleApply = async () => {
    try {
      await applyToJob(jobId, 'Cover letter text here')
      alert('Application submitted!')
    } catch (err) {
      alert('Failed to apply')
    }
  }

  return (
    <button 
      onClick={handleApply} 
      disabled={loading}
    >
      {loading ? 'Applying...' : 'Apply Now'}
    </button>
  )
}
```

### Dashboard Statistics

```typescript
import { useDashboardStats } from '@/hooks'

function DashboardStats() {
  const { stats, loading, error } = useDashboardStats()

  if (loading) return <div>Loading stats...</div>

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Applications" value={stats?.totalApplications} />
      <StatCard title="Interviews" value={stats?.interviews} />
      <StatCard title="Job Offers" value={stats?.jobOffers} />
      <StatCard title="Profile Views" value={stats?.profileViews} />
    </div>
  )
}
```

### File Upload Component

```typescript
import { useUploadResume } from '@/hooks'

function ResumeUpload() {
  const { uploadResume, loading, error } = useUploadResume()

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadResume(file)
      console.log('Resume uploaded:', result.file?.url)
    } catch (err) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <input 
      type="file" 
      accept=".pdf,.doc,.docx"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) handleFileSelect(file)
      }}
      disabled={loading}
    />
  )
}
```

## 🔄 Migration from Direct Fetch Calls

### Before (Direct Fetch)
```typescript
const [jobs, setJobs] = useState([])
const [loading, setLoading] = useState(false)

const fetchJobs = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/jobs')
    const data = await response.json()
    setJobs(data.jobs)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchJobs()
}, [])
```

### After (Custom Hook)
```typescript
const { jobs, loading, error, refetch } = useJobs()
```

## 🎯 Benefits

### 1. **Consistency**
- Standardized error handling across all API calls
- Consistent loading states and data structures
- Unified response format with proper TypeScript types

### 2. **Reusability**
- Hooks can be reused across multiple components
- Common patterns abstracted into base hooks
- Easy to maintain and update

### 3. **Type Safety**
- Full TypeScript support with proper interfaces
- Compile-time error detection
- IntelliSense support for better developer experience

### 4. **Performance**
- Built-in debouncing for search functionality
- Request cancellation with AbortController
- Optimized re-rendering with proper dependency management

### 5. **Developer Experience**
- Clean, readable code
- Easy to test and mock
- Self-documenting with TypeScript interfaces

### 6. **Error Handling**
- Centralized error management
- Consistent error messages and retry mechanisms
- Proper error boundaries and fallback UI

### 7. **Maintainability**
- Single source of truth for API endpoints
- Easy to update API calls across the entire application
- Centralized request/response handling logic

## 📝 Best Practices

### 1. **Hook Usage**
- Always destructure only what you need from hooks
- Use loading states for better UX
- Handle error cases appropriately
- Use debouncing for search inputs

### 2. **Error Handling**
- Display user-friendly error messages
- Provide retry functionality where appropriate
- Log errors for debugging purposes

### 3. **Performance**
- Use `enabled` option to conditionally fetch data
- Implement proper dependency arrays
- Consider pagination for large datasets

### 4. **Type Safety**
- Always define proper interfaces
- Use generic types where applicable
- Leverage TypeScript's strict mode

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Request Timeouts and Retries
Configure in `constants/api.ts`:
```typescript
export const REQUEST_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

This implementation provides a robust, scalable, and maintainable foundation for all data fetching operations in the application.