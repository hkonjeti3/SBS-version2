const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Test user credentials
const TEST_USER = {
    username: 'ad',
    password: 'ad@123'
};

async function testPaginationFunctionality() {
    try {
        console.log('🧪 Testing Pagination Functionality...\n');

        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, TEST_USER);
        const adminToken = loginResponse.data.token;
        console.log('✅ Admin login successful\n');

        // Step 2: Submit multiple account requests to test pagination
        console.log('2️⃣ Submitting multiple account requests...');
        const requests = [
            {
                userId: 69,
                accountType: 'Savings Account',
                initialBalance: 100.00,
                reason: 'Test request 1',
                status: 'Pending'
            },
            {
                userId: 69,
                accountType: 'Checking Account',
                initialBalance: 200.00,
                reason: 'Test request 2',
                status: 'Pending'
            },
            {
                userId: 69,
                accountType: 'Credit Account',
                initialBalance: 300.00,
                reason: 'Test request 3',
                status: 'Pending'
            },
            {
                userId: 69,
                accountType: 'Investment Account',
                initialBalance: 400.00,
                reason: 'Test request 4',
                status: 'Pending'
            }
        ];

        for (let i = 0; i < requests.length; i++) {
            try {
                const response = await axios.post(`${BASE_URL}/account-request`, requests[i], {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log(`✅ Request ${i + 1} submitted with ID: ${response.data.id}`);
            } catch (error) {
                console.log(`⚠️ Request ${i + 1} failed: ${error.response?.data?.message || error.message}`);
            }
        }

        // Step 3: Wait for processing
        console.log('\n3️⃣ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 4: Check pending requests
        console.log('4️⃣ Checking pending requests...');
        const pendingResponse = await axios.get(`${BASE_URL}/approval/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        const pendingRequests = pendingResponse.data.accountRequests || [];
        console.log(`Total pending requests: ${pendingRequests.length}`);
        
        if (pendingRequests.length > 0) {
            console.log('Pending requests:');
            pendingRequests.forEach((request, index) => {
                console.log(`${index + 1}. ID: ${request.id}, Type: ${request.accountType}, Balance: $${request.initialBalance}, Status: ${request.status}`);
            });
        }

        // Step 5: Check user's account requests
        console.log('\n5️⃣ Checking user account requests...');
        const userRequestsResponse = await axios.get(`${BASE_URL}/account-request/user/69`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        const userRequests = userRequestsResponse.data;
        const pendingUserRequests = userRequests.filter(req => req.status === 'Pending');
        
        console.log(`Total user requests: ${userRequests.length}`);
        console.log(`Pending user requests: ${pendingUserRequests.length}`);
        
        if (pendingUserRequests.length > 0) {
            console.log('Pending user requests:');
            pendingUserRequests.forEach((request, index) => {
                console.log(`${index + 1}. ID: ${request.id}, Type: ${request.accountType}, Balance: $${request.initialBalance}, Status: ${request.status}`);
            });
        }

        // Step 6: Test pagination logic
        console.log('\n6️⃣ Testing pagination logic...');
        const itemsPerPage = 2;
        const totalPages = Math.ceil(pendingUserRequests.length / itemsPerPage);
        
        console.log(`Total pending requests: ${pendingUserRequests.length}`);
        console.log(`Items per page: ${itemsPerPage}`);
        console.log(`Total pages: ${totalPages}`);
        
        for (let page = 1; page <= totalPages; page++) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageItems = pendingUserRequests.slice(startIndex, endIndex);
            
            console.log(`\nPage ${page}:`);
            console.log(`Showing items ${startIndex + 1}-${Math.min(endIndex, pendingUserRequests.length)} of ${pendingUserRequests.length}`);
            pageItems.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.accountType} - $${item.initialBalance}`);
            });
        }

        console.log('\n✅ Pagination functionality test completed!');
        console.log('\n📝 FRONTEND TESTING INSTRUCTIONS:');
        console.log('1. Open the frontend application in your browser');
        console.log('2. Navigate to the Accounts page');
        console.log('3. Check the "Pending Account Creation Requests" section');
        console.log('4. Verify that only pending requests are shown (not approved ones)');
        console.log('5. If there are more than 2 pending requests, pagination controls should appear');
        console.log('6. Test the pagination buttons (Previous, Page numbers, Next)');
        console.log('7. Verify that only 2 requests are shown per page');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testPaginationFunctionality(); 