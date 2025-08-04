const axios = require('axios');

const BASE_URL = 'http://localhost:8081/api/v1';

// Simple JWT decoder
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

async function testAPI() {
    console.log('Testing API endpoints...\n');

    try {
        // Test 1: Check if approval test endpoint works
        console.log('1. Testing approval test endpoint...');
        const testResponse = await axios.get(`${BASE_URL}/approval/test`);
        console.log('✅ Test endpoint response:', testResponse.data);

        // Test 2: Check if users endpoint works
        console.log('\n2. Testing users endpoint...');
        const usersResponse = await axios.get(`${BASE_URL}/admin/users`);
        console.log('✅ Users endpoint response:', usersResponse.data.message);
        console.log('   Found', usersResponse.data.users.length, 'users');

        // Test 3: Try to access pending approvals without auth (should fail)
        console.log('\n3. Testing pending approvals without auth...');
        try {
            const pendingResponse = await axios.get(`${BASE_URL}/approval/pending`);
            console.log('❌ Unexpected success:', pendingResponse.data);
        } catch (error) {
            console.log('✅ Expected failure (no auth):', error.response?.status, error.response?.statusText);
        }

        // Test 4: Try to login with a test user
        console.log('\n4. Testing login...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/login`, {
                username: 'ad',  // Use existing admin user
                password: 'ad@123'  // Try common password
            });
            console.log('✅ Login successful:', loginResponse.data.message);
            
            // Test 5: Test approval endpoint with valid token
            console.log('\n5. Testing approval endpoint with valid token...');
            const token = loginResponse.data.token;
            console.log('Token:', token.substring(0, 50) + '...');
            
            // Decode JWT token to see user ID
            const decodedToken = decodeJWT(token);
            if (decodedToken) {
                console.log('Decoded JWT:', {
                    userId: decodedToken.userId,
                    username: decodedToken.sub,
                    role: decodedToken.role,
                    exp: new Date(decodedToken.exp * 1000).toISOString()
                });
            }
            
            const approvalResponse = await axios.get(`${BASE_URL}/approval/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Approval endpoint with auth successful:');
            console.log('   Account requests:', approvalResponse.data.accountRequests?.length || 0);
            console.log('   Profile requests:', approvalResponse.data.profileRequests?.length || 0);
            
        } catch (error) {
            console.log('❌ Login or approval test failed:', error.response?.data?.message || error.message);
            if (error.response) {
                console.log('   Status:', error.response.status);
                console.log('   Status Text:', error.response.statusText);
                console.log('   Response Data:', error.response.data);
            }
        }

        console.log('\n🎉 API test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI(); 