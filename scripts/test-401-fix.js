const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function test401Fix() {
  console.log('🧪 Testing 401 Error Fix\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find a user with a resume
    const userWithResume = await User.findOne({ 
      resume: { $exists: true },
      'resume.cloudinaryUrl': { $exists: true }
    }).select('firstName lastName resume');
    
    if (!userWithResume) {
      console.log('❌ No user with resume found for testing');
      return;
    }
    
    console.log(`📄 Testing with: ${userWithResume.firstName} ${userWithResume.lastName}`);
    console.log(`   Original URL: ${userWithResume.resume.cloudinaryUrl}`);
    
    // Extract public ID from URL
    const extractPublicId = (url) => {
      const match = url.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    };
    
    const publicId = extractPublicId(userWithResume.resume.cloudinaryUrl);
    console.log(`📋 Extracted public ID: ${publicId}`);
    
    if (!publicId) {
      console.log('❌ Could not extract public ID');
      return;
    }
    
    // Test direct Cloudinary access (should fail with 401)
    console.log('\n1️⃣ Testing direct Cloudinary access...');
    try {
      const directResponse = await fetch(userWithResume.resume.cloudinaryUrl);
      console.log(`   Status: ${directResponse.status} ${directResponse.statusText}`);
      if (directResponse.status === 401) {
        console.log('   ✅ Expected 401 - file is protected');
      } else if (directResponse.status === 200) {
        console.log('   ⚠️ File is publicly accessible');
      } else {
        console.log('   ❓ Unexpected status');
      }
    } catch (error) {
      console.log('   ❌ Direct access failed:', error.message);
    }
    
    // Test our API endpoint (should work with authentication)
    console.log('\n2️⃣ Testing our preview API endpoint...');
    const apiUrl = `http://localhost:3000/api/files/preview/${encodeURIComponent(publicId)}`;
    console.log(`   API URL: ${apiUrl}`);
    
    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`   Status: ${apiResponse.status} ${apiResponse.statusText}`);
      
      if (apiResponse.status === 401) {
        console.log('   ✅ Expected 401 - authentication required');
        console.log('   💡 This is normal when testing without authentication cookies');
      } else if (apiResponse.status === 200) {
        console.log('   ✅ Success! File served through API');
        const contentType = apiResponse.headers.get('content-type');
        console.log(`   Content-Type: ${contentType}`);
      } else {
        const errorText = await apiResponse.text();
        console.log(`   ❌ Unexpected response: ${errorText}`);
      }
    } catch (error) {
      console.log('   ❌ API test failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('   💡 Development server is not running. Start with: npm run dev');
      }
    }
    
    // Test Cloudinary API access (should work with credentials)
    console.log('\n3️⃣ Testing Cloudinary API access...');
    const { v2: cloudinary } = require('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    try {
      const resourceInfo = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
      console.log('   ✅ Cloudinary API access successful');
      console.log(`   Resource: ${resourceInfo.public_id}`);
      console.log(`   Format: ${resourceInfo.format}`);
      console.log(`   Size: ${resourceInfo.bytes} bytes`);
      console.log(`   Secure URL: ${resourceInfo.secure_url}`);
      
      // Test if we can fetch using the secure URL directly
      console.log('\n4️⃣ Testing secure URL access...');
      try {
        const secureResponse = await fetch(resourceInfo.secure_url);
        console.log(`   Status: ${secureResponse.status} ${secureResponse.statusText}`);
        if (secureResponse.status === 200) {
          console.log('   ✅ Secure URL is accessible');
        } else if (secureResponse.status === 401) {
          console.log('   ❌ Secure URL also returns 401 - file is restricted');
        }
      } catch (secureError) {
        console.log('   ❌ Secure URL test failed:', secureError.message);
      }
      
    } catch (cloudinaryError) {
      console.log('   ❌ Cloudinary API access failed:', cloudinaryError.message);
    }
    
    console.log('\n🎯 Summary:');
    console.log('   - Direct Cloudinary URLs return 401 (protected files)');
    console.log('   - Our API endpoint should proxy the files with authentication');
    console.log('   - Files need to be fetched server-side and served through our API');
    console.log('   - This approach bypasses the 401 authentication issue');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

test401Fix();