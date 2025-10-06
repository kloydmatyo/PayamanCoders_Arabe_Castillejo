#!/usr/bin/env node

/**
 * Diagnose Authentication Issues
 * Checks common problems with sign in/sign up
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Diagnosing Authentication Issues\n')

// Check 1: Environment variables
console.log('1️⃣ Checking Environment Variables...')
try {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    const hasMongoUri = envContent.includes('MONGODB_URI=')
    const hasJwtSecret = envContent.includes('JWT_SECRET=')
    
    console.log('   ✅ .env.local file exists')
    console.log('   MONGODB_URI:', hasMongoUri ? '✅ Present' : '❌ Missing')
    console.log('   JWT_SECRET:', hasJwtSecret ? '✅ Present' : '❌ Missing')
    
    if (envContent.includes('GOOGLE_CLIENT_ID=')) {
      console.log('   GOOGLE_CLIENT_ID: ✅ Present')
    }
  } else {
    console.log('   ❌ .env.local file not found')
  }
} catch (error) {
  console.log('   ❌ Error reading .env.local:', error.message)
}

console.log('')

// Check 2: API files
console.log('2️⃣ Checking API Files...')
const apiFiles = [
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/google/route.ts',
  'app/api/auth/google/callback/route.ts'
]

apiFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`)
  } else {
    console.log(`   ❌ ${file} missing`)
  }
})

console.log('')

// Check 3: Frontend pages
console.log('3️⃣ Checking Frontend Pages...')
const pageFiles = [
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/auth/verify-email/page.tsx'
]

pageFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`)
  } else {
    console.log(`   ❌ ${file} missing`)
  }
})

console.log('')

// Check 4: Dependencies
console.log('4️⃣ Checking Dependencies...')
try {
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    const deps = { ...packageContent.dependencies, ...packageContent.devDependencies }
    
    const requiredDeps = ['mongoose', 'bcryptjs', 'jsonwebtoken', 'next']
    requiredDeps.forEach(dep => {
      if (deps[dep]) {
        console.log(`   ✅ ${dep}: ${deps[dep]}`)
      } else {
        console.log(`   ❌ ${dep}: Missing`)
      }
    })
  }
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message)
}

console.log('')

// Check 5: Build status
console.log('5️⃣ Checking Build Status...')
const nextDir = path.join(process.cwd(), '.next')
if (fs.existsSync(nextDir)) {
  console.log('   ✅ .next directory exists (project has been built)')
} else {
  console.log('   ⚠️ .next directory missing (run npm run build)')
}

console.log('')

// Common issues and solutions
console.log('🔧 COMMON ISSUES & SOLUTIONS:')
console.log('')
console.log('❌ "Can\'t sign in or sign up" - Possible causes:')
console.log('   1. Development server not running')
console.log('      → Solution: Run "npm run dev" in terminal')
console.log('')
console.log('   2. Database connection issues')
console.log('      → Check MONGODB_URI in .env.local')
console.log('      → Verify MongoDB Atlas connection')
console.log('')
console.log('   3. Frontend JavaScript errors')
console.log('      → Open browser developer tools (F12)')
console.log('      → Check Console tab for errors')
console.log('')
console.log('   4. CORS or network issues')
console.log('      → Try different browser or incognito mode')
console.log('      → Clear browser cache and cookies')
console.log('')
console.log('   5. Environment variables not loaded')
console.log('      → Restart development server after changing .env.local')
console.log('      → Check for typos in environment variable names')
console.log('')
console.log('📋 NEXT STEPS:')
console.log('1. Start development server: npm run dev')
console.log('2. Open browser to: http://localhost:3000')
console.log('3. Try registering a new account')
console.log('4. Check browser console for any errors')
console.log('5. If still not working, check server terminal for error messages')

console.log('')
console.log('💡 TIP: If you see specific error messages, please share them for more targeted help!')