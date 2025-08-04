const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testImmediateHeaderUpdate() {
    try {
        console.log('🧪 Testing Immediate Header Update...\n');

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
        const uniqueName = 'ImmediateTest_' + Date.now();
        const updateRequest = {
            userId: 68,
            requestType: 'First Name Update',
            currentValue: currentUser.firstName,
            requestedValue: uniqueName,
            reason: 'Testing immediate header update functionality',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/profile-update-request`, updateRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Profile update request submitted with ID: ${requestId}\n`);

        // Step 4: Approve the request
        console.log('4️⃣ Approving the profile update request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/profile/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Profile update request approved\n');

        // Step 5: Wait a moment for processing
        console.log('5️⃣ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 6: Verify the user data was updated
        console.log('6️⃣ Verifying user data was updated...');
        const updatedUserResponse = await axios.get(`${BASE_URL}/userProfile?id=68`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const updatedUser = updatedUserResponse.data;
        
        console.log('Updated user data:', {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.emailAddress,
            phone: updatedUser.phoneNumber,
            address: updatedUser.address
        });

        // Check if the update was successful
        if (updatedUser.firstName === uniqueName) {
            console.log('🎉 SUCCESS: User profile was updated correctly!');
            console.log('\n📝 INSTRUCTIONS FOR TESTING IMMEDIATE HEADER UPDATE:');
            console.log('1. Open the frontend application in your browser');
            console.log('2. Navigate to the profile page');
            console.log('3. Click the "Refresh Header" button to immediately update the header');
            console.log('4. Check if the header shows the updated name: ' + uniqueName);
            console.log('5. Navigate to other pages and back to see automatic updates');
            console.log('\n🔧 TECHNICAL DETAILS:');
            console.log('- The header now fetches fresh data from the server');
            console.log('- No need to logout/login to see updates');
            console.log('- Manual refresh button available for immediate testing');
            console.log('- Automatic refresh on navigation');
        } else {
            console.log('❌ FAILED: User profile was not updated');
            console.log(`Expected: ${uniqueName}, Got: ${updatedUser.firstName}`);
        }

        console.log('\n✅ Immediate header update test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testImmediateHeaderUpdate(); 