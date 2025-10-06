#!/usr/bin/env node

/**
 * Test Admin API Directly
 * Tests the admin jobs API endpoint directly to debug the "Failed to load jobs" issue
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

async function testAdminAPI() {
  console.log('🧪 Testing Admin Jobs API Directly\n');

  // Create a test JWT token for admin user
  const adminPayload = {
    userId: '507f1f77bcf86cd799439011', // Mock admin user ID
    email: 'admin@workqit.com',
    role: 'admin'
  };

  const token = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('🔑 Created test JWT token');

  // Test the admin jobs API
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/jobs',
    method: 'GET',
    headers: {
      'Cookie': `token=${token}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📡 Response Status: ${res.statusCode}`);
        console.log(`📋 Response Headers:`, res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Response Data:');
          console.log(JSON.stringify(jsonData, null, 2));
          
          if (jsonData.jobs) {
            console.log(`\n📊 Found ${jsonData.jobs.length} jobs`);
            jsonData.jobs.forEach((job, index) => {
              console.log(`${index + 1}. ${job.title} at ${job.company}`);
              console.log(`   Status: ${job.status}`);
              console.log(`   Employer: ${job.employer?.firstName || 'Unknown'} ${job.employer?.lastName || 'User'}`);
            });
          }
          
          resolve(jsonData);
        } catch (error) {
          console.log('❌ Failed to parse JSON response:');
          console.log(data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      console.log('💡 Make sure the development server is running: npm run dev');
      reject(error);
    });

    req.end();
  });
}

// Run the test
testAdminAPI()
  .then(() => {
    console.log('\n✅ Test completed successfully');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Make sure development server is running: npm run dev');
    console.log('2. Check if admin user exists: node scripts/create-admin-user.js');
    console.log('3. Check if jobs exist: node scripts/create-sample-jobs.js');
    console.log('4. Check browser console for additional errors');
  });