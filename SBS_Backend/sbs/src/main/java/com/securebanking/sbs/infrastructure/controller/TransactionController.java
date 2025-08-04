package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.infrastructure.service.TransactionService;
import com.securebanking.sbs.shared.dto.TransactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import com.securebanking.sbs.modules.customer.model.Transaction;

@RestController
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TransactionDto>> getTransactionHistory(@PathVariable Integer userId) {
        try {
            System.out.println("=== Getting transaction history for user ID: " + userId + " ===");
            List<TransactionDto> transactions = transactionService.getTransactionHistory(userId);
            System.out.println("=== Found " + transactions.size() + " transactions for user " + userId + " ===");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("=== Error in getTransactionHistory for user " + userId + ": " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<TransactionDto>> getPendingTransactions(@PathVariable Integer userId) {
        try {
            List<TransactionDto> transactions = transactionService.getPendingTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        try {
            List<TransactionDto> transactions = transactionService.getAllTransactions();
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("message", "All transactions retrieved successfully");
            response.put("count", transactions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error in getAllTransactions: " + e.getMessage());
            e.printStackTrace();
            
            // Return a proper error response instead of just bad request
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve transactions");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("transactions", new ArrayList<>());
            errorResponse.put("count", 0);
            return ResponseEntity.ok(errorResponse); // Return 200 with error info instead of 400
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testTransactions() {
        try {
            System.out.println("=== Testing transaction retrieval ===");
            List<Transaction> rawTransactions = transactionService.getAllRawTransactions();
            System.out.println("=== Found " + rawTransactions.size() + " raw transactions ===");
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalTransactions", rawTransactions.size());
            response.put("status", "Database connection working");
            
            // Log first few transactions
            for (int i = 0; i < Math.min(5, rawTransactions.size()); i++) {
                Transaction t = rawTransactions.get(i);
                System.out.println("Transaction " + i + ": ID=" + t.getTransactionId() + 
                                 ", Status=" + t.getStatus() + 
                                 ", Type=" + t.getTransactionType());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== Error in test endpoint: " + e.getMessage() + " ===");
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/approve/{transactionId}")
    public ResponseEntity<Map<String, Object>> approveTransaction(@PathVariable Integer transactionId) {
        try {
            TransactionDto approvedTransaction = transactionService.approveTransaction(transactionId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Transaction approved successfully");
            response.put("transaction", approvedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to approve transaction");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/reject/{transactionId}")
    public ResponseEntity<Map<String, Object>> rejectTransaction(@PathVariable Integer transactionId) {
        try {
            TransactionDto rejectedTransaction = transactionService.rejectTransaction(transactionId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Transaction rejected successfully");
            response.put("transaction", rejectedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to reject transaction");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/request-money")
    public ResponseEntity<String> requestMoney(@RequestBody Map<String, Object> requestData) {
        try {
            // TODO: Implement money request logic
            return ResponseEntity.ok("Money request sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send money request");
        }
    }

    @PostMapping("/send-money")
    public ResponseEntity<String> sendMoney(@RequestBody Map<String, Object> transferData) {
        try {
            // TODO: Implement money transfer logic
            return ResponseEntity.ok("Money sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send money");
        }
    }
} 