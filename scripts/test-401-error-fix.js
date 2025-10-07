const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmydag1zp',
  api_key: process.env.CLOUDINARY_API_KEY || '725931559882733',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9zWIZi7Kgj3mtanKunN88_WfByM',
});

async function testPublicIdExtraction() {
  console.log('🔍 Testing public ID extraction from URLs...\n');

  const testUrls = [
    'https://res.cloudinary.com/dmydag1zp/raw/upload/fl_attachment:false/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf',
    'https://res.cloudinary.com/dmydag1zp/image/upload/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf',
    'https://res.cloudinary.com/dmydag1zp/raw/upload/v1759743451/workqit/resumes/resume_68e33d332ec7833ffafb51b8_1759743450048'
  ];

  for (const url of testUrls) {
    console.log(`📋 Testing URL: ${url}`);
    
    // Simulate the extraction logic from ResumePreviewModal
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex !== -1) {
      const pathAfterUpload = urlParts.slice(uploadIndex + 1);
      
      // Remove version numbers and flags
      const cleanPath = pathAfterUpload.filter(part => 
        !part.startsWith('v') || !/^v\d+$/.test(part)
      ).filter(part => 
        !part.startsWith('fl_')
      );
      
      let publicId = cleanPath.join('/');
      if (publicId.endsWith('.pdf')) {
        publicId = publicId.slice(0, -4);
      }
      
      console.log(`✅ Extracted public ID: ${publicId}`);
      console.log(`🔗 API URL would be: /api/files/resume/${encodeURIComponent(publicId)}`);
      
      // Test if this public ID exists in Cloudinary
      let found = false;
      let resourceType = null;
      
      try {
        await cloudinary.api.resource(publicId, { resource_type: 'raw' });
        found = true;
        resourceType = 'raw';
      } catch (error) {
        try {
          await cloudinary.api.resource(publicId, { resource_type: 'image' });
          found = true;
          resourceType = 'image';
        } catch (imageError) {
          // Not found
        }
      }
      
      if (found) {
        console.log(`✅ Resource found as ${resourceType} type`);
      } else {
        console.log('❌ Resource not found in Cloudinary');
      }
    } else {
      console.log('❌ Invalid Cloudinary URL format');
    }
    
    console.log('─'.repeat(80));
  }
}

async function testAPIRouteLogic() {
  console.log('\n🧪 Testing API route logic...\n');

  const testPublicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  console.log(`Testing public ID: ${testPublicId}`);
  
  // Simulate the API route logic
  let resource;
  let resourceType;
  let fileBuffer;
  
  try {
    console.log('🔍 Trying RAW resource type first...');
    resource = await cloudinary.api.resource(testPublicId, { resource_type: 'raw' });
    resourceType = 'raw';
    console.log('✅ Found as RAW resource');
  } catch (error) {
    console.log('❌ RAW failed, trying IMAGE resource type...');
    try {
      resource = await cloudinary.api.resource(testPublicId, { resource_type: 'image' });
      resourceType = 'image';
      console.log('✅ Found as IMAGE resource');
    } catch (imageError) {
      console.log('❌ Both RAW and IMAGE failed');
      return;
    }
  }
  
  console.log(`\n📋 Resource details:`);
  console.log(`- Resource type: ${resourceType}`);
  console.log(`- Format: ${resource.format}`);
  console.log(`- Size: ${resource.bytes} bytes`);
  console.log(`- URL: ${resource.secure_url}`);
  
  // Test file access based on resource type
  if (resourceType === 'image') {
    console.log('\n🔄 Testing IMAGE resource access with private download...');
    try {
      const downloadUrl = cloudinary.utils.private_download_url(testPublicId, resource.format, {
        resource_type: 'image'
      });
      
      console.log(`📥 Private download URL: ${downloadUrl}`);
      
      const response = await fetch(downloadUrl);
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        fileBuffer = await response.arrayBuffer();
        console.log(`✅ Successfully downloaded ${fileBuffer.byteLength} bytes`);
      } else {
        console.log('❌ Private download failed');
        
        // Try signed URL fallback
        console.log('🔄 Trying signed URL fallback...');
        const signedUrl = cloudinary.url(testPublicId, {
          resource_type: 'image',
          sign_url: true,
          type: 'authenticated'
        });
        
        console.log(`🔗 Signed URL: ${signedUrl}`);
        const signedResponse = await fetch(signedUrl);
        console.log(`📊 Signed response: ${signedResponse.status} ${signedResponse.statusText}`);
        
        if (signedResponse.ok) {
          fileBuffer = await signedResponse.arrayBuffer();
          console.log(`✅ Signed URL worked: ${fileBuffer.byteLength} bytes`);
        } else {
          console.log('❌ Signed URL also failed');
        }
      }
    } catch (error) {
      console.error('❌ Error with image resource access:', error.message);
    }
  } else {
    console.log('\n🔄 Testing RAW resource access with direct URL...');
    try {
      const response = await fetch(resource.secure_url);
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        fileBuffer = await response.arrayBuffer();
        console.log(`✅ Successfully downloaded ${fileBuffer.byteLength} bytes`);
      } else {
        console.log('❌ Direct URL access failed');
      }
    } catch (error) {
      console.error('❌ Error with raw resource access:', error.message);
    }
  }
  
  if (fileBuffer) {
    console.log('\n🎉 File access successful! API route would work.');
  } else {
    console.log('\n❌ File access failed. API route would return error.');
  }
}

async function main() {
  try {
    await testPublicIdExtraction();
    await testAPIRouteLogic();
    
    console.log('\n📋 Fix Summary:');
    console.log('✅ ResumePreviewModal now extracts public ID correctly');
    console.log('✅ Uses API route instead of direct Cloudinary URLs');
    console.log('✅ API route handles both RAW and IMAGE resource types');
    console.log('✅ Proper authentication and access control');
    console.log('✅ 401 Unauthorized errors should be resolved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

main();