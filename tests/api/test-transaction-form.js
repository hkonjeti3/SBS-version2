const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testTransactionForm() {
    try {
        console.log('🧪 Testing Transaction Form Functionality...\n');

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

        // Step 3: Test CREDIT transaction
        console.log('\n3️⃣ Testing CREDIT transaction...');
        const creditTransaction = {
            user: { userId: 69 },
            senderAcc: { accountNumber: testAccount.accountNumber },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'CREDIT',
            amount: '100.00'
        };

        try {
            const creditResponse = await axios.post(`${BASE_URL}/account/CREDIT/request`, creditTransaction, {
                headers: { 
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ CREDIT transaction request created successfully');
            console.log('Response:', creditResponse.data);
        } catch (error) {
            console.log('❌ CREDIT transaction failed:', error.response?.data || error.message);
        }

        // Step 4: Test DEBIT transaction
        console.log('\n4️⃣ Testing DEBIT transaction...');
        const debitTransaction = {
            user: { userId: 69 },
            senderAcc: { accountNumber: testAccount.accountNumber },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'DEBIT',
            amount: '50.00'
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
            console.log('❌ DEBIT transaction failed:', error.response?.data || error.message);
        }

        // Step 5: Check pending transactions
        console.log('\n5️⃣ Checking pending transactions...');
        try {
            const pendingResponse = await axios.get(`${BASE_URL}/transactions/pending/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Found ${pendingResponse.data.length} pending transactions`);
            if (pendingResponse.data.length > 0) {
                console.log('Pending transactions:', pendingResponse.data);
            }
        } catch (error) {
            console.log('❌ Failed to get pending transactions:', error.response?.data || error.message);
        }

        console.log('\n✅ Transaction form test completed!');
        console.log('\n📝 FRONTEND TESTING INSTRUCTIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Navigate to: http://localhost:4200/customer/credit');
        console.log('3. Fill in the transaction form:');
        console.log('   - Select transaction type (Credit or Debit)');
        console.log('   - Enter amount');
        console.log('   - Enter sender account number');
        console.log('   - Enter receiver account number');
        console.log('4. Click "Submit Transaction"');
        console.log('5. Verify that you get a success message');
        console.log('6. Check that the form resets after successful submission');
        console.log('7. Note: Transactions require approval - they will be pending until approved by admin');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testTransactionForm(); 