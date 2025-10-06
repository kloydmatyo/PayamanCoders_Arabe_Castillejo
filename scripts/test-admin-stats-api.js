#!/usr/bin/env node

/**
 * Test Admin Stats API
 * Tests the admin stats endpoint to debug the "Failed to load admin statistics" issue
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const User = require('../models/User.ts').default;
const Job = require('../models/Job.ts').default;
const Application = require('../models/Application.ts').default;

async function testAdminStatsAPI() {
  try {
    console.log('🧪 Testing Admin Stats API\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check basic counts
    console.log('\n1️⃣ Testing Basic Counts...');
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ emailVerified: true });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Active Users: ${activeUsers}`);
    console.log(`   Total Jobs: ${totalJobs}`);
    console.log(`   Active Jobs: ${activeJobs}`);
    console.log(`   Total Applications: ${totalApplications}`);
    console.log(`   Pending Applications: ${pendingApplications}`);

    // Test 2: Check user role aggregation
    console.log('\n2️⃣ Testing User Role Aggregation...');
    try {
      const usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      console.log('   ✅ User role aggregation successful');
      usersByRole.forEach(role => {
        console.log(`   ${role._id}: ${role.count}`);
      });
    } catch (error) {
      console.log('   ❌ User role aggregation failed:', error.message);
    }

    // Test 3: Check recent users query
    console.log('\n3️⃣ Testing Recent Users Query...');
    try {
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt role');

      console.log(`   ✅ Found ${recentUsers.length} recent users`);
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.firstName || 'Unknown'} ${user.lastName || 'User'} (${user.role})`);
      });
    } catch (error) {
      console.log('   ❌ Recent users query failed:', error.message);
    }

    // Test 4: Check recent jobs query with population
    console.log('\n4️⃣ Testing Recent Jobs Query...');
    try {
      const recentJobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('employerId', 'firstName lastName email')
        .select('title company createdAt employerId');

      console.log(`   ✅ Found ${recentJobs.length} recent jobs`);
      recentJobs.forEach((job, index) => {
        const employer = job.employerId;
        console.log(`   ${index + 1}. ${job.title} at ${job.company}`);
        console.log(`      Employer: ${employer?.firstName || 'Unknown'} ${employer?.lastName || 'Employer'}`);
      });
    } catch (error) {
      console.log('   ❌ Recent jobs query failed:', error.message);
    }

    // Test 5: Check recent applications query with population
    console.log('\n5️⃣ Testing Recent Applications Query...');
    try {
      const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('applicantId', 'firstName lastName email')
        .populate('jobId', 'title company')
        .select('applicantId jobId createdAt status');

      console.log(`   ✅ Found ${recentApplications.length} recent applications`);
      recentApplications.forEach((app, index) => {
        const applicant = app.applicantId;
        const job = app.jobId;
        console.log(`   ${index + 1}. ${applicant?.firstName || 'Unknown'} ${applicant?.lastName || 'User'} → ${job?.title || 'Unknown Job'}`);
        console.log(`      Status: ${app.status}`);
      });
    } catch (error) {
      console.log('   ❌ Recent applications query failed:', error.message);
    }

    // Test 6: Simulate complete stats API response
    console.log('\n6️⃣ Simulating Complete Stats API...');
    try {
      // Format user role counts
      const usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      const roleStats = {
        job_seeker: 0,
        employer: 0,
        mentor: 0,
        admin: 0
      };

      usersByRole.forEach((role) => {
        if (role._id in roleStats) {
          roleStats[role._id] = role.count;
        }
      });

      // Get recent activity
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('firstName lastName email createdAt role');

      const recentJobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('employerId', 'firstName lastName email')
        .select('title company createdAt employerId');

      const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('applicantId', 'firstName lastName email')
        .populate('jobId', 'title company')
        .select('applicantId jobId createdAt status');

      // Format recent activity
      const recentActivity = [
        ...recentUsers.map(user => ({
          id: user._id.toString(),
          type: 'user_registration',
          description: `${user.firstName || 'Unknown'} ${user.lastName || 'User'} registered as ${user.role}`,
          timestamp: user.createdAt.toISOString(),
          userId: user._id.toString(),
          userName: `${user.firstName || 'Unknown'} ${user.lastName || 'User'}`
        })),
        ...recentJobs.filter(job => job.employerId).map(job => ({
          id: job._id.toString(),
          type: 'job_posted',
          description: `New job posted: ${job.title} at ${job.company}`,
          timestamp: job.createdAt.toISOString(),
          userId: job.employerId._id.toString(),
          userName: `${job.employerId.firstName || 'Unknown'} ${job.employerId.lastName || 'Employer'}`
        })),
        ...recentApplications.filter(app => app.applicantId && app.jobId).map(app => ({
          id: app._id.toString(),
          type: 'application_submitted',
          description: `${app.applicantId.firstName || 'Unknown'} ${app.applicantId.lastName || 'User'} applied to ${app.jobId.title}`,
          timestamp: app.createdAt.toISOString(),
          userId: app.applicantId._id.toString(),
          userName: `${app.applicantId.firstName || 'Unknown'} ${app.applicantId.lastName || 'User'}`
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      const stats = {
        totalUsers,
        activeUsers,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        usersByRole: roleStats,
        recentActivity
      };

      console.log('   ✅ Complete stats API simulation successful');
      console.log('   📊 Stats Summary:');
      console.log(`      Users: ${stats.totalUsers} total, ${stats.activeUsers} active`);
      console.log(`      Jobs: ${stats.totalJobs} total, ${stats.activeJobs} active`);
      console.log(`      Applications: ${stats.totalApplications} total, ${stats.pendingApplications} pending`);
      console.log(`      Recent Activity: ${stats.recentActivity.length} items`);

    } catch (error) {
      console.log('   ❌ Complete stats simulation failed:', error.message);
      console.log('   Stack:', error.stack);
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAdminStatsAPI();