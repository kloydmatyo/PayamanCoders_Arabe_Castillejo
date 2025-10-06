#!/usr/bin/env node

/**
 * Test Authentication Endpoints
 * Tests if the login and register APIs are working
 */

const http = require('http')

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        })
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints\n')

  const baseUrl = 'localhost'
  const port = 3000

  try {
    // Test 1: Register endpoint
    console.log('1️⃣ Testing Register Endpoint...')
    const registerOptions = {
      hostname: baseUrl,
      port: port,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const registerData = {
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'job_seeker'
    }

    try {
      const registerResponse = await makeRequest(registerOptions, registerData)
      console.log('   Status:', registerResponse.statusCode)
      console.log('   Response:', registerResponse.body.substring(0, 200))
      
      if (registerResponse.statusCode === 200 || registerResponse.statusCode === 400) {
        console.log('   ✅ Register endpoint is responding')
      } else {
        console.log('   ❌ Register endpoint returned unexpected status')
      }
    } catch (error) {
      console.log('   ❌ Register endpoint error:', error.message)
    }

    console.log('')

    // Test 2: Login endpoint
    console.log('2️⃣ Testing Login Endpoint...')
    const loginOptions = {
      hostname: baseUrl,
      port: port,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    }

    try {
      const loginResponse = await makeRequest(loginOptions, loginData)
      console.log('   Status:', loginResponse.statusCode)
      console.log('   Response:', loginResponse.body.substring(0, 200))
      
      if (loginResponse.statusCode === 200 || loginResponse.statusCode === 401 || loginResponse.statusCode === 403) {
        console.log('   ✅ Login endpoint is responding')
      } else {
        console.log('   ❌ Login endpoint returned unexpected status')
      }
    } catch (error) {
      console.log('   ❌ Login endpoint error:', error.message)
    }

    console.log('')

    // Test 3: Check if server is running
    console.log('3️⃣ Testing Server Status...')
    const healthOptions = {
      hostname: baseUrl,
      port: port,
      path: '/',
      method: 'GET'
    }

    try {
      const healthResponse = await makeRequest(healthOptions)
      console.log('   Status:', healthResponse.statusCode)
      
      if (healthResponse.statusCode === 200) {
        console.log('   ✅ Development server is running')
      } else {
        console.log('   ❌ Development server returned unexpected status')
      }
    } catch (error) {
      console.log('   ❌ Development server error:', error.message)
      console.log('   💡 Make sure to run "npm run dev" in another terminal')
    }

  } catch (error) {
    console.error('💥 Test error:', error)
  }

  console.log('\n📋 TROUBLESHOOTING STEPS:')
  console.log('1. Make sure development server is running: npm run dev')
  console.log('2. Check if MongoDB connection is working')
  console.log('3. Verify environment variables in .env.local')
  console.log('4. Check browser console for frontend errors')
  console.log('5. Try clearing browser cache and cookies')
}

testAuthEndpoints()