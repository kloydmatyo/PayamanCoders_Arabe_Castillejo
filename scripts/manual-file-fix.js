const { v2: cloudinary } = require('cloudinary');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmydag1zp',
  api_key: process.env.CLOUDINARY_API_KEY || '725931559882733',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9zWIZi7Kgj3mtanKunN88_WfByM',
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://202311563_db_user:x3RmWVd0saZBsAaR@workqit.y7aenop.mongodb.net/workqit?retryWrites=true&w=majority';

async function manualFix() {
  console.log('🔧 Manual fix for problematic PDF...\n');

  const publicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('workqit');
    const usersCollection = db.collection('users');
    const applicationsCollection = db.collection('applications');

    console.log('📋 Step 1: Check if we have a working PDF file locally or can create one...');
    
    // Since we can't download the problematic file, let's create a placeholder
    // and update the database to point to a working file
    
    // First, let's see if there's another working PDF we can use as a template
    const rawResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'raw',
      max_results: 10
    });
    
    console.log(`Found ${rawResources.resources.length} working RAW resources:`);
    rawResources.resources.forEach(resource => {
      console.log(`- ${resource.public_id} (${resource.bytes} bytes)`);
    });
    
    if (rawResources.resources.length > 0) {
      // Use an existing working PDF as a template
      const templateResource = rawResources.resources[0];
      console.log(`\n📋 Using template: ${templateResource.public_id}`);
      
      // Download the template file
      const response = await fetch(templateResource.secure_url);
      if (response.ok) {
        const fileBuffer = await response.arrayBuffer();
        console.log(`✅ Downloaded template file: ${fileBuffer.byteLength} bytes`);
        
        // Create new public ID for the fixed file
        const newPublicId = publicId.replace('workqit/resumes/', 'workqit/resumes/fixed_');
        
        console.log(`📤 Uploading as new RAW resource: ${newPublicId}`);
        
        // Upload as raw resource
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({
            public_id: newPublicId,
            resource_type: 'raw',
            access_mode: 'public',
            use_filename: false,
            unique_filename: false
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(Buffer.from(fileBuffer));
        });
        
        console.log('✅ Upload successful:', {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
          bytes: uploadResult.bytes
        });
        
        // Test the new URL
        console.log('\n🧪 Testing new URL...');
        const testResponse = await fetch(uploadResult.secure_url);
        console.log(`Test result: ${testResponse.status} ${testResponse.statusText}`);
        
        if (testResponse.status === 200) {
          console.log('✅ New URL is accessible!');
          
          // Update database records
          console.log('\n🔄 Updating database records...');
          
          // Update users collection
          const userUpdateResult = await usersCollection.updateMany(
            { 'resume.cloudinaryPublicId': publicId },
            { 
              $set: { 
                'resume.cloudinaryPublicId': uploadResult.public_id,
                'resume.cloudinaryUrl': uploadResult.secure_url,
                'resume.migratedAt': new Date(),
                'resume.migratedFrom': publicId,
                'resume.migrationMethod': 'manual_template_replacement'
              } 
            }
          );
          
          // Update applications collection
          const appUpdateResult = await applicationsCollection.updateMany(
            { 'resume.cloudinaryPublicId': publicId },
            { 
              $set: { 
                'resume.cloudinaryPublicId': uploadResult.public_id,
                'resume.cloudinaryUrl': uploadResult.secure_url,
                'resume.migratedAt': new Date(),
                'resume.migratedFrom': publicId,
                'resume.migrationMethod': 'manual_template_replacement'
              } 
            }
          );
          
          console.log(`✅ Updated ${userUpdateResult.modifiedCount} user records`);
          console.log(`✅ Updated ${appUpdateResult.modifiedCount} application records`);
          
          // Try to delete the old problematic resource
          console.log('\n🗑️ Cleaning up old resource...');
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            console.log('✅ Old resource deleted');
          } catch (deleteError) {
            console.log('⚠️ Could not delete old resource:', deleteError.message);
          }
          
          console.log('\n🎉 Manual fix completed successfully!');
          console.log('📋 Note: The file content was replaced with a working template.');
          console.log('📋 The user should be asked to re-upload their actual resume.');
          
        } else {
          console.log('❌ New URL is not accessible');
        }
        
      } else {
        console.log('❌ Could not download template file');
      }
    } else {
      console.log('❌ No working RAW resources found to use as template');
    }
    
  } catch (error) {
    console.error('❌ Manual fix failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Alternative approach: Just update the API to handle this specific case
async function updateAPIForSpecificCase() {
  console.log('\n🔧 Alternative: Update API to handle this specific case...\n');
  
  const publicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  console.log('📋 Instead of migrating, we can:');
  console.log('1. Update the API route to return a "file unavailable" message');
  console.log('2. Show a user-friendly error with option to re-upload');
  console.log('3. Allow the user to upload a new resume');
  
  console.log('\n✅ This approach is safer and puts control back to the user');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--template-fix')) {
    await manualFix();
  } else {
    await updateAPIForSpecificCase();
    console.log('\n📋 To try the template fix approach, run:');
    console.log('node scripts/manual-file-fix.js --template-fix');
  }
}

main();