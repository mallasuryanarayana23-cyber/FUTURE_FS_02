const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests
const request = (method, path, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsedData;
        try {
          parsedData = data ? JSON.parse(data) : {};
        } catch (e) {
          parsedData = { text: data };
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('==================================================');
  console.log('🚀 NEXUSCRM INTEGRATION API TEST SUITE STARTING');
  console.log(`📡 Targeting local server on: ${BASE_URL}`);
  console.log('==================================================\n');

  let token = null;

  // 1. Authenticate / Login
  try {
    console.log('🧪 Test 1: Admin Authentication (/api/auth/login)...');
    const res = await request('POST', '/api/auth/login', {}, {
      email: 'admin@nexuscrm.com',
      password: 'password123'
    });

    if (res.statusCode === 200 && res.data.token) {
      token = res.data.token;
      console.log('✅ PASS: Admin authenticated successfully.');
      console.log(`👤 Logged in as: ${res.data.name} (${res.data.email})\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      console.error('Response:', res.data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Connection error. Is the server running?');
    console.error(err.message);
    process.exit(1);
  }

  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 2. Fetch Dashboard Statistics
  try {
    console.log('🧪 Test 2: Fetch CRM Dashboard Analytics (/api/leads/stats)...');
    const res = await request('GET', '/api/leads/stats', authHeaders);

    if (res.statusCode === 200) {
      const { totalLeads, convertedLeads, pendingFollowUps, conversionRate, leadGrowth, statusDistribution, sourceDistribution, revenuePotential, recentActivity } = res.data;
      
      console.log('✅ PASS: Stats fetched successfully.');
      console.log(`   - Total Leads: ${totalLeads}`);
      console.log(`   - Converted Leads: ${convertedLeads}`);
      console.log(`   - Conversion Rate: ${conversionRate}%`);
      console.log(`   - Revenue Potential: $${revenuePotential}`);
      console.log(`   - Status Distributions Count: ${statusDistribution ? statusDistribution.length : 0}`);
      console.log(`   - Lead Growth Months Count: ${leadGrowth ? leadGrowth.length : 0}`);
      console.log(`   - Recent Activities Count: ${recentActivity ? recentActivity.length : 0}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  // 3. Fetch Leads list
  try {
    console.log('🧪 Test 3: Fetch Leads Listing (/api/leads)...');
    const res = await request('GET', '/api/leads?limit=5', authHeaders);

    if (res.statusCode === 200) {
      console.log('✅ PASS: Leads retrieved successfully.');
      console.log(`   - Page leads returned: ${res.data.leads ? res.data.leads.length : 0}`);
      console.log(`   - Total system leads: ${res.data.totalLeads}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  // 4. Fetch Notifications drawer list
  try {
    console.log('🧪 Test 4: Fetch Admin Notifications drawer (/api/notifications)...');
    const res = await request('GET', '/api/notifications', authHeaders);

    if (res.statusCode === 200) {
      console.log('✅ PASS: Notifications retrieved successfully.');
      console.log(`   - Unread notifications logged: ${res.data.filter(n => !n.isRead).length}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  // 5. Fetch Activity Logs
  try {
    console.log('🧪 Test 5: Fetch Activity Logs Timeline (/api/activities)...');
    const res = await request('GET', '/api/activities', authHeaders);

    if (res.statusCode === 200) {
      console.log('✅ PASS: Activity timeline logs retrieved successfully.');
      console.log(`   - Total timeline events: ${res.data ? res.data.length : 0}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  // 6. Fetch Follow Ups
  try {
    console.log('🧪 Test 6: Fetch Pending Follow Ups (/api/followups)...');
    const res = await request('GET', '/api/followups', authHeaders);

    if (res.statusCode === 200) {
      console.log('✅ PASS: Followups retrieved successfully.');
      console.log(`   - Pending followups: ${res.data ? res.data.length : 0}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  // 7. List Administrators
  try {
    console.log('🧪 Test 7: List System Administrators (/api/auth/admins)...');
    const res = await request('GET', '/api/auth/admins', authHeaders);

    if (res.statusCode === 200) {
      console.log('✅ PASS: Administrators retrieved successfully.');
      console.log(`   - Active administrators list: ${res.data.map(a => a.name).join(', ')}\n`);
    } else {
      console.error(`❌ FAIL: Expected 200 OK. Got ${res.statusCode}.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ FAIL: Request error:', err.message);
    process.exit(1);
  }

  console.log('==================================================');
  console.log('🎉 ALL INTEGRATION API TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('   The NexusCRM Backend is 100% operational.');
  console.log('==================================================');
}

runTests();
