const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testTransactionApprovalWorkflow() {
    try {
        console.log('🧪 Testing Complete Transaction Approval Workflow...\n');

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

        // Step 3: Submit a transaction request
        console.log('\n3️⃣ Submitting transaction request...');
        const transactionRequest = {
            user: { userId: 69 },
            senderAcc: { accountNumber: testAccount.accountNumber },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'DEBIT',
            amount: '15.00'
        };

        try {
            const submitResponse = await axios.post(`${BASE_URL}/account/DEBIT/request`, transactionRequest, {
                headers: { 
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Transaction request submitted successfully');
            console.log('Response:', submitResponse.data);
        } catch (error) {
            console.log('❌ Transaction submission failed:', error.response?.data || error.message);
            return;
        }

        // Step 4: Wait for processing
        console.log('\n4️⃣ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 5: Check pending transactions
        console.log('5️⃣ Checking pending transactions...');
        try {
            const pendingResponse = await axios.get(`${BASE_URL}/transactions/pending/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Found ${pendingResponse.data.length} pending transactions`);
            
            if (pendingResponse.data.length > 0) {
                const latestTransaction = pendingResponse.data[0];
                console.log('Latest pending transaction:', {
                    id: latestTransaction.transactionId,
                    type: latestTransaction.transactionType,
                    amount: latestTransaction.amount,
                    status: latestTransaction.status
                });
                
                // Step 6: Approve the transaction
                console.log('\n6️⃣ Approving transaction...');
                try {
                    const approveResponse = await axios.post(`${BASE_URL}/approval/transaction/approve/${latestTransaction.transactionId}`, {}, {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    });
                    console.log('✅ Transaction approved successfully');
                    console.log('Approval response:', approveResponse.data);
                } catch (error) {
                    console.log('❌ Transaction approval failed:', error.response?.data || error.message);
                }
                
                // Step 7: Check transaction history after approval
                console.log('\n7️⃣ Checking transaction history after approval...');
                try {
                    const historyResponse = await axios.get(`${BASE_URL}/transactions/history/69`, {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    });
                    console.log(`Found ${historyResponse.data.length} transactions in history`);
                    if (historyResponse.data.length > 0) {
                        console.log('Latest transaction in history:', historyResponse.data[0]);
                    }
                } catch (error) {
                    console.log('❌ Failed to get transaction history:', error.response?.data || error.message);
                }
            } else {
                console.log('No pending transactions found');
            }
        } catch (error) {
            console.log('❌ Failed to get pending transactions:', error.response?.data || error.message);
        }

        // Step 8: Test rejection workflow
        console.log('\n8️⃣ Testing rejection workflow...');
        const rejectTransactionRequest = {
            user: { userId: 69 },
            senderAcc: { accountNumber: testAccount.accountNumber },
            receiverAcc: { accountNumber: testAccount.accountNumber },
            transactionType: 'CREDIT',
            amount: '25.00'
        };

        try {
            const rejectSubmitResponse = await axios.post(`${BASE_URL}/account/CREDIT/request`, rejectTransactionRequest, {
                headers: { 
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Rejection test transaction submitted');
            
            // Wait and check for pending transactions
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const rejectPendingResponse = await axios.get(`${BASE_URL}/transactions/pending/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            
            if (rejectPendingResponse.data.length > 0) {
                const transactionToReject = rejectPendingResponse.data[0];
                console.log('Rejecting transaction:', transactionToReject.transactionId);
                
                const rejectResponse = await axios.post(`${BASE_URL}/approval/transaction/reject/${transactionToReject.transactionId}`, {
                    reason: 'Test rejection - insufficient funds'
                }, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('✅ Transaction rejected successfully');
                console.log('Rejection response:', rejectResponse.data);
            }
        } catch (error) {
            console.log('❌ Rejection test failed:', error.response?.data || error.message);
        }

        console.log('\n✅ Transaction approval workflow test completed!');
        console.log('\n📝 FRONTEND TESTING INSTRUCTIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Navigate to: http://localhost:4200/customer/credit');
        console.log('3. Submit a transaction request');
        console.log('4. Check that the transaction appears in pending transactions');
        console.log('5. As admin, approve or reject the transaction');
        console.log('6. Verify that notifications are sent to the user');
        console.log('7. Check that the transaction appears in transaction history');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testTransactionApprovalWorkflow(); 