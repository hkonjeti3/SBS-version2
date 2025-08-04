const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testFullAccountFlow() {
    try {
        console.log('🧪 Testing Full Account Creation Flow...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Submit a new account request
        console.log('2️⃣ Submitting new account request...');
        const accountRequest = {
            userId: 69,
            accountType: 'Savings Account',
            initialBalance: 250.00,
            reason: 'Testing full account flow',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/account-request`, accountRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Account request submitted with ID: ${requestId}\n`);

        // Step 3: Wait a moment
        console.log('3️⃣ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 4: Check pending requests
        console.log('4️⃣ Checking pending requests...');
        const pendingResponse = await axios.get(`${BASE_URL}/approval/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Pending requests:', pendingResponse.data);

        // Step 5: Approve the request
        console.log('5️⃣ Approving the account request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/account/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Approval response:', approveResponse.data);

        // Step 6: Wait for processing
        console.log('6️⃣ Waiting for account creation...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 7: Check accounts after approval
        console.log('7️⃣ Checking accounts after approval...');
        const accountsResponse = await axios.get(`${BASE_URL}/accounts/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Accounts after approval: ${accountsResponse.data.length}`);
        console.log('Accounts:', accountsResponse.data);

        // Step 8: Check account requests
        console.log('8️⃣ Checking account requests...');
        const requestsResponse = await axios.get(`${BASE_URL}/account-request/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Account requests:', requestsResponse.data);

        console.log('\n✅ Full account flow test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testFullAccountFlow(); 