const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testApplicantsWithAuth() {
  console.log('🧪 Testing Job Applicants API with Authentication\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));

    // Find an employer user
    const employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      console.log('❌ No employer found in database');
      return;
    }

    console.log('✅ Found employer:', employer.firstName, employer.lastName);

    // Find a job by this employer
    const job = await Job.findOne({ employerId: employer._id });
    if (!job) {
      console.log('❌ No job found for this employer');
      return;
    }

    console.log('✅ Found job:', job.title, 'at', job.company);
    console.log('   Job ID:', job._id);

    // Check applications for this job
    const applications = await Application.find({ jobId: job._id });
    console.log(`📊 Applications for this job: ${applications.length}`);

    if (applications.length > 0) {
      console.log('\n📋 Application details:');
      for (let i = 0; i < applications.length; i++) {
        const app = applications[i];
        console.log(`   ${i + 1}. Application ID: ${app._id}`);
        console.log(`      Applicant ID: ${app.applicantId}`);
        console.log(`      Status: ${app.status}`);
        console.log(`      Has Resume: ${app.resume ? 'Yes' : 'No'}`);
        
        // Check if applicant exists
        const applicant = await User.findById(app.applicantId);
        if (applicant) {
          console.log(`      Applicant: ${applicant.firstName} ${applicant.lastName}`);
        } else {
          console.log(`      ❌ Applicant not found`);
        }
      }
    }

    // Test the population query directly
    console.log('\n🔍 Testing population query...');
    try {
      const populatedApps = await Application.find({ jobId: job._id })
        .populate({
          path: 'applicantId',
          select: 'firstName lastName email profile.bio profile.skills profile.experience profile.location'
        })
        .lean();
      
      console.log(`✅ Population successful: ${populatedApps.length} applications`);
      
      // Test the formatting logic
      console.log('\n🔧 Testing formatting logic...');
      const formattedApplicants = populatedApps
        .filter(app => app.applicantId)
        .map(app => {
          try {
            return {
              applicationId: app._id,
              applicant: {
                id: app.applicantId._id,
                firstName: app.applicantId.firstName || 'Unknown',
                lastName: app.applicantId.lastName || 'User',
                email: app.applicantId.email || 'No email',
                bio: app.applicantId.profile?.bio || '',
                skills: app.applicantId.profile?.skills || [],
                experience: app.applicantId.profile?.experience || '',
                location: app.applicantId.profile?.location || ''
              },
              application: {
                status: app.status || 'pending',
                coverLetter: app.coverLetter || '',
                appliedDate: app.createdAt,
                feedbacks: app.feedbacks || [],
                resume: app.resume ? {
                  filename: app.resume.filename,
                  cloudinaryUrl: app.resume.cloudinaryUrl,
                  uploadedAt: app.resume.uploadedAt
                } : null
              }
            }
          } catch (formatError) {
            console.error('❌ Error formatting applicant:', formatError);
            return null;
          }
        })
        .filter(Boolean);

      console.log(`✅ Formatted ${formattedApplicants.length} applicants successfully`);

      // Show sample formatted data
      if (formattedApplicants.length > 0) {
        console.log('\n📋 Sample formatted applicant:');
        const sample = formattedApplicants[0];
        console.log('   Application ID:', sample.applicationId);
        console.log('   Applicant:', sample.applicant.firstName, sample.applicant.lastName);
        console.log('   Status:', sample.application.status);
        console.log('   Has Resume:', sample.application.resume ? 'Yes' : 'No');
      }

    } catch (populationError) {
      console.log('❌ Population query failed:', populationError.message);
      console.log('   Stack:', populationError.stack);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testApplicantsWithAuth();