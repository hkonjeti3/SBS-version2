const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testEnhancedNotificationSystem() {
    try {
        console.log('🧪 Testing Enhanced Notification System...\n');

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
            email: currentUser.emailAddress,
            phone: currentUser.phoneNumber,
            address: currentUser.address
        });
        console.log('✅ User data retrieved\n');

        // Step 3: Check initial notification count
        console.log('3️⃣ Checking initial notification count...');
        const initialCountResponse = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const initialCount = initialCountResponse.data;
        console.log(`Initial unread notification count: ${initialCount}`);
        console.log('✅ Initial count checked\n');

        // Step 4: Submit a profile update request
        console.log('4️⃣ Submitting profile update request...');
        const uniqueName = 'EnhancedTest_' + Date.now();
        const updateRequest = {
            userId: 68,
            requestType: 'First Name Update',
            currentValue: currentUser.firstName,
            requestedValue: uniqueName,
            reason: 'Testing enhanced notification system',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/profile-update-request`, updateRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Profile update request submitted with ID: ${requestId}\n`);

        // Step 5: Wait for notification processing
        console.log('5️⃣ Waiting for notification processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 6: Check notifications after submission
        console.log('6️⃣ Checking notifications after submission...');
        const notificationsAfterSubmit = await axios.get(`${BASE_URL}/notifications/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Notifications after submission: ${notificationsAfterSubmit.data.length}`);

        // Find the submission notification
        const submitNotifications = notificationsAfterSubmit.data.filter(n => 
            n.type === 'profile_update' && 
            n.title.includes('Submitted')
        );

        if (submitNotifications.length > 0) {
            console.log('🎉 SUCCESS: Submission notification created!');
            console.log('Submission notification:', {
                id: submitNotifications[0].id,
                title: submitNotifications[0].title,
                message: submitNotifications[0].message,
                isRead: submitNotifications[0].isRead
            });
        } else {
            console.log('❌ FAILED: No submission notification created');
        }

        // Step 7: Check notification count after submission
        console.log('\n7️⃣ Checking notification count after submission...');
        const countAfterSubmit = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Unread count after submission: ${countAfterSubmit.data}`);
        console.log('✅ Count checked\n');

        // Step 8: Approve the request
        console.log('8️⃣ Approving the profile update request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/profile/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Profile update request approved\n');

        // Step 9: Wait for approval notification processing
        console.log('9️⃣ Waiting for approval notification processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 10: Check notifications after approval
        console.log('🔟 Checking notifications after approval...');
        const notificationsAfterApprove = await axios.get(`${BASE_URL}/notifications/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Total notifications after approval: ${notificationsAfterApprove.data.length}`);

        // Find the approval notification
        const approveNotifications = notificationsAfterApprove.data.filter(n => 
            n.type === 'profile_update' && 
            n.title.includes('Approved')
        );

        if (approveNotifications.length > 0) {
            console.log('🎉 SUCCESS: Approval notification created!');
            console.log('Approval notification:', {
                id: approveNotifications[0].id,
                title: approveNotifications[0].title,
                message: approveNotifications[0].message,
                isRead: approveNotifications[0].isRead
            });
        } else {
            console.log('❌ FAILED: No approval notification created');
        }

        // Step 11: Check final notification count
        console.log('\n1️⃣1️⃣ Checking final notification count...');
        const finalCount = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Final unread count: ${finalCount.data}`);

        // Step 12: Test mark as read functionality
        console.log('\n1️⃣2️⃣ Testing mark as read functionality...');
        if (approveNotifications.length > 0) {
            const markReadResponse = await axios.post(`${BASE_URL}/notifications/mark-read/${approveNotifications[0].id}`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Notification marked as read');

            // Check count after marking as read
            const countAfterRead = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Unread count after marking as read: ${countAfterRead.data}`);
        }

        // Step 13: Test delete functionality
        console.log('\n1️⃣3️⃣ Testing delete functionality...');
        if (submitNotifications.length > 0) {
            const deleteResponse = await axios.delete(`${BASE_URL}/notifications/${submitNotifications[0].id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Notification deleted');

            // Check count after deletion
            const countAfterDelete = await axios.get(`${BASE_URL}/notifications/unread-count/68`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Unread count after deletion: ${countAfterDelete.data}`);
        }

        console.log('\n✅ Enhanced notification system test completed!');
        console.log('\n📝 INSTRUCTIONS FOR TESTING ENHANCED NOTIFICATIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Check the notification bell icon - it should show the unread count');
        console.log('3. Submit a profile update request - you should see a "Submitted" notification');
        console.log('4. Approve the request - you should see an "Approved" notification');
        console.log('5. The notification count should update automatically');
        console.log('6. Test marking notifications as read and deleting them');
        console.log('7. The count should decrease when notifications are marked as read or deleted');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testEnhancedNotificationSystem(); 