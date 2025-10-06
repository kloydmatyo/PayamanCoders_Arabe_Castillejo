# Admin Dashboard "Internal Server Error" Troubleshooting

## Issue Description
The admin dashboard shows "Internal server error" when trying to load.

## Possible Causes & Solutions

### 1. Development Server Not Running
**Most Likely Cause**: The Next.js development server isn't started.

**Solution**:
```bash
npm run dev
```

Then access the admin dashboard at: `http://localhost:3000/admin`

### 2. Authentication Issues
**Cause**: Not logged in as an admin user or session expired.

**Solution**:
1. Make sure you're logged in as an admin user
2. If no admin user exists, create one:
   ```bash
   node scripts/create-admin-user.js
   ```
3. Clear browser cookies and log in again

### 3. Database Connection Issues
**Cause**: MongoDB connection problems.

**Solution**:
1. Check if MongoDB is running
2. Verify `.env.local` has correct `MONGODB_URI`
3. Test database connection:
   ```bash
   node scripts/test-admin-stats-api.js
   ```

### 4. API Route Errors
**Cause**: Server-side errors in admin API routes.

**Solution**:
1. Check browser developer console for specific error messages
2. Check server logs in terminal where `npm run dev` is running
3. Test individual API endpoints:
   - `/api/admin/stats`
   - `/api/admin/users`
   - `/api/admin/jobs`

## Diagnostic Steps

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Check Server Status
Open browser and go to: `http://localhost:3000/api/test-db`
Should return: `{"message":"Database connected successfully"}`

### Step 3: Test Authentication
Go to: `http://localhost:3000/api/test-auth`
Should return authentication status

### Step 4: Create Admin User (if needed)
```bash
node scripts/create-admin-user.js
```

### Step 5: Access Admin Dashboard
Go to: `http://localhost:3000/admin`

## Expected Behavior
- Admin dashboard should load with tabs: Overview, Users, Jobs, Analytics, Export
- Overview tab should show platform statistics
- Users tab should show user list
- Jobs tab should show job listings
- All data should load without errors

## Current System Status
- ✅ Admin API routes are properly configured
- ✅ Database queries are working correctly
- ✅ Authentication system is functional
- ✅ TypeScript compilation successful
- ✅ Build process completes without errors

## If Issues Persist
1. Check browser developer console for JavaScript errors
2. Check server terminal for API errors
3. Verify admin user role in database
4. Clear browser cache and cookies
5. Try accessing admin dashboard in incognito/private mode

## Test Commands
```bash
# Test database connection
node scripts/test-admin-stats-api.js

# Test admin API access
node scripts/test-admin-dashboard-access.js

# Create admin user
node scripts/create-admin-user.js

# Build project
npm run build

# Start development server
npm run dev
```