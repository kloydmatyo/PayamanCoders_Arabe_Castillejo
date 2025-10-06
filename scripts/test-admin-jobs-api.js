#!/usr/bin/env node

/**
 * Test Admin Jobs API
 * Tests the admin jobs endpoint to see what's causing the "Failed to load jobs" error
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const User = require('../models/User.ts').default;
const Job = require('../models/Job.ts').default;

async function testAdminJobsAPI() {
  try {
    console.log('🧪 Testing Admin Jobs API\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if there are any jobs in the database
    console.log('\n1️⃣ Checking Jobs in Database...');
    const totalJobs = await Job.countDocuments();
    console.log(`   Total jobs in database: ${totalJobs}`);

    if (totalJobs === 0) {
      console.log('   ⚠️ No jobs found in database');
      console.log('   💡 Run: node scripts/create-sample-jobs.js');
    } else {
      // Get a few sample jobs
      const sampleJobs = await Job.find().limit(3).lean();
      console.log('   📋 Sample jobs:');
      sampleJobs.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} at ${job.company}`);
        console.log(`      Employer ID: ${job.employerId}`);
        console.log(`      Status: ${job.status}`);
      });
    }

    // Test 2: Check if we can populate employer data
    console.log('\n2️⃣ Testing Employer Population...');
    try {
      const jobsWithEmployer = await Job.find()
        .populate('employerId', 'firstName lastName email')
        .limit(3)
        .lean();
      
      console.log('   ✅ Employer population successful');
      jobsWithEmployer.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title}`);
        console.log(`      Employer: ${job.employerId?.firstName || 'Unknown'} ${job.employerId?.lastName || 'User'}`);
        console.log(`      Email: ${job.employerId?.email || 'No email'}`);
      });
    } catch (error) {
      console.log('   ❌ Employer population failed:', error.message);
    }

    // Test 3: Check admin user exists
    console.log('\n3️⃣ Checking Admin User...');
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      console.log('   ✅ Admin user found');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
    } else {
      console.log('   ❌ No admin user found');
      console.log('   💡 Run: node scripts/create-admin-user.js');
    }

    // Test 4: Simulate the admin API query
    console.log('\n4️⃣ Simulating Admin API Query...');
    try {
      const query = {};
      const jobs = await Job.find(query)
        .populate('employerId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      console.log(`   ✅ Query successful, found ${jobs.length} jobs`);
      
      // Format jobs like the API does
      const formattedJobs = jobs.map(job => ({
        ...job,
        employer: job.employerId,
        applicantCount: 0, // We'll skip the application count for this test
        views: job.views || 0
      }));

      console.log('   📋 Formatted jobs:');
      formattedJobs.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} at ${job.company}`);
        console.log(`      Employer: ${job.employer?.firstName || 'Unknown'} ${job.employer?.lastName || 'User'}`);
        console.log(`      Status: ${job.status}`);
      });

    } catch (error) {
      console.log('   ❌ API simulation failed:', error.message);
      console.log('   Stack:', error.stack);
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAdminJobsAPI();