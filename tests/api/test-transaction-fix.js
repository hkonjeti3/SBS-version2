const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testTransactionFix() {
    try {
        console.log('🧪 Testing Transaction Fix...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Get user accounts to use for testing
        console.log('2️⃣ Getting user accounts...');
        const accountsResponse = await axios.get(`${BASE_URL}/accounts/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const accounts = accountsResponse.data;
        console.log(`Found ${accounts.length} accounts for user 69`);
        
        if (accounts.length === 0) {
            console.log('❌ No accounts found for testing. Please create an account first.');
            return;
        }

        const testAccount = accounts[0];
        console.log('Using account for testing:', {
            accountNumber: testAccount.accountNumber,
            accountType: testAccount.accountType,
            balance: testAccount.balance
        });

        // Step 3: Test DEBIT transaction with proper error handling
        console.log('\n3️⃣ Testing DEBIT transaction with improved error handling...');
        const debitTransaction = {
            user: { userId: 69 },
            senderAcc: { accountNumber: testAccount.accountNumber },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'DEBIT',
            amount: '25.00'
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

        // Step 4: Test with invalid account number to verify error handling
        console.log('\n4️⃣ Testing with invalid account number...');
        const invalidTransaction = {
            user: { userId: 69 },
            senderAcc: { accountNumber: 'INVALID_ACCOUNT_123' },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'CREDIT',
            amount: '50.00'
        };

        try {
            const invalidResponse = await axios.post(`${BASE_URL}/account/CREDIT/request`, invalidTransaction, {
                headers: { 
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('❌ Expected error but got success:', invalidResponse.data);
        } catch (error) {
            console.log('✅ Properly caught error for invalid account:');
            console.log('Status:', error.response?.status);
            console.log('Error message:', error.response?.data);
        }

        // Step 5: Check pending transactions
        console.log('\n5️⃣ Checking pending transactions...');
        try {
            const pendingResponse = await axios.get(`${BASE_URL}/transactions/pending/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Found ${pendingResponse.data.length} pending transactions`);
            if (pendingResponse.data.length > 0) {
                console.log('Latest pending transaction:', pendingResponse.data[0]);
            }
        } catch (error) {
            console.log('❌ Failed to get pending transactions:', error.response?.data || error.message);
        }

        console.log('\n✅ Transaction fix test completed!');
        console.log('\n📝 FRONTEND TESTING INSTRUCTIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Navigate to: http://localhost:4200/customer/credit');
        console.log('3. Fill in the transaction form:');
        console.log('   - Select transaction type (Credit or Debit)');
        console.log('   - Enter amount (e.g., 25.00)');
        console.log('   - Enter sender account number (should show actual number, not [object Object])');
        console.log('   - Enter receiver account number (should show actual number, not [object Object])');
        console.log('4. Click "Submit Transaction"');
        console.log('5. Verify that you get a success message');
        console.log('6. Check that the form resets after successful submission');
        console.log('7. Try with invalid account numbers to test error handling');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testTransactionFix(); 