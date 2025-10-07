const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmydag1zp',
  api_key: process.env.CLOUDINARY_API_KEY || '725931559882733',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9zWIZi7Kgj3mtanKunN88_WfByM',
});

async function fixFilePermissions() {
  console.log('🔧 Fixing Cloudinary file permissions...\n');

  const problematicPublicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  try {
    console.log(`📋 Checking current resource: ${problematicPublicId}`);
    
    // Get current resource details
    const resource = await cloudinary.api.resource(problematicPublicId, { 
      resource_type: 'image' 
    });
    
    console.log('Current resource details:', {
      public_id: resource.public_id,
      format: resource.format,
      resource_type: resource.resource_type,
      access_mode: resource.access_mode,
      secure_url: resource.secure_url
    });
    
    // Try to update the resource to make it publicly accessible
    console.log('\n🔄 Updating resource access mode...');
    
    const updateResult = await cloudinary.uploader.explicit(problematicPublicId, {
      resource_type: 'image',
      type: 'upload',
      access_mode: 'public'
    });
    
    console.log('✅ Update successful:', {
      public_id: updateResult.public_id,
      access_mode: updateResult.access_mode,
      secure_url: updateResult.secure_url
    });
    
    // Test the updated URL
    console.log('\n🌐 Testing updated URL...');
    const response = await fetch(updateResult.secure_url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log('✅ File is now accessible!');
    } else {
      console.log('❌ File is still not accessible');
      
      // Try alternative approach - re-upload with correct settings
      console.log('\n🔄 Trying alternative approach - checking if we can transform the resource type...');
      
      // Get the file content
      const fileResponse = await fetch(updateResult.secure_url);
      if (fileResponse.ok) {
        const fileBuffer = await fileResponse.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        
        // Re-upload as raw resource type
        const newPublicId = `${problematicPublicId}_fixed`;
        const reuploadResult = await cloudinary.uploader.upload_stream({
          public_id: newPublicId,
          resource_type: 'raw',
          access_mode: 'public',
          folder: 'workqit/resumes'
        }, (error, result) => {
          if (error) {
            console.error('Re-upload failed:', error);
          } else {
            console.log('✅ Re-uploaded as RAW resource:', result.secure_url);
          }
        }).end(buffer);
        
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing permissions:', error);
    
    // Alternative: Try to get a signed URL for temporary access
    console.log('\n🔄 Trying to generate signed URL...');
    try {
      const signedUrl = cloudinary.utils.private_download_url(problematicPublicId, 'pdf', {
        resource_type: 'image',
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      });
      
      console.log('✅ Generated signed URL:', signedUrl);
      
      // Test signed URL
      const signedResponse = await fetch(signedUrl);
      console.log(`Signed URL status: ${signedResponse.status} ${signedResponse.statusText}`);
      
    } catch (signedError) {
      console.error('❌ Signed URL generation failed:', signedError);
    }
  }
}

async function listAllResources() {
  console.log('\n📁 Listing all resume resources for analysis...\n');
  
  try {
    // List raw resources
    const rawResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'raw',
      max_results: 50
    });
    
    console.log(`📄 RAW Resources (${rawResources.resources.length}):`);
    rawResources.resources.forEach(resource => {
      console.log(`- ${resource.public_id}`);
      console.log(`  Format: ${resource.format || 'unknown'}`);
      console.log(`  Size: ${resource.bytes} bytes`);
      console.log(`  Access: ${resource.access_mode || 'unknown'}`);
      console.log(`  URL: ${resource.secure_url}`);
      console.log('');
    });
    
    // List image resources
    const imageResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'image',
      max_results: 50
    });
    
    console.log(`🖼️ IMAGE Resources (${imageResources.resources.length}):`);
    imageResources.resources.forEach(resource => {
      console.log(`- ${resource.public_id}`);
      console.log(`  Format: ${resource.format || 'unknown'}`);
      console.log(`  Size: ${resource.bytes} bytes`);
      console.log(`  Access: ${resource.access_mode || 'unknown'}`);
      console.log(`  URL: ${resource.secure_url}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error listing resources:', error);
  }
}

async function main() {
  try {
    await listAllResources();
    await fixFilePermissions();
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

main();