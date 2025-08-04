const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testSimpleTransaction() {
    try {
        console.log('🧪 Testing Simple Transaction...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Test DEBIT transaction
        console.log('2️⃣ Testing DEBIT transaction...');
        const debitTransaction = {
            user: { userId: 69 },
            senderAcc: { accountNumber: '17540790902157929' },
            receiverAcc: { accountNumber: '17540790902157929' },
            transactionType: 'DEBIT',
            amount: '10.00'
        };

        try {
            const debitResponse = await axios.post(`${BASE_URL}/account/DEBIT/request`, debitTransaction, {
                headers: { 
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ DEBIT transaction request created successfully');
            console.log('Response:', debitResponse.data);
        } catch (error) {
            console.log('❌ DEBIT transaction failed:');
            console.log('Status:', error.response?.status);
            console.log('Error message:', error.response?.data);
        }

        console.log('\n✅ Simple transaction test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testSimpleTransaction(); 