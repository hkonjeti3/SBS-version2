const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testNotificationSystem() {
    try {
        console.log('🧪 Testing Notification System...\n');

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

        // Step 3: Submit a profile update request with a unique name
        console.log('3️⃣ Submitting profile update request...');
        const uniqueName = 'NotificationTest_' + Date.now();
        const updateRequest = {
            userId: 68,
            requestType: 'First Name Update',
            currentValue: currentUser.firstName,
            requestedValue: uniqueName,
            reason: 'Testing notification system functionality',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/profile-update-request`, updateRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Profile update request submitted with ID: ${requestId}\n`);

        // Step 4: Check notifications before approval
        console.log('4️⃣ Checking notifications before approval...');
        const notificationsBefore = await axios.get(`${BASE_URL}/notifications/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Notifications before approval: ${notificationsBefore.data.length}`);
        console.log('✅ Notifications checked\n');

        // Step 5: Approve the request
        console.log('5️⃣ Approving the profile update request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/profile/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Profile update request approved\n');

        // Step 6: Wait for Kafka processing
        console.log('6️⃣ Waiting for Kafka processing...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 7: Check notifications after approval
        console.log('7️⃣ Checking notifications after approval...');
        const notificationsAfter = await axios.get(`${BASE_URL}/notifications/user/68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Notifications after approval: ${notificationsAfter.data.length}`);

        // Find the new notification (look for any profile_update notification)
        const newNotifications = notificationsAfter.data.filter(n => 
            n.type === 'profile_update' && 
            n.title.includes('Profile Update')
        );

        if (newNotifications.length > 0) {
            console.log('🎉 SUCCESS: Notification created successfully!');
            console.log('Notification details:', {
                id: newNotifications[0].id,
                title: newNotifications[0].title,
                message: newNotifications[0].message,
                type: newNotifications[0].type,
                isRead: newNotifications[0].isRead
            });
            
            // Test marking notification as read
            console.log('\n8️⃣ Testing mark as read functionality...');
            const markReadResponse = await axios.post(`${BASE_URL}/notifications/mark-read/${newNotifications[0].id}`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Notification marked as read');

            // Test deleting notification
            console.log('\n9️⃣ Testing delete notification functionality...');
            const deleteResponse = await axios.delete(`${BASE_URL}/notifications/${newNotifications[0].id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Notification deleted');

        } else {
            console.log('❌ FAILED: No notification was created');
            console.log('Available notifications:', notificationsAfter.data.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                isRead: n.isRead
            })));
        }

        console.log('\n✅ Notification system test completed!');
        console.log('\n📝 INSTRUCTIONS FOR TESTING NOTIFICATIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Check the notification bell icon in the header');
        console.log('3. Click on the bell to see notifications');
        console.log('4. Verify that profile update notifications appear');
        console.log('5. Test marking notifications as read');
        console.log('6. Test deleting notifications');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testNotificationSystem(); 