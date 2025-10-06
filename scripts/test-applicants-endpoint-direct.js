const fetch = require('node-fetch');

async function testApplicantsEndpoint() {
  console.log('🧪 Testing Job Applicants Endpoint Directly\n');

  const jobId = '68e30f5a164b292f1efda013';
  const url = `http://localhost:3000/api/jobs/${jobId}/applicants`;

  try {
    console.log('🔍 Testing endpoint:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: No credentials since we're testing from Node.js
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📊 Response body:', responseText);

    if (response.status === 401) {
      console.log('\n✅ Expected: Authentication required (no token provided)');
      console.log('   This is normal when testing from Node.js without cookies');
    } else if (response.status === 500) {
      console.log('\n❌ Server error detected');
      try {
        const errorData = JSON.parse(responseText);
        console.log('   Error details:', errorData);
      } catch (e) {
        console.log('   Raw error response:', responseText);
      }
    } else {
      console.log('\n✅ Unexpected response - check server logs');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 The development server is not running.');
      console.log('   Please start it with: npm run dev');
    }
  }
}

testApplicantsEndpoint();