package com.securebanking.sbs;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.securebanking.sbs.modules.customer.model.Transaction;
import com.securebanking.sbs.shared.dto.LoginDto;
import com.securebanking.sbs.shared.dto.UserDto;
import com.securebanking.sbs.shared.model.User;
import com.securebanking.sbs.infrastructure.repository.TransactionRepo;
import com.securebanking.sbs.infrastructure.repository.UserRepo;
import com.securebanking.sbs.infrastructure.repository.UserRoleRepo;
import com.securebanking.sbs.modules.customer.model.Account;
import com.securebanking.sbs.infrastructure.repository.AccountRepo;
import com.securebanking.sbs.shared.model.UserRole;
import com.securebanking.sbs.shared.dto.TransactionDto;
import com.securebanking.sbs.shared.enums.RequestStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TransactionWorkflowIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private ObjectMapper objectMapper;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private MockMvc mockMvc;
    private String customerToken;
    private String adminToken;
    private User customerUser;
    private User adminUser;
    private Account senderAccount;
    private Account receiverAccount;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Create test users and accounts
        setupTestData();
        
        // Login and get tokens
        customerToken = loginUser("testcustomer", "password123");
        adminToken = loginUser("ad", "ad@123");
    }

    private void setupTestData() {
        // Create or get customer role
        UserRole customerRole = userRoleRepo.findById(1).orElseGet(() -> {
            UserRole role = new UserRole();
            role.setRoleId(1);
            role.setRoleName("CUSTOMER");
            return userRoleRepo.save(role);
        });

        // Create or get admin role
        UserRole adminRole = userRoleRepo.findById(4).orElseGet(() -> {
            UserRole role = new UserRole();
            role.setRoleId(4);
            role.setRoleName("ADMIN");
            return userRoleRepo.save(role);
        });

        // Create customer user
        customerUser = new User();
        customerUser.setUsername("testcustomer");
        customerUser.setPasswordHash(passwordEncoder.encode("password123"));
        customerUser.setFirstName("Test");
        customerUser.setLastName("Customer");
        customerUser.setEmailAddress("testcustomer@test.com");
        customerUser.setPhoneNumber("1234567890");
        customerUser.setAddress("123 Test Street");
        customerUser.setStatus("Active");
        customerUser.setRole(customerRole);
        customerUser = userRepo.save(customerUser);

        // Create admin user (if not exists)
        try {
            adminUser = userRepo.findByUsername("ad");
        } catch (Exception e) {
            adminUser = null;
        }
        if (adminUser == null) {
            adminUser = new User();
            adminUser.setUsername("ad");
            adminUser.setPasswordHash(passwordEncoder.encode("ad@123"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setEmailAddress("admin@test.com");
            adminUser.setPhoneNumber("0987654321");
            adminUser.setAddress("456 Admin Street");
            adminUser.setStatus("Active");
            adminUser.setRole(adminRole);
            adminUser = userRepo.save(adminUser);
        }

        // Create test accounts
        senderAccount = new Account();
        senderAccount.setAccountNumber("ACC001");
        senderAccount.setAccountType("Checking");
        senderAccount.setBalance("1000.00");
        senderAccount.setUser(customerUser);
        senderAccount.setStatus("Active");
        senderAccount = accountRepo.save(senderAccount);

        receiverAccount = new Account();
        receiverAccount.setAccountNumber("ACC002");
        receiverAccount.setAccountType("Savings");
        receiverAccount.setBalance("500.00");
        receiverAccount.setUser(customerUser);
        receiverAccount.setStatus("Active");
        receiverAccount = accountRepo.save(receiverAccount);
    }

    private String loginUser(String username, String password) throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername(username);
        loginDto.setPassword(password);

        String response = mockMvc.perform(post("/api/v1/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        return (String) responseMap.get("token");
    }

    @Test
    void testCompleteTransactionWorkflow() throws Exception {
        // Step 1: Customer creates a transaction request
        TransactionDto transactionRequest = new TransactionDto();
        transactionRequest.setUser(customerUser);
        transactionRequest.setSenderAccountNumber(senderAccount.getAccountNumber());
        transactionRequest.setReceiverAccountNumber(receiverAccount.getAccountNumber());
        transactionRequest.setTransactionType("TransferFunds");
        transactionRequest.setAmount("100.00");
        transactionRequest.setStatus(RequestStatus.PENDING);

        String transactionResponse = mockMvc.perform(post("/api/v1/account/TransferFunds/request")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transactionRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("Transaction request response: " + transactionResponse);

        // Step 2: Verify transaction is created in database with PENDING status
        List<Transaction> pendingTransactions = transactionRepo.findByStatusOrderByCreatedtimeDesc("PENDING");
        assertFalse(pendingTransactions.isEmpty(), "Should have pending transactions");
        
        Transaction createdTransaction = pendingTransactions.stream()
                .filter(t -> t.getSenderAcc().getAccountNumber().equals(senderAccount.getAccountNumber()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Transaction not found in database"));
        
        assertEquals("PENDING", createdTransaction.getStatus());
        assertEquals("100.00", createdTransaction.getAmount());
        assertEquals("TransferFunds", createdTransaction.getTransactionType());

        // Step 3: Admin views pending transactions
        String pendingTransactionsResponse = mockMvc.perform(get("/api/v1/approval/pending")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("Pending transactions response: " + pendingTransactionsResponse);

        // Parse the response to verify transaction is in pending list
        Map<String, Object> pendingResponse = objectMapper.readValue(pendingTransactionsResponse, Map.class);
        List<Map<String, Object>> transactionRequests = (List<Map<String, Object>>) pendingResponse.get("transactionRequests");
        
        assertNotNull(transactionRequests, "Transaction requests should not be null");
        assertFalse(transactionRequests.isEmpty(), "Should have pending transaction requests");
        
        Map<String, Object> pendingTransaction = transactionRequests.stream()
                .filter(t -> t.get("amount").equals("100.00"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Pending transaction not found in admin view"));

        // Step 4: Admin approves the transaction
        String approvalResponse = mockMvc.perform(post("/api/v1/approval/transaction/approve/" + createdTransaction.getTransactionId())
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("Approval response: " + approvalResponse);

        // Step 5: Verify transaction status is updated to APPROVED
        Transaction approvedTransaction = transactionRepo.findById(createdTransaction.getTransactionId()).orElseThrow();
        assertEquals("APPROVED", approvedTransaction.getStatus());

        // Step 6: Verify account balances are updated
        Account updatedSenderAccount = accountRepo.findById(senderAccount.getAccountId()).orElseThrow();
        Account updatedReceiverAccount = accountRepo.findById(receiverAccount.getAccountId()).orElseThrow();

        BigDecimal senderBalance = new BigDecimal(updatedSenderAccount.getBalance());
        BigDecimal receiverBalance = new BigDecimal(updatedReceiverAccount.getBalance());
        BigDecimal originalSenderBalance = new BigDecimal("1000.00");
        BigDecimal originalReceiverBalance = new BigDecimal("500.00");
        BigDecimal transferAmount = new BigDecimal("100.00");

        assertEquals(originalSenderBalance.subtract(transferAmount), senderBalance, 
                "Sender account balance should be reduced by transfer amount");
        assertEquals(originalReceiverBalance.add(transferAmount), receiverBalance, 
                "Receiver account balance should be increased by transfer amount");

        // Step 7: Customer views transaction history and sees completed transaction
        String transactionHistoryResponse = mockMvc.perform(get("/api/v1/transactions/history/" + customerUser.getUserId())
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("Transaction history response: " + transactionHistoryResponse);

        // Parse transaction history to verify completed transaction
        List<Map<String, Object>> transactionHistory = objectMapper.readValue(transactionHistoryResponse, List.class);
        assertFalse(transactionHistory.isEmpty(), "Transaction history should not be empty");
        
        Map<String, Object> completedTransaction = transactionHistory.stream()
                .filter(t -> t.get("amount").equals("100.00"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Completed transaction not found in user history"));

        assertEquals("APPROVED", completedTransaction.get("status"));
    }

    @Test
    void testTransactionRejectionWorkflow() throws Exception {
        // Step 1: Customer creates a transaction request
        Map<String, Object> transactionRequest = Map.of(
            "senderAcc", senderAccount.getAccountNumber(),
            "receiverAcc", receiverAccount.getAccountNumber(),
            "amount", "2000.00", // Large amount that might be rejected
            "transactionType", "TRANSFER_FUNDS",
            "userId", customerUser.getUserId()
        );

        mockMvc.perform(post("/api/v1/account/transaction-request")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transactionRequest)))
                .andExpect(status().isOk());

        // Step 2: Find the created transaction
        List<Transaction> pendingTransactions = transactionRepo.findByStatusOrderByCreatedtimeDesc("PENDING");
        Transaction createdTransaction = pendingTransactions.stream()
                .filter(t -> t.getAmount().equals("2000.00"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Transaction not found"));

        // Step 3: Admin rejects the transaction
        Map<String, String> rejectionReason = Map.of("reason", "Amount exceeds daily limit");

        mockMvc.perform(post("/api/v1/approval/transaction/reject/" + createdTransaction.getTransactionId())
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rejectionReason)))
                .andExpect(status().isOk());

        // Step 4: Verify transaction status is updated to REJECTED
        Transaction rejectedTransaction = transactionRepo.findById(createdTransaction.getTransactionId()).orElseThrow();
        assertEquals("REJECTED", rejectedTransaction.getStatus());

        // Step 5: Verify account balances are NOT changed
        Account unchangedSenderAccount = accountRepo.findById(senderAccount.getAccountId()).orElseThrow();
        Account unchangedReceiverAccount = accountRepo.findById(receiverAccount.getAccountId()).orElseThrow();

        assertEquals("1000.00", unchangedSenderAccount.getBalance(), 
                "Sender account balance should remain unchanged");
        assertEquals("500.00", unchangedReceiverAccount.getBalance(), 
                "Receiver account balance should remain unchanged");
    }

    @Test
    void testAdminCanViewAllPendingTransactions() throws Exception {
        // Create multiple transactions
        for (int i = 1; i <= 3; i++) {
            Map<String, Object> transactionRequest = Map.of(
                "senderAcc", senderAccount.getAccountNumber(),
                "receiverAcc", receiverAccount.getAccountNumber(),
                "amount", String.valueOf(50.00 * i),
                "transactionType", "TRANSFER_FUNDS",
                "userId", customerUser.getUserId()
            );

            mockMvc.perform(post("/api/v1/account/transaction-request")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(transactionRequest)))
                    .andExpect(status().isOk());
        }

        // Admin views all pending transactions
        String pendingTransactionsResponse = mockMvc.perform(get("/api/v1/approval/pending")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> pendingResponse = objectMapper.readValue(pendingTransactionsResponse, Map.class);
        List<Map<String, Object>> transactionRequests = (List<Map<String, Object>>) pendingResponse.get("transactionRequests");
        
        assertNotNull(transactionRequests, "Transaction requests should not be null");
        assertTrue(transactionRequests.size() >= 3, "Should have at least 3 pending transaction requests");

        // Verify all transactions are in pending status
        for (Map<String, Object> transaction : transactionRequests) {
            assertEquals("PENDING", transaction.get("status"), 
                    "All transactions should be in PENDING status");
        }
    }
} 