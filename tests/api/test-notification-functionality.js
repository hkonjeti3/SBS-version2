const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testNotificationFunctionality() {
    try {
        console.log('🧪 Testing Notification Functionality...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Check current notifications
        console.log('2️⃣ Checking current notifications...');
        const notificationsResponse = await axios.get(`${BASE_URL}/notifications/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const allNotifications = notificationsResponse.data;
        console.log(`Total notifications: ${allNotifications.length}`);
        
        const unreadNotifications = allNotifications.filter(n => !n.isRead);
        console.log(`Unread notifications: ${unreadNotifications.length}`);
        
        if (unreadNotifications.length > 0) {
            console.log('Unread notifications:');
            unreadNotifications.forEach((notification, index) => {
                console.log(`${index + 1}. ID: ${notification.id}, Title: ${notification.title}, Read: ${notification.isRead}`);
            });
        }

        // Step 3: Test unread notifications endpoint
        console.log('\n3️⃣ Testing unread notifications endpoint...');
        const unreadResponse = await axios.get(`${BASE_URL}/notifications/unread/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const unreadOnly = unreadResponse.data;
        console.log(`Unread notifications from endpoint: ${unreadOnly.length}`);
        
        if (unreadOnly.length > 0) {
            console.log('Unread notifications from endpoint:');
            unreadOnly.forEach((notification, index) => {
                console.log(`${index + 1}. ID: ${notification.id}, Title: ${notification.title}, Read: ${notification.isRead}`);
            });
        }

        // Step 4: Test marking a notification as read
        if (unreadOnly.length > 0) {
            const notificationToMark = unreadOnly[0];
            console.log(`\n4️⃣ Marking notification ${notificationToMark.id} as read...`);
            
            const markReadResponse = await axios.post(`${BASE_URL}/notifications/mark-read/${notificationToMark.id}`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Notification marked as read');
            
            // Step 5: Check unread notifications again
            console.log('\n5️⃣ Checking unread notifications after marking as read...');
            const unreadAfterResponse = await axios.get(`${BASE_URL}/notifications/unread/69`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const unreadAfter = unreadAfterResponse.data;
            console.log(`Unread notifications after marking as read: ${unreadAfter.length}`);
            
            if (unreadAfter.length < unreadOnly.length) {
                console.log('✅ SUCCESS: Notification was properly marked as read and removed from unread list');
            } else {
                console.log('❌ FAILED: Notification was not properly marked as read');
            }
        }

        // Step 6: Test notification count
        console.log('\n6️⃣ Testing notification count...');
        const countResponse = await axios.get(`${BASE_URL}/notifications/unread-count/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`Unread notification count: ${countResponse.data}`);

        // Step 7: Test marking all notifications as read
        console.log('\n7️⃣ Testing mark all as read...');
        const markAllResponse = await axios.post(`${BASE_URL}/notifications/mark-all-read/69`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ All notifications marked as read');
        
        // Step 8: Check unread notifications after marking all as read
        console.log('\n8️⃣ Checking unread notifications after marking all as read...');
        const unreadAfterAllResponse = await axios.get(`${BASE_URL}/notifications/unread/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const unreadAfterAll = unreadAfterAllResponse.data;
        console.log(`Unread notifications after marking all as read: ${unreadAfterAll.length}`);
        
        if (unreadAfterAll.length === 0) {
            console.log('✅ SUCCESS: All notifications were properly marked as read');
        } else {
            console.log('❌ FAILED: Some notifications were not marked as read');
        }

        console.log('\n✅ Notification functionality test completed!');
        console.log('\n📝 FRONTEND TESTING INSTRUCTIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Click on the notification bell icon in the header');
        console.log('3. Verify that only unread notifications are shown');
        console.log('4. Click "Mark as read" on a notification');
        console.log('5. Verify that the notification disappears from the list');
        console.log('6. Click "Mark all read" to mark all notifications as read');
        console.log('7. Verify that all notifications disappear from the list');
        console.log('8. Refresh the page and verify that read notifications do not reappear');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testNotificationFunctionality(); 