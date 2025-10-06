const fetch = require('node-fetch');

async function testAdminDashboardAccess() {
  console.log('🧪 Testing Admin Dashboard Access\n');

  try {
    // Test 1: Check admin stats API without authentication
    console.log('1️⃣ Testing admin stats API without auth...');
    const response1 = await fetch('http://localhost:3000/api/admin/stats');
    console.log(`   Status: ${response1.status}`);
    
    if (response1.status === 401) {
      console.log('   ✅ Correctly requires authentication');
    } else {
      const data1 = await response1.text();
      console.log(`   Response: ${data1}`);
    }

    // Test 2: Check if the server is running
    console.log('\n2️⃣ Testing if server is accessible...');
    const response2 = await fetch('http://localhost:3000/api/test-db');
    console.log(`   Status: ${response2.status}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('   ✅ Server is accessible');
      console.log(`   Database status: ${data2.message}`);
    } else {
      console.log('   ❌ Server not accessible');
    }

    // Test 3: Check auth endpoint
    console.log('\n3️⃣ Testing auth endpoint...');
    const response3 = await fetch('http://localhost:3000/api/test-auth');
    console.log(`   Status: ${response3.status}`);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('   ✅ Auth endpoint accessible');
      console.log(`   Auth status: ${JSON.stringify(data3, null, 2)}`);
    } else {
      console.log('   ❌ Auth endpoint not accessible');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 The development server might not be running.');
      console.log('   Please start it with: npm run dev');
    }
  }
}

testAdminDashboardAccess();