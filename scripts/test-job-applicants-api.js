const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testJobApplicantsAPI() {
  console.log('🧪 Testing Job Applicants API\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    // Test the specific job ID from the error
    const jobId = '68e30f5a164b292f1efda013';
    console.log(`\n1️⃣ Testing job ID: ${jobId}`);

    // Check if job exists
    const job = await Job.findById(jobId);
    if (job) {
      console.log('✅ Job found:', job.title);
      console.log('   Company:', job.company);
      console.log('   Employer ID:', job.employerId);
    } else {
      console.log('❌ Job not found');
      
      // List some existing jobs
      const existingJobs = await Job.find().limit(5).select('_id title company employerId');
      console.log('\n📋 Available jobs:');
      existingJobs.forEach(j => {
        console.log(`   ${j._id} - ${j.title} at ${j.company}`);
      });
      return;
    }

    // Check applications for this job
    console.log('\n2️⃣ Checking applications for this job...');
    const applications = await Application.find({ jobId }).lean();
    console.log(`   Found ${applications.length} applications`);

    if (applications.length > 0) {
      console.log('\n3️⃣ Testing application population...');
      
      for (let i = 0; i < Math.min(applications.length, 3); i++) {
        const app = applications[i];
        console.log(`\n   Application ${i + 1}:`);
        console.log(`   - ID: ${app._id}`);
        console.log(`   - Applicant ID: ${app.applicantId}`);
        console.log(`   - Status: ${app.status}`);
        console.log(`   - Has Resume: ${app.resume ? 'Yes' : 'No'}`);
        
        // Check if applicant exists
        if (app.applicantId) {
          const applicant = await User.findById(app.applicantId);
          if (applicant) {
            console.log(`   - Applicant: ${applicant.firstName} ${applicant.lastName}`);
            console.log(`   - Email: ${applicant.email}`);
          } else {
            console.log(`   ❌ Applicant not found: ${app.applicantId}`);
          }
        }
      }
    }

    // Test the population query directly
    console.log('\n4️⃣ Testing population query...');
    try {
      const populatedApps = await Application.find({ jobId })
        .populate({
          path: 'applicantId',
          select: 'firstName lastName email profile.bio profile.skills profile.experience profile.location'
        })
        .lean();
      
      console.log(`✅ Population successful: ${populatedApps.length} applications`);
      
      populatedApps.forEach((app, index) => {
        if (app.applicantId) {
          console.log(`   ${index + 1}. ${app.applicantId.firstName} ${app.applicantId.lastName}`);
        } else {
          console.log(`   ${index + 1}. ❌ Missing applicant data`);
        }
      });
      
    } catch (populationError) {
      console.log('❌ Population query failed:', populationError.message);
    }

    // Check employer access
    console.log('\n5️⃣ Checking employer access...');
    const employer = await User.findById(job.employerId);
    if (employer) {
      console.log(`✅ Employer found: ${employer.firstName} ${employer.lastName}`);
      console.log(`   Role: ${employer.role}`);
      console.log(`   Email: ${employer.email}`);
    } else {
      console.log('❌ Employer not found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testJobApplicantsAPI();