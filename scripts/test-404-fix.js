const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testResourceAccess() {
  console.log('🔍 Testing Cloudinary resource access...\n');

  // Test the specific public ID from the error
  const testPublicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  
  console.log(`Testing public ID: ${testPublicId}`);
  
  // Test raw resource type
  try {
    console.log('\n📄 Testing as RAW resource...');
    const rawResource = await cloudinary.api.resource(testPublicId, { 
      resource_type: 'raw' 
    });
    console.log('✅ RAW resource found:', {
      public_id: rawResource.public_id,
      format: rawResource.format,
      bytes: rawResource.bytes,
      secure_url: rawResource.secure_url,
      resource_type: rawResource.resource_type
    });
    
    // Test if URL is accessible
    console.log('\n🌐 Testing URL accessibility...');
    const response = await fetch(rawResource.secure_url);
    console.log(`URL status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
  } catch (error) {
    console.log('❌ RAW resource not found:', error.message);
  }
  
  // Test image resource type
  try {
    console.log('\n🖼️ Testing as IMAGE resource...');
    const imageResource = await cloudinary.api.resource(testPublicId, { 
      resource_type: 'image' 
    });
    console.log('✅ IMAGE resource found:', {
      public_id: imageResource.public_id,
      format: imageResource.format,
      bytes: imageResource.bytes,
      secure_url: imageResource.secure_url,
      resource_type: imageResource.resource_type
    });
  } catch (error) {
    console.log('❌ IMAGE resource not found:', error.message);
  }
  
  // List all resources in the workqit/resumes folder
  try {
    console.log('\n📁 Listing all resources in workqit/resumes folder...');
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'raw',
      max_results: 10
    });
    
    console.log(`Found ${resources.resources.length} raw resources:`);
    resources.resources.forEach(resource => {
      console.log(`- ${resource.public_id} (${resource.format}, ${resource.bytes} bytes)`);
    });
    
    // Also check image resources
    const imageResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes/',
      resource_type: 'image',
      max_results: 10
    });
    
    console.log(`\nFound ${imageResources.resources.length} image resources:`);
    imageResources.resources.forEach(resource => {
      console.log(`- ${resource.public_id} (${resource.format}, ${resource.bytes} bytes)`);
    });
    
  } catch (error) {
    console.log('❌ Error listing resources:', error.message);
  }
}

// Test the API endpoint
async function testAPIEndpoint() {
  console.log('\n🔗 Testing API endpoint...');
  
  const publicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
  const encodedPublicId = encodeURIComponent(publicId);
  
  try {
    const response = await fetch(`http://localhost:3000/api/files/resume/${encodedPublicId}`, {
      headers: {
        'Authorization': 'Bearer your-test-token-here' // You'll need a valid token
      }
    });
    
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ API endpoint working correctly');
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      console.log(`Content-Length: ${response.headers.get('content-length')}`);
    } else {
      const errorText = await response.text();
      console.log('❌ API endpoint error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ API endpoint test failed:', error.message);
  }
}

async function main() {
  try {
    await testResourceAccess();
    // await testAPIEndpoint(); // Uncomment when you have a valid auth token
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

main();