const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testProfileUpdateFlow() {
    try {
        console.log('🧪 Testing Profile Update Flow...\n');

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

        // Step 3: Submit a profile update request
        console.log('3️⃣ Submitting profile update request...');
        const updateRequest = {
            userId: 68,
            requestType: 'First Name Update',
            currentValue: currentUser.firstName,
            requestedValue: 'TestName_' + Date.now(),
            reason: 'Testing profile update functionality',
            status: 'Pending'
        };

        const submitResponse = await axios.post(`${BASE_URL}/profile-update-request`, updateRequest, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const requestId = submitResponse.data.id;
        console.log(`✅ Profile update request submitted with ID: ${requestId}\n`);

        // Step 4: Get pending requests
        console.log('4️⃣ Getting pending requests...');
        const pendingResponse = await axios.get(`${BASE_URL}/approval/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const pendingRequests = pendingResponse.data;
        console.log(`Found ${pendingRequests.profileRequests.length} pending profile requests`);
        console.log('✅ Pending requests retrieved\n');

        // Step 5: Approve the request
        console.log('5️⃣ Approving the profile update request...');
        const approveResponse = await axios.post(`${BASE_URL}/approval/profile/approve/${requestId}`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Profile update request approved\n');

        // Step 6: Verify the user data was updated
        console.log('6️⃣ Verifying user data was updated...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for processing
        
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
        if (updatedUser.firstName === updateRequest.requestedValue) {
            console.log('🎉 SUCCESS: User profile was updated correctly!');
        } else {
            console.log('❌ FAILED: User profile was not updated');
            console.log(`Expected: ${updateRequest.requestedValue}, Got: ${updatedUser.firstName}`);
        }

        console.log('\n✅ Profile update flow test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testProfileUpdateFlow(); 