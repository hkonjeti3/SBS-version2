const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testAccountCreation() {
    try {
        console.log('🧪 Testing Account Creation System...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Get current user data
        console.log('2️⃣ Getting current user data...');
        const userResponse = await axios.get(`${BASE_URL}/userProfile?id=68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const currentUser = userResponse.data;
        console.log('Current user data:', {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.emailAddress
        });
        console.log('✅ User data retrieved\n');

        // Step 3: Check initial accounts
        console.log('3️⃣ Checking initial accounts...');
        const initialAccountsResponse = await axios.get(`${BASE_URL}/accounts/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const initialAccounts = initialAccountsResponse.data;
        console.log(`Initial accounts count: ${initialAccounts.length}`);
        console.log('✅ Initial accounts checked\n');

        // Step 4: Submit an account creation request
        console.log('4️⃣ Submitting account creation request...');
        const accountRequest = {
            userId: 68,
            accountType: 'Savings Account',
            initialBalance: 500.00,
            reason: 'Testing account creation functionality',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/account-request`, accountRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Account creation request submitted with ID: ${requestId}\n`);

        // Step 5: Wait for processing
        console.log('5️⃣ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 6: Approve the account request
        console.log('6️⃣ Approving the account creation request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/account/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Account creation request approved\n');

        // Step 7: Wait for account creation processing
        console.log('7️⃣ Waiting for account creation processing...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 8: Check accounts after approval
        console.log('8️⃣ Checking accounts after approval...');
        const accountsAfterResponse = await axios.get(`${BASE_URL}/accounts/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const accountsAfter = accountsAfterResponse.data;
        console.log(`Accounts after approval: ${accountsAfter.length}`);

        if (accountsAfter.length > initialAccounts.length) {
            console.log('🎉 SUCCESS: Account was created!');
            console.log('New account details:', {
                accountNumber: accountsAfter[0].accountNumber,
                accountType: accountsAfter[0].accountType,
                balance: accountsAfter[0].balance,
                status: accountsAfter[0].status
            });
        } else {
            console.log('❌ FAILED: No new account was created');
            console.log('Available accounts:', accountsAfter);
        }

        // Step 9: Check notifications
        console.log('\n9️⃣ Checking notifications...');
        const notificationsResponse = await axios.get(`${BASE_URL}/notifications/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const notifications = notificationsResponse.data;
        
        const accountNotifications = notifications.filter(n => 
            n.type === 'account_request' && 
            n.title.includes('Account Request Approved')
        );

        if (accountNotifications.length > 0) {
            console.log('🎉 SUCCESS: Account creation notification sent!');
            console.log('Notification details:', {
                id: accountNotifications[0].id,
                title: accountNotifications[0].title,
                message: accountNotifications[0].message,
                isRead: accountNotifications[0].isRead
            });
        } else {
            console.log('❌ FAILED: No account creation notification found');
            console.log('Available notifications:', notifications.map(n => ({
                id: n.id,
                title: n.title,
                type: n.type
            })));
        }

        // Step 10: Check notification count
        console.log('\n🔟 Checking notification count...');
        const countResponse = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Unread notification count: ${countResponse.data}`);

        console.log('\n✅ Account creation test completed!');
        console.log('\n📝 INSTRUCTIONS FOR TESTING ACCOUNT CREATION:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Navigate to the Accounts page');
        console.log('3. Submit a new account creation request');
        console.log('4. Approve the request as admin');
        console.log('5. Check that the account appears in the user\'s account list');
        console.log('6. Verify that the notification count increases');
        console.log('7. Check that an account creation notification is sent');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testAccountCreation(); 