# Test Organization

This directory contains all test files organized by category:

## Directory Structure

### `/api/` - API Tests
Contains JavaScript files for testing various API endpoints and functionality:
- `test-account-creation.js` - Account creation flow tests
- `test-api.js` - Basic API connectivity tests
- `test-debug-account-creation.js` - Debug account creation issues
- `test-enhanced-notification-system.js` - Enhanced notification system tests
- `test-full-account-flow.js` - Complete account flow testing
- `test-header-update.js` - Header update functionality tests
- `test-immediate-header-update.js` - Immediate header update tests
- `test-notification-functionality.js` - Notification functionality tests
- `test-notification-system.js` - Basic notification system tests
- `test-pagination-functionality.js` - Pagination feature tests
- `test-profile-update.js` - Profile update functionality tests
- `test-simple-account-creation.js` - Simple account creation tests
- `test-simple-transaction.js` - Basic transaction tests
- `test-transaction-approval-workflow.js` - Transaction approval workflow tests
- `test-transaction-fix.js` - Transaction fix tests
- `test-transaction-form.js` - Transaction form functionality tests

### `/integration/` - Integration Tests
Contains SQL and integration test files:
- `testing.sql` - Database integration tests

### `/load/` - Load Tests
Contains load testing scripts:
- `load-test.js` - Load testing for the application

### `/scripts/` - Test Scripts
Contains shell scripts for testing:
- `test-email.sh` - Email functionality testing script

## Running Tests

### API Tests
```bash
# Run all API tests
node tests/api/test-*.js

# Run specific test
node tests/api/test-account-creation.js
```

### Load Tests
```bash
# Run load test
node tests/load/load-test.js
```

### Script Tests
```bash
# Run email test script
bash tests/scripts/test-email.sh
```

## Test Categories

1. **Account Management Tests**: Testing account creation, updates, and management
2. **Transaction Tests**: Testing transaction processing and approval workflows
3. **Notification Tests**: Testing notification system functionality
4. **UI/UX Tests**: Testing header updates and user interface changes
5. **Integration Tests**: Testing database and system integration
6. **Load Tests**: Performance and scalability testing

## Notes

- All test files are organized by functionality
- Each test file focuses on a specific feature or workflow
- Tests can be run individually or as a suite
- Some tests require the backend to be running
- Load tests should be run in a controlled environment 