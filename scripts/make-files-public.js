const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function makeFilesPublic() {
  console.log('🔓 Making Cloudinary Files Public\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Configure Cloudinary
    const { v2: cloudinary } = require('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false }));
    
    // Find all users with resumes
    console.log('1️⃣ Finding users with resumes...');
    const usersWithResumes = await User.find({ 
      resume: { $exists: true },
      'resume.cloudinaryUrl': { $exists: true }
    }).select('_id firstName lastName resume');
    
    console.log(`Found ${usersWithResumes.length} users with resumes`);
    
    // Extract public ID from URL
    const extractPublicId = (url) => {
      const match = url.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    };
    
    // Update each user's resume to be public
    console.log('\n2️⃣ Updating user resumes to public access...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of usersWithResumes) {
      try {
        const publicId = extractPublicId(user.resume.cloudinaryUrl);
        if (!publicId) {
          console.log(`⚠️ Could not extract public ID for user ${user.firstName} ${user.lastName}`);
          errorCount++;
          continue;
        }
        
        console.log(`🔄 Updating ${user.firstName} ${user.lastName}: ${publicId}`);
        
        // Try both resource types since we don't know which one it is
        let updated = false;
        
        try {
          await cloudinary.api.update(publicId, {
            resource_type: 'raw',
            access_mode: 'public'
          });
          updated = true;
          console.log(`   ✅ Updated as raw resource`);
        } catch (rawError) {
          try {
            await cloudinary.api.update(publicId, {
              resource_type: 'image',
              access_mode: 'public'
            });
            updated = true;
            console.log(`   ✅ Updated as image resource`);
          } catch (imageError) {
            console.log(`   ❌ Failed to update: ${imageError.message}`);
          }
        }
        
        if (updated) {
          successCount++;
        } else {
          errorCount++;
        }
        
      } catch (error) {
        console.log(`   ❌ Error updating ${user.firstName} ${user.lastName}: ${error.message}`);
        errorCount++;
      }
    }
    
    // Find applications with resumes
    console.log('\n3️⃣ Finding applications with resumes...');
    const applicationsWithResumes = await Application.find({
      resume: { $exists: true },
      'resume.cloudinaryUrl': { $exists: true }
    }).select('_id applicantId resume');
    
    console.log(`Found ${applicationsWithResumes.length} applications with resumes`);
    
    // Update application resumes
    console.log('\n4️⃣ Updating application resumes to public access...');
    
    for (const app of applicationsWithResumes) {
      try {
        const publicId = extractPublicId(app.resume.cloudinaryUrl);
        if (!publicId) {
          console.log(`⚠️ Could not extract public ID for application ${app._id}`);
          errorCount++;
          continue;
        }
        
        console.log(`🔄 Updating application ${app._id}: ${publicId}`);
        
        // Try both resource types
        let updated = false;
        
        try {
          await cloudinary.api.update(publicId, {
            resource_type: 'raw',
            access_mode: 'public'
          });
          updated = true;
          console.log(`   ✅ Updated as raw resource`);
        } catch (rawError) {
          try {
            await cloudinary.api.update(publicId, {
              resource_type: 'image',
              access_mode: 'public'
            });
            updated = true;
            console.log(`   ✅ Updated as image resource`);
          } catch (imageError) {
            console.log(`   ❌ Failed to update: ${imageError.message}`);
          }
        }
        
        if (updated) {
          successCount++;
        } else {
          errorCount++;
        }
        
      } catch (error) {
        console.log(`   ❌ Error updating application ${app._id}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n🎯 Summary:');
    console.log(`   ✅ Successfully updated: ${successCount} files`);
    console.log(`   ❌ Failed to update: ${errorCount} files`);
    console.log(`   📊 Total processed: ${successCount + errorCount} files`);
    
    if (successCount > 0) {
      console.log('\n🎉 Files are now publicly accessible!');
      console.log('   - Preview functionality should work without 401 errors');
      console.log('   - Files can be accessed directly with inline display flags');
      console.log('   - New uploads will be public by default');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

makeFilesPublic();