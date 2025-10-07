const { v2: cloudinary } = require('cloudinary');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testCloudinaryPDFAccess() {
  console.log('🧪 Testing Cloudinary PDF Access\n');

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('🔧 Cloudinary Configuration:');
    console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');

    // Test Cloudinary connection
    console.log('\n1️⃣ Testing Cloudinary API connection...');
    try {
      const pingResult = await cloudinary.api.ping();
      console.log('   ✅ Cloudinary API connection successful');
      console.log('   Status:', pingResult.status);
    } catch (pingError) {
      console.log('   ❌ Cloudinary API connection failed:', pingError.message);
      return;
    }

    // Test the specific problematic URL
    const problemUrl = 'https://res.cloudinary.com/dmydag1zp/image/upload/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf';
    console.log('\n2️⃣ Testing problematic PDF URL...');
    console.log('   URL:', problemUrl);

    try {
      const response = await new Promise((resolve, reject) => {
        https.get(problemUrl, (res) => {
          resolve(res);
        }).on('error', reject);
      });
      
      console.log('   Status:', response.statusCode);
      console.log('   Content-Type:', response.headers['content-type']);
      console.log('   Content-Length:', response.headers['content-length']);

      if (response.statusCode === 200) {
        console.log('   ✅ PDF is accessible via direct URL');
      } else {
        console.log('   ❌ PDF is not accessible');
      }
    } catch (fetchError) {
      console.log('   ❌ Failed to fetch PDF:', fetchError.message);
    }

    // Check if the resource exists in Cloudinary
    console.log('\n3️⃣ Checking if resource exists in Cloudinary...');
    const publicId = 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034';
    
    try {
      const resource = await cloudinary.api.resource(publicId, { resource_type: 'auto' });
      console.log('   ✅ Resource found in Cloudinary');
      console.log('   Public ID:', resource.public_id);
      console.log('   Format:', resource.format);
      console.log('   Resource Type:', resource.resource_type);
      console.log('   Secure URL:', resource.secure_url);
      console.log('   Created:', resource.created_at);
      console.log('   Size:', resource.bytes, 'bytes');
    } catch (resourceError) {
      console.log('   ❌ Resource not found in Cloudinary:', resourceError.message);
      
      // List resources in the folder to see what's available
      console.log('\n4️⃣ Listing resources in workqit/resumes folder...');
      try {
        const resources = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'workqit/resumes',
          max_results: 10,
          resource_type: 'auto'
        });
        
        console.log(`   Found ${resources.resources.length} resources:`);
        resources.resources.forEach((res, index) => {
          console.log(`   ${index + 1}. ${res.public_id} (${res.format}, ${res.bytes} bytes)`);
          console.log(`      URL: ${res.secure_url}`);
        });
      } catch (listError) {
        console.log('   ❌ Failed to list resources:', listError.message);
      }
    }

    // Test URL generation
    console.log('\n5️⃣ Testing URL generation...');
    const generatedUrl = cloudinary.url(publicId, {
      resource_type: 'auto',
      secure: true,
    });
    console.log('   Generated URL:', generatedUrl);

    // Test if the generated URL works
    try {
      const genResponse = await new Promise((resolve, reject) => {
        https.get(generatedUrl, (res) => {
          resolve(res);
        }).on('error', reject);
      });
      
      console.log('   Generated URL status:', genResponse.statusCode);
      if (genResponse.statusCode === 200) {
        console.log('   ✅ Generated URL works');
      } else {
        console.log('   ❌ Generated URL failed');
      }
    } catch (genError) {
      console.log('   ❌ Generated URL test failed:', genError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCloudinaryPDFAccess();