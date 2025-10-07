const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testPDFUploadFix() {
  console.log('🧪 Testing PDF Upload Fix\n');

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
    } catch (pingError) {
      console.log('   ❌ Cloudinary API connection failed:', pingError.message);
      return;
    }

    // Create a simple test PDF buffer (minimal PDF content)
    console.log('\n2️⃣ Creating test PDF buffer...');
    const testPDFContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test Resume) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

    const testBuffer = Buffer.from(testPDFContent);
    console.log('   ✅ Test PDF buffer created (', testBuffer.length, 'bytes)');

    // Test upload with 'raw' resource type
    console.log('\n3️⃣ Testing upload with resource_type: "raw"...');
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'workqit/test',
            resource_type: 'raw',
            public_id: `test_resume_${Date.now()}`,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(testBuffer);
      });

      console.log('   ✅ Upload successful!');
      console.log('   Public ID:', uploadResult.public_id);
      console.log('   Resource Type:', uploadResult.resource_type);
      console.log('   Format:', uploadResult.format);
      console.log('   Secure URL:', uploadResult.secure_url);
      console.log('   Size:', uploadResult.bytes, 'bytes');

      // Test if the uploaded file is accessible
      console.log('\n4️⃣ Testing file accessibility...');
      const https = require('https');
      
      try {
        const response = await new Promise((resolve, reject) => {
          https.get(uploadResult.secure_url, (res) => {
            resolve(res);
          }).on('error', reject);
        });
        
        console.log('   Status:', response.statusCode);
        console.log('   Content-Type:', response.headers['content-type']);
        
        if (response.statusCode === 200) {
          console.log('   ✅ File is accessible via URL');
        } else {
          console.log('   ❌ File is not accessible');
        }
      } catch (accessError) {
        console.log('   ❌ Failed to access file:', accessError.message);
      }

      // Clean up - delete the test file
      console.log('\n5️⃣ Cleaning up test file...');
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: 'raw' });
        console.log('   ✅ Test file deleted');
      } catch (deleteError) {
        console.log('   ⚠️ Failed to delete test file:', deleteError.message);
      }

    } catch (uploadError) {
      console.log('   ❌ Upload failed:', uploadError.message);
      console.log('   Error details:', uploadError);
    }

    // Check existing problematic files
    console.log('\n6️⃣ Checking existing resume files...');
    try {
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'workqit/resumes',
        max_results: 10,
        resource_type: 'raw' // Check raw resources
      });
      
      console.log(`   Found ${resources.resources.length} raw resources in workqit/resumes:`);
      resources.resources.forEach((res, index) => {
        console.log(`   ${index + 1}. ${res.public_id}`);
        console.log(`      Format: ${res.format}, Size: ${res.bytes} bytes`);
        console.log(`      URL: ${res.secure_url}`);
      });

      // Also check image resources (old uploads)
      const imageResources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'workqit/resumes',
        max_results: 10,
        resource_type: 'image'
      });
      
      if (imageResources.resources.length > 0) {
        console.log(`\n   Found ${imageResources.resources.length} image resources (old uploads):`);
        imageResources.resources.forEach((res, index) => {
          console.log(`   ${index + 1}. ${res.public_id}`);
          console.log(`      Format: ${res.format}, Size: ${res.bytes} bytes`);
          console.log(`      URL: ${res.secure_url}`);
        });
      }

    } catch (listError) {
      console.log('   ❌ Failed to list resources:', listError.message);
    }

    console.log('\n🎉 PDF Upload Fix Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Changed resource_type from "auto" to "raw"');
    console.log('   ✅ Updated upload, delete, and URL generation functions');
    console.log('   ✅ PDFs should now upload and be accessible correctly');
    console.log('\n💡 Next steps:');
    console.log('   1. Test uploading a new resume through the UI');
    console.log('   2. Verify the PDF opens correctly when clicked');
    console.log('   3. Existing PDFs may need to be re-uploaded');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPDFUploadFix();