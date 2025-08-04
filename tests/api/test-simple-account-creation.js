const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testSimpleAccountCreation() {
    try {
        console.log('🧪 Testing Simple Account Creation...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Check initial accounts
        console.log('2️⃣ Checking initial accounts...');
        const initialAccountsResponse = await axios.get(`${BASE_URL}/accounts/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const initialAccounts = initialAccountsResponse.data;
        console.log(`Initial accounts count: ${initialAccounts.length}`);
        console.log('✅ Initial accounts checked\n');

        // Step 3: Try to create account directly
        console.log('3️⃣ Testing direct account creation...');
        const accountData = {
            userId: 68,
            accountType: 'Savings Account',
            balance: '1000.00',
            status: 'Active'
        };

        try {
            const createResponse = await axios.post(`${BASE_URL}/account/createAccount`, accountData, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Direct account creation successful');
            console.log('Created account:', createResponse.data);
        } catch (error) {
            console.log('❌ Direct account creation failed:', error.response?.data || error.message);
        }

        // Step 4: Check accounts after direct creation
        console.log('\n4️⃣ Checking accounts after direct creation...');
        const accountsAfterResponse = await axios.get(`${BASE_URL}/accounts/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const accountsAfter = accountsAfterResponse.data;
        console.log(`Accounts after direct creation: ${accountsAfter.length}`);

        if (accountsAfter.length > initialAccounts.length) {
            console.log('🎉 SUCCESS: Direct account creation worked!');
            console.log('New account details:', accountsAfter[0]);
        } else {
            console.log('❌ FAILED: Direct account creation did not work');
        }

        console.log('\n✅ Simple account creation test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testSimpleAccountCreation(); 