const { v2: cloudinary } = require('cloudinary');
const { MongoClient } = require('mongodb');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmydag1zp',
  api_key: process.env.CLOUDINARY_API_KEY || '725931559882733',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9zWIZi7Kgj3mtanKunN88_WfByM',
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://202311563_db_user:x3RmWVd0saZBsAaR@workqit.y7aenop.mongodb.net/workqit?retryWrites=true&w=majority';

async function migrateSpecificFile() {
  console.log('🔄 Migrating specific problematic file...\n');

  const publicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('workqit');
    const usersCollection = db.collection('users');
    const applicationsCollection = db.collection('applications');

    console.log(`📋 Processing: ${publicId}`);
    
    // Check if the resource exists as image type
    let resource;
    try {
      resource = await cloudinary.api.resource(publicId, { resource_type: 'image' });
      console.log('✅ Found as IMAGE resource:', {
        format: resource.format,
        bytes: resource.bytes,
        secure_url: resource.secure_url
      });
    } catch (error) {
      console.log('❌ Resource not found as image type:', error.message);
      return;
    }

    // Try multiple methods to download the file
    let fileBuffer;
    let downloadSuccess = false;
    let method = '';

    // Method 1: Try direct URL (sometimes works)
    try {
      console.log('🔄 Trying direct URL access...');
      const response = await fetch(resource.secure_url);
      if (response.ok) {
        fileBuffer = await response.arrayBuffer();
        downloadSuccess = true;
        method = 'direct URL';
        console.log('✅ Direct URL access successful');
      } else {
        console.log(`❌ Direct URL failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log('❌ Direct URL error:', error.message);
    }

    // Method 2: Private download URL
    if (!downloadSuccess) {
      try {
        console.log('🔄 Trying private download URL...');
        const downloadUrl = cloudinary.utils.private_download_url(publicId, resource.format, {
          resource_type: 'image'
        });
        
        console.log('📥 Private download URL:', downloadUrl);
        const response = await fetch(downloadUrl);
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
          downloadSuccess = true;
          method = 'private download';
          console.log('✅ Private download successful');
        } else {
          console.log(`❌ Private download failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log('❌ Private download error:', error.message);
      }
    }

    // Method 3: Admin API with basic auth
    if (!downloadSuccess) {
      try {
        console.log('🔄 Trying admin API with auth...');
        const authString = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
        
        const response = await fetch(resource.secure_url, {
          headers: {
            'Authorization': `Basic ${authString}`,
            'User-Agent': 'WorkQit-Migration/1.0'
          }
        });
        
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
          downloadSuccess = true;
          method = 'admin auth';
          console.log('✅ Admin auth successful');
        } else {
          console.log(`❌ Admin auth failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log('❌ Admin auth error:', error.message);
      }
    }

    // Method 4: Try using Cloudinary's upload API to copy the resource
    if (!downloadSuccess) {
      try {
        console.log('🔄 Trying Cloudinary copy method...');
        
        // Use Cloudinary's explicit method to convert resource type
        const copyResult = await cloudinary.uploader.explicit(publicId, {
          resource_type: 'image',
          type: 'upload',
          eager: [
            { resource_type: 'raw' }
          ]
        });
        
        console.log('Copy result:', copyResult);
        
        if (copyResult && copyResult.eager && copyResult.eager[0]) {
          const rawUrl = copyResult.eager[0].secure_url;
          const response = await fetch(rawUrl);
          if (response.ok) {
            fileBuffer = await response.arrayBuffer();
            downloadSuccess = true;
            method = 'cloudinary copy';
            console.log('✅ Cloudinary copy successful');
          }
        }
      } catch (error) {
        console.log('❌ Cloudinary copy error:', error.message);
      }
    }

    if (!downloadSuccess) {
      console.log('❌ All download methods failed. File may be corrupted or inaccessible.');
      return;
    }

    console.log(`\n✅ File downloaded successfully using: ${method}`);
    console.log(`📊 File size: ${fileBuffer.byteLength} bytes`);

    // Create new public ID for raw resource
    const newPublicId = publicId.replace('workqit/resumes/', 'workqit/resumes/fixed_');
    
    console.log(`\n📤 Re-uploading as raw resource: ${newPublicId}`);

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
    console.log('\n🧪 Testing new URL accessibility...');
    const testResponse = await fetch(uploadResult.secure_url);
    console.log(`Test result: ${testResponse.status} ${testResponse.statusText}`);
    
    if (testResponse.status !== 200) {
      console.log('❌ New URL is not accessible. Aborting migration.');
      return;
    }

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
          'resume.migrationMethod': method
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
          'resume.migrationMethod': method
        } 
      }
    );

    console.log(`✅ Updated ${userUpdateResult.modifiedCount} user records`);
    console.log(`✅ Updated ${appUpdateResult.modifiedCount} application records`);

    // Delete the old image resource
    console.log('\n🗑️ Cleaning up old resource...');
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      console.log('✅ Old resource deleted');
    } catch (deleteError) {
      console.log('⚠️ Could not delete old resource:', deleteError.message);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`📋 Summary:`);
    console.log(`- Old public ID: ${publicId}`);
    console.log(`- New public ID: ${uploadResult.public_id}`);
    console.log(`- New URL: ${uploadResult.secure_url}`);
    console.log(`- Method used: ${method}`);
    console.log(`- Users updated: ${userUpdateResult.modifiedCount}`);
    console.log(`- Applications updated: ${appUpdateResult.modifiedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

migrateSpecificFile();