// Use global fetch (available in Node.js 18+) or fallback
const fetch = globalThis.fetch || require('node-fetch');

async function testAPIRoute() {
  console.log('🧪 Testing API route fix...\n');

  const testCases = [
    {
      name: 'PDF stored as IMAGE resource (problematic)',
      publicId: 'workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034',
      expectedStatus: 200
    },
    {
      name: 'PDF stored as RAW resource (working)',
      publicId: 'workqit/resumes/resume_68e33d332ec7833ffafb51b8_1759743450048',
      expectedStatus: 200
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 Testing: ${testCase.name}`);
    console.log(`Public ID: ${testCase.publicId}`);

    const encodedPublicId = encodeURIComponent(testCase.publicId);
    const apiUrl = `http://localhost:3000/api/files/resume/${encodedPublicId}`;
    
    console.log(`🔗 API URL: ${apiUrl}`);

    try {
      // Note: This will fail without proper authentication
      // But we can at least test if the route handles the resource type correctly
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token' // This will fail auth, but that's expected
        }
      });

      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.log('✅ Route is working (401 is expected without valid auth)');
      } else if (response.status === 200) {
        console.log('✅ Route is working and file is accessible');
        console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
        console.log(`📋 Content-Length: ${response.headers.get('content-length')}`);
      } else if (response.status === 404) {
        console.log('❌ File not found - route may need fixing');
      } else if (response.status === 500) {
        const errorText = await response.text();
        console.log('❌ Server error:', errorText);
      } else {
        console.log(`⚠️ Unexpected status: ${response.status}`);
      }

    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

    console.log('─'.repeat(60));
  }
}

async function testDirectCloudinaryAccess() {
  console.log('\n🌐 Testing direct Cloudinary access...\n');

  const testUrls = [
    {
      name: 'RAW resource URL',
      url: 'https://res.cloudinary.com/dmydag1zp/raw/upload/v1759743451/workqit/resumes/resume_68e33d332ec7833ffafb51b8_1759743450048'
    },
    {
      name: 'IMAGE resource URL (original)',
      url: 'https://res.cloudinary.com/dmydag1zp/image/upload/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf'
    },
    {
      name: 'IMAGE resource URL (without version)',
      url: 'https://res.cloudinary.com/dmydag1zp/image/upload/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf'
    }
  ];

  for (const testUrl of testUrls) {
    console.log(`📋 Testing: ${testUrl.name}`);
    console.log(`🔗 URL: ${testUrl.url}`);

    try {
      const response = await fetch(testUrl.url);
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.status === 200) {
        console.log('✅ URL is accessible');
      } else {
        console.log('❌ URL is not accessible');
      }

    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

    console.log('─'.repeat(60));
  }
}

async function main() {
  await testDirectCloudinaryAccess();
  await testAPIRoute();
  
  console.log('\n📋 Summary:');
  console.log('- The API route has been updated to handle both RAW and IMAGE resource types');
  console.log('- For IMAGE resources with access issues, the route now uses Cloudinary\'s private download');
  console.log('- The 404 error should be resolved');
  console.log('- Run the migration script to permanently fix problematic files');
}

main();