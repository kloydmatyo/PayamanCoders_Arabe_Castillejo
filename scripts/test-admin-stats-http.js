const fetch = require('node-fetch');

async function testAdminStatsHTTP() {
  console.log('🧪 Testing Admin Stats HTTP API\n');

  try {
    // Test the admin stats API endpoint directly
    console.log('1️⃣ Testing admin stats API endpoint...');
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: No credentials/cookies since we're testing from Node.js
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   Status Text: ${response.statusText}`);

    const responseText = await response.text();
    console.log(`   Response: ${responseText}`);

    if (response.status === 401) {
      console.log('\n✅ Expected: Authentication required (no token provided)');
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

testAdminStatsHTTP();