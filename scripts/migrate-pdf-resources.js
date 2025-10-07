const { v2: cloudinary } = require('cloudinary');
const { MongoClient } = require('mongodb');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmydag1zp',
  api_key: process.env.CLOUDINARY_API_KEY || '725931559882733',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9zWIZi7Kgj3mtanKunN88_WfByM',
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://202311563_db_user:x3RmWVd0saZBsAaR@workqit.y7aenop.mongodb.net/workqit?retryWrites=true&w=majority';

async function migratePDFResources() {
  console.log('🔄 Starting PDF resource migration...\n');

  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('workqit');
    const usersCollection = db.collection('users');
    const applicationsCollection = db.collection('applications');

    // Find all PDF resources stored as image type
    console.log('📋 Finding PDF resources stored as image type...');
    
    const imageResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'image',
      max_results: 100
    });

    const pdfResources = imageResources.resources.filter(resource => 
      resource.format === 'pdf'
    );

    console.log(`Found ${pdfResources.length} PDF files stored as image resources`);

    for (const resource of pdfResources) {
      console.log(`\n🔄 Processing: ${resource.public_id}`);
      
      try {
        // Generate a signed URL to download the file
        const downloadUrl = cloudinary.utils.private_download_url(
          resource.public_id, 
          resource.format, 
          { resource_type: 'image' }
        );

        console.log('📥 Downloading file...');
        const response = await fetch(downloadUrl);
        
        if (!response.ok) {
          console.log(`❌ Failed to download: ${response.status} ${response.statusText}`);
          continue;
        }

        const fileBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);

        // Create new public ID for raw resource
        const newPublicId = resource.public_id.replace('workqit/resumes/', 'workqit/resumes/migrated_');

        console.log('📤 Re-uploading as raw resource...');
        
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
          }).end(buffer);
        });

        console.log('✅ Re-uploaded successfully:', uploadResult.secure_url);

        // Update database records
        console.log('🔄 Updating database records...');

        // Update users collection
        const userUpdateResult = await usersCollection.updateMany(
          { 'resume.cloudinaryPublicId': resource.public_id },
          { 
            $set: { 
              'resume.cloudinaryPublicId': uploadResult.public_id,
              'resume.cloudinaryUrl': uploadResult.secure_url,
              'resume.migratedAt': new Date()
            } 
          }
        );

        console.log(`Updated ${userUpdateResult.modifiedCount} user records`);

        // Update applications collection
        const appUpdateResult = await applicationsCollection.updateMany(
          { 'resume.cloudinaryPublicId': resource.public_id },
          { 
            $set: { 
              'resume.cloudinaryPublicId': uploadResult.public_id,
              'resume.cloudinaryUrl': uploadResult.secure_url,
              'resume.migratedAt': new Date()
            } 
          }
        );

        console.log(`Updated ${appUpdateResult.modifiedCount} application records`);

        // Test the new URL
        console.log('🧪 Testing new URL...');
        const testResponse = await fetch(uploadResult.secure_url);
        console.log(`Test result: ${testResponse.status} ${testResponse.statusText}`);

        if (testResponse.status === 200) {
          console.log('✅ Migration successful for this file');
          
          // Optionally delete the old image resource
          console.log('🗑️ Cleaning up old resource...');
          try {
            await cloudinary.uploader.destroy(resource.public_id, { resource_type: 'image' });
            console.log('✅ Old resource deleted');
          } catch (deleteError) {
            console.log('⚠️ Could not delete old resource:', deleteError.message);
          }
        } else {
          console.log('❌ New URL not accessible, keeping old resource');
        }

      } catch (error) {
        console.error(`❌ Error processing ${resource.public_id}:`, error.message);
      }

      console.log('─'.repeat(60));
    }

    console.log('\n🎉 Migration completed!');
    console.log(`Processed ${pdfResources.length} PDF resources`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function testMigration() {
  console.log('🧪 Testing migration results...\n');

  try {
    // List all resources after migration
    const rawResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'raw',
      max_results: 100
    });

    console.log(`📄 RAW resources after migration: ${rawResources.resources.length}`);
    rawResources.resources.forEach(resource => {
      console.log(`- ${resource.public_id} (${resource.bytes} bytes)`);
    });

    const imageResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'image',
      max_results: 100
    });

    const remainingPDFs = imageResources.resources.filter(r => r.format === 'pdf');
    console.log(`\n🖼️ Remaining PDF files as image resources: ${remainingPDFs.length}`);
    remainingPDFs.forEach(resource => {
      console.log(`- ${resource.public_id} (${resource.bytes} bytes)`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test-only')) {
    await testMigration();
  } else {
    await migratePDFResources();
    await testMigration();
  }
}

main();