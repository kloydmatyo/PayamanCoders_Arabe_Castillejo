#!/usr/bin/env node

/**
 * Test Admin Stats Endpoint
 * Tests the admin stats API endpoint directly to debug authentication and response issues
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

async function testAdminStatsEndpoint() {
  console.log('🧪 Testing Admin Stats Endpoint Directly\n');

  // Create a test JWT token for admin user
  const adminPayload = {
    userId: '507f1f77bcf86cd799439011', // Mock admin user ID
    email: 'admin@workqit.com',
    role: 'admin'
  };

  const token = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('🔑 Created test JWT token');

  // Test the admin stats API
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/stats',
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
          
          if (jsonData.totalUsers !== undefined) {
            console.log(`\n📊 Statistics Summary:`);
            console.log(`   Total Users: ${jsonData.totalUsers}`);
            console.log(`   Active Users: ${jsonData.activeUsers}`);
            console.log(`   Total Jobs: ${jsonData.totalJobs}`);
            console.log(`   Active Jobs: ${jsonData.activeJobs}`);
            console.log(`   Total Applications: ${jsonData.totalApplications}`);
            console.log(`   Pending Applications: ${jsonData.pendingApplications}`);
            console.log(`   Recent Activity Items: ${jsonData.recentActivity?.length || 0}`);
            
            if (jsonData.usersByRole) {
              console.log(`   User Roles:`);
              Object.entries(jsonData.usersByRole).forEach(([role, count]) => {
                console.log(`     ${role}: ${count}`);
              });
            }
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
testAdminStatsEndpoint()
  .then(() => {
    console.log('\n✅ Test completed successfully');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Make sure development server is running: npm run dev');
    console.log('2. Check if admin user exists: node scripts/create-admin-user.js');
    console.log('3. Check browser console for additional errors');
    console.log('4. Verify JWT_SECRET is set in .env.local');
  });