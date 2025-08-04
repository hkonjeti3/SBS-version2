const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testDebugAccountCreation() {
    try {
        console.log('🧪 Debugging Account Creation Process...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Check current accounts
        console.log('2️⃣ Checking current accounts...');
        const accountsResponse = await axios.get(`${BASE_URL}/accounts/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Current accounts: ${accountsResponse.data.length}`);
        console.log('Accounts:', accountsResponse.data);

        // Step 3: Check pending account requests
        console.log('\n3️⃣ Checking pending account requests...');
        const pendingResponse = await axios.get(`${BASE_URL}/approval/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Pending requests:', pendingResponse.data);

        // Step 4: If there are pending requests, approve the first one
        if (pendingResponse.data.accountRequests && pendingResponse.data.accountRequests.length > 0) {
            const requestToApprove = pendingResponse.data.accountRequests[0];
            console.log(`\n4️⃣ Approving account request ID: ${requestToApprove.id}`);
            
            const approveResponse = await axios.post(`${BASE_URL}/approval/account/approve/${requestToApprove.id}`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Approval response:', approveResponse.data);

            // Step 5: Wait a moment
            console.log('\n5️⃣ Waiting for processing...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Step 6: Check accounts again
            console.log('\n6️⃣ Checking accounts after approval...');
            const accountsAfterResponse = await axios.get(`${BASE_URL}/accounts/user/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Accounts after approval: ${accountsAfterResponse.data.length}`);
            console.log('Accounts after approval:', accountsAfterResponse.data);

            // Step 7: Check if the account was actually created
            if (accountsAfterResponse.data.length > accountsResponse.data.length) {
                console.log('🎉 SUCCESS: New account was created!');
            } else {
                console.log('❌ FAILED: No new account was created');
                
                // Step 8: Try to create account directly
                console.log('\n8️⃣ Trying direct account creation...');
                const directCreateResponse = await axios.post(`${BASE_URL}/account/createAccount`, {
                    userId: 69,
                    accountType: 'Savings Account',
                    balance: '500.00',
                    status: 'Active'
                }, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('Direct creation response:', directCreateResponse.data);
            }
        } else {
            console.log('No pending account requests found');
        }

        console.log('\n✅ Debug test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testDebugAccountCreation(); 