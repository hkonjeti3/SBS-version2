const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8081/api/v1';
const CONCURRENT_USERS = 100;
const TEST_DURATION = 60000; // 1 minute

// Test data - using real users from database with password123
const testUsers = [
    { username: 'doe', password: 'password123' },
    { username: 'meowww', password: 'password123' }
];

// Metrics
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let responseTimes = [];

// Simulate user login
async function simulateUserLogin(userIndex) {
    const user = testUsers[userIndex % testUsers.length];
    const startTime = Date.now();
    
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            username: user.username,
            password: user.password
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        successfulRequests++;
        totalRequests++;
        
        console.log(`✅ User ${userIndex + 1}: Login successful (${responseTime}ms)`);
        
        return response.data;
    } catch (error) {
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        failedRequests++;
        totalRequests++;
        
        console.log(`❌ User ${userIndex + 1}: Login failed (${responseTime}ms) - ${error.message}`);
        
        return null;
    }
}

// Simulate concurrent users
async function runLoadTest() {
    console.log(`🚀 Starting load test with ${CONCURRENT_USERS} concurrent users...`);
    console.log(`⏱️  Test duration: ${TEST_DURATION / 1000} seconds`);
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const promises = [];
    
    // Create concurrent requests
    for (let i = 0; i < CONCURRENT_USERS; i++) {
        promises.push(simulateUserLogin(i));
        
        // Add small delay to prevent overwhelming the server
        if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Wait for all requests to complete
    await Promise.all(promises);
    
    const endTime = Date.now();
    const testDuration = endTime - startTime;
    
    // Calculate metrics
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const minResponseTime = Math.min(...responseTimes);
    const maxResponseTime = Math.max(...responseTimes);
    const successRate = (successfulRequests / totalRequests) * 100;
    const requestsPerSecond = totalRequests / (testDuration / 1000);
    
    // Print results
    console.log('='.repeat(60));
    console.log('📊 LOAD TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful: ${successfulRequests}`);
    console.log(`Failed: ${failedRequests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Requests/Second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min Response Time: ${minResponseTime}ms`);
    console.log(`Max Response Time: ${maxResponseTime}ms`);
    console.log(`Test Duration: ${testDuration}ms`);
    
    // Performance assessment
    console.log('\n🎯 PERFORMANCE ASSESSMENT');
    console.log('='.repeat(60));
    
    if (successRate >= 95 && avgResponseTime < 500) {
        console.log('✅ EXCELLENT: System can handle 100+ concurrent users');
    } else if (successRate >= 90 && avgResponseTime < 1000) {
        console.log('⚠️  GOOD: System can handle 100 concurrent users with minor issues');
    } else if (successRate >= 80) {
        console.log('⚠️  ACCEPTABLE: System needs optimization for 100 concurrent users');
    } else {
        console.log('❌ POOR: System cannot handle 100 concurrent users');
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(60));
    
    if (avgResponseTime > 1000) {
        console.log('• Consider implementing caching for frequently accessed data');
        console.log('• Optimize database queries and add indexes');
        console.log('• Increase server resources (CPU, Memory)');
    }
    
    if (successRate < 95) {
        console.log('• Check server logs for errors');
        console.log('• Verify database connection pool settings');
        console.log('• Consider horizontal scaling');
    }
    
    if (requestsPerSecond < 50) {
        console.log('• Optimize application code');
        console.log('• Consider using async processing');
        console.log('• Implement connection pooling');
    }
}

// Health check
async function healthCheck() {
    try {
        const response = await axios.get(`${BASE_URL.replace('/api/v1', '')}/actuator/health`);
        console.log('✅ Health check passed:', response.data.status);
        return true;
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    console.log('🔍 Checking system health...');
    const isHealthy = await healthCheck();
    
    if (!isHealthy) {
        console.log('❌ System is not healthy. Please check if the backend is running.');
        process.exit(1);
    }
    
    console.log('✅ System is healthy. Starting load test...\n');
    
    await runLoadTest();
}

// Handle errors
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

// Run the test
main().catch(console.error); 