const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function checkAllApplications() {
  console.log('🧪 Checking All Applications in Database\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
    const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));

    // Get all applications
    const allApplications = await Application.find().lean();
    console.log(`📊 Total applications in database: ${allApplications.length}`);

    if (allApplications.length > 0) {
      console.log('\n📋 Applications breakdown:');
      
      // Group by job
      const applicationsByJob = {};
      allApplications.forEach(app => {
        const jobId = app.jobId.toString();
        if (!applicationsByJob[jobId]) {
          applicationsByJob[jobId] = [];
        }
        applicationsByJob[jobId].push(app);
      });

      console.log(`\n🎯 Applications grouped by job (${Object.keys(applicationsByJob).length} jobs have applications):`);
      
      for (const [jobId, apps] of Object.entries(applicationsByJob)) {
        console.log(`\n   Job ID: ${jobId}`);
        console.log(`   Applications: ${apps.length}`);
        
        // Get job details
        const job = await Job.findById(jobId);
        if (job) {
          console.log(`   Job: ${job.title} at ${job.company}`);
        } else {
          console.log(`   ❌ Job not found in database`);
        }

        // Show first few applications
        apps.slice(0, 3).forEach((app, index) => {
          console.log(`     ${index + 1}. Applicant: ${app.applicantId}, Status: ${app.status}`);
        });
        
        if (apps.length > 3) {
          console.log(`     ... and ${apps.length - 3} more`);
        }
      }

      // Check the specific job from the error
      const targetJobId = '68e30f5a164b292f1efda013';
      console.log(`\n🔍 Checking specific job: ${targetJobId}`);
      
      if (applicationsByJob[targetJobId]) {
        console.log(`   ✅ Found ${applicationsByJob[targetJobId].length} applications for this job`);
      } else {
        console.log(`   ❌ No applications found for this job`);
        
        // Check if there are applications with similar job IDs (maybe ObjectId vs string issue)
        const similarApps = allApplications.filter(app => 
          app.jobId.toString().includes('68e30f5a164b292f1efda013') ||
          app.jobId.toString().includes('68e30f5a')
        );
        
        if (similarApps.length > 0) {
          console.log(`   🔍 Found ${similarApps.length} applications with similar job IDs:`);
          similarApps.forEach(app => {
            console.log(`     - ${app.jobId} (${typeof app.jobId})`);
          });
        }
      }

    } else {
      console.log('\n❌ No applications found in database');
      
      // Check if there are any jobs
      const jobCount = await Job.countDocuments();
      console.log(`📊 Total jobs in database: ${jobCount}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkAllApplications();