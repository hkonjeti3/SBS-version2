package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.dto.TransactionDto;
import com.securebanking.sbs.shared.enums.RequestStatus;
import com.securebanking.sbs.modules.customer.model.Transaction;
import com.securebanking.sbs.infrastructure.repository.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @Autowired
    private NotificationService notificationService;

    public int getRecentTransactionsCount(Integer userId) {
        // Get transactions from last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Transaction> transactions = transactionRepo.findAll();
        return (int) transactions.stream()
            .filter(t -> t.getUser() != null && t.getUser().getUserId().equals(userId))
            .filter(t -> t.getCreatedtime() != null && t.getCreatedtime().isAfter(thirtyDaysAgo))
            .count();
    }

    public List<Map<String, Object>> getRecentActivities(Integer userId) {
        // Get recent transactions and convert to activity format
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Transaction> allTransactions = transactionRepo.findAll();
        List<Transaction> recentTransactions = allTransactions.stream()
            .filter(t -> t.getUser() != null && t.getUser().getUserId().equals(userId))
            .filter(t -> t.getCreatedtime() != null && t.getCreatedtime().isAfter(thirtyDaysAgo))
            .sorted((t1, t2) -> t2.getCreatedtime().compareTo(t1.getCreatedtime()))
            .toList();
        
        List<Map<String, Object>> activities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        
        for (Transaction transaction : recentTransactions) {
            Map<String, Object> activity = new HashMap<>();
            
            // Determine icon based on transaction type
            String icon = "pi pi-arrow-right-arrow-left"; // default
            if ("CREDIT".equals(transaction.getTransactionType())) {
                icon = "pi pi-arrow-down";
            } else if ("DEBIT".equals(transaction.getTransactionType())) {
                icon = "pi pi-arrow-up";
            } else if ("TRANSFER_FUNDS".equals(transaction.getTransactionType())) {
                icon = "pi pi-arrow-right-arrow-left";
            }
            
            // Create title
            String title = transaction.getTransactionType() + " Transaction";
            if (transaction.getTransactionType().equals("TRANSFER_FUNDS")) {
                title = "Transfer to " + (transaction.getReceiverAcc() != null ? 
                    transaction.getReceiverAcc().getAccountNumber() : "Account");
            }
            
            // Format time
            String time = transaction.getCreatedtime().format(formatter);
            
            // Format amount
            String amount = "$" + transaction.getAmount();
            if ("DEBIT".equals(transaction.getTransactionType()) || 
                "TRANSFER_FUNDS".equals(transaction.getTransactionType())) {
                amount = "-" + amount;
            } else {
                amount = "+" + amount;
            }
            
            activity.put("icon", icon);
            activity.put("title", title);
            activity.put("time", time);
            activity.put("amount", amount);
            activity.put("type", "DEBIT".equals(transaction.getTransactionType()) ? "debit" : "credit");
            
            activities.add(activity);
        }
        
        return activities;
    }

    public List<TransactionDto> getTransactionHistory(Integer userId) {
        try {
            System.out.println("=== TransactionService.getTransactionHistory called for user: " + userId + " ===");
            List<Transaction> allTransactions = transactionRepo.findAll();
            System.out.println("=== Found " + allTransactions.size() + " total transactions in database ===");
            
            List<Transaction> userTransactions = allTransactions.stream()
                .filter(t -> {
                    boolean userNotNull = t.getUser() != null;
                    boolean userIdMatches = userNotNull && t.getUser().getUserId().equals(userId);
                    System.out.println("Transaction " + t.getTransactionId() + ": user=" + (userNotNull ? t.getUser().getUserId() : "null") + ", matches=" + userIdMatches);
                    return userIdMatches;
                })
                .sorted((t1, t2) -> t2.getCreatedtime().compareTo(t1.getCreatedtime()))
                .toList();
            
            System.out.println("=== Found " + userTransactions.size() + " transactions for user " + userId + " ===");
            return convertToDtoList(userTransactions);
        } catch (Exception e) {
            System.err.println("=== Error in TransactionService.getTransactionHistory: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw e;
        }
    }

    public List<TransactionDto> getPendingTransactions(Integer userId) {
        List<Transaction> allTransactions = transactionRepo.findAll();
        List<Transaction> pendingTransactions = allTransactions.stream()
            .filter(t -> t.getUser() != null && t.getUser().getUserId().equals(userId))
            .filter(t -> "PENDING".equals(t.getStatus()))
            .sorted((t1, t2) -> t2.getCreatedtime().compareTo(t1.getCreatedtime()))
            .toList();
        return convertToDtoList(pendingTransactions);
    }

    public List<TransactionDto> getAllTransactions() {
        try {
            List<Transaction> allTransactions = transactionRepo.findAll();
            System.out.println("Found " + allTransactions.size() + " transactions in database");
            
            // If no transactions found, return empty list instead of throwing exception
            if (allTransactions == null || allTransactions.isEmpty()) {
                System.out.println("No transactions found in database");
                return new ArrayList<>();
            }
            
            // Log each transaction for debugging
            for (Transaction t : allTransactions) {
                System.out.println("Transaction ID: " + t.getTransactionId() + 
                                 ", User: " + (t.getUser() != null ? t.getUser().getUserId() : "null") +
                                 ", Status: " + t.getStatus() +
                                 ", Type: " + t.getTransactionType());
            }
            
            return convertToDtoList(allTransactions);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error in TransactionService.getAllTransactions: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
    }

    public TransactionDto approveTransaction(Integer transactionId) {
        Transaction transaction = transactionRepo.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));
        
        // Check if transaction is already processed
        if (!"PENDING".equals(transaction.getStatus())) {
            throw new RuntimeException("Transaction is not in pending status");
        }
        
        try {
            // Execute the transaction (update account balances)
            accountService.executeTransaction(transaction);
            
            // Update transaction status to COMPLETED
            transaction.setStatus("COMPLETED");
            Transaction savedTransaction = transactionRepo.save(transaction);
            
            // Log admin activity
            activityLogService.logActivity(
                getCurrentAdminUserId(),
                "Transaction Approved",
                "Transaction " + transactionId + " approved and executed",
                "Transaction Type: " + transaction.getTransactionType() + ", Amount: $" + transaction.getAmount()
            );
            
            // Send notifications to both account holders
            sendTransactionNotifications(transaction, true);
            
            return convertToDto(savedTransaction);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error approving transaction " + transactionId + ": " + e.getMessage());
            throw new RuntimeException("Failed to approve transaction: " + e.getMessage());
        }
    }

    public TransactionDto rejectTransaction(Integer transactionId) {
        Transaction transaction = transactionRepo.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));
        
        // Check if transaction is already processed
        if (!"PENDING".equals(transaction.getStatus())) {
            throw new RuntimeException("Transaction is not in pending status");
        }
        
        try {
            // Update transaction status to REJECTED
            transaction.setStatus("REJECTED");
            Transaction savedTransaction = transactionRepo.save(transaction);
            
            // Log admin activity
            activityLogService.logActivity(
                getCurrentAdminUserId(),
                "Transaction Rejected",
                "Transaction " + transactionId + " rejected",
                "Transaction Type: " + transaction.getTransactionType() + ", Amount: $" + transaction.getAmount()
            );
            
            // Send notifications to both account holders
            sendTransactionNotifications(transaction, false);
            
            return convertToDto(savedTransaction);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error rejecting transaction " + transactionId + ": " + e.getMessage());
            throw new RuntimeException("Failed to reject transaction: " + e.getMessage());
        }
    }

    // Helper method to get current admin user ID (you may need to implement this based on your authentication)
    private Integer getCurrentAdminUserId() {
        // For now, return a default admin user ID
        // In a real implementation, you would get this from the security context
        return 1; // Default admin user ID
    }

    // Helper method to send notifications to transaction participants
    private void sendTransactionNotifications(Transaction transaction, boolean approved) {
        try {
            String action = approved ? "approved" : "rejected";
            String title = "Transaction " + action.substring(0, 1).toUpperCase() + action.substring(1);
            String message = String.format("Your transaction of $%s has been %s by the administrator.", 
                transaction.getAmount(), action);
            
            // Send notification to sender
            if (transaction.getSenderAcc() != null && transaction.getSenderAcc().getUser() != null) {
                notificationService.createNotification(
                    transaction.getSenderAcc().getUser().getUserId(),
                    "TRANSACTION_STATUS",
                    title,
                    message,
                    transaction.getTransactionId()
                );
            }
            
            // Send notification to receiver
            if (transaction.getReceiverAcc() != null && transaction.getReceiverAcc().getUser() != null) {
                notificationService.createNotification(
                    transaction.getReceiverAcc().getUser().getUserId(),
                    "TRANSACTION_STATUS",
                    title,
                    message,
                    transaction.getTransactionId()
                );
            }
        } catch (Exception e) {
            System.err.println("Error sending transaction notifications: " + e.getMessage());
            // Don't throw the exception as notification failure shouldn't break the transaction
        }
    }

    public List<Transaction> getAllRawTransactions() {
        return transactionRepo.findAll();
    }

    private List<TransactionDto> convertToDtoList(List<Transaction> transactions) {
        try {
            System.out.println("=== Converting " + transactions.size() + " transactions to DTOs ===");
            List<TransactionDto> dtos = new ArrayList<>();
            for (Transaction transaction : transactions) {
                try {
                    System.out.println("=== Converting transaction ID: " + transaction.getTransactionId() + " ===");
                    TransactionDto dto = convertToDto(transaction);
                    dtos.add(dto);
                    System.out.println("=== Successfully converted transaction ID: " + transaction.getTransactionId() + " ===");
                } catch (Exception e) {
                    System.err.println("=== Error converting transaction ID " + transaction.getTransactionId() + ": " + e.getMessage() + " ===");
                    e.printStackTrace();
                    throw e;
                }
            }
            System.out.println("=== Successfully converted " + dtos.size() + " transactions to DTOs ===");
            return dtos;
        } catch (Exception e) {
            System.err.println("=== Error in convertToDtoList: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw e;
        }
    }

    private TransactionDto convertToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setTransactionId(transaction.getTransactionId().longValue());
        
        // Set account numbers from the Account objects
        if (transaction.getSenderAcc() != null) {
            String senderAccountNumber = transaction.getSenderAcc().getAccountNumber();
            dto.setSenderAccountNumber(senderAccountNumber);
            System.out.println("=== Transaction " + transaction.getTransactionId() + ": Sender Account Number = " + senderAccountNumber + " ===");
        } else {
            System.out.println("=== Transaction " + transaction.getTransactionId() + ": Sender Account is null ===");
        }
        
        if (transaction.getReceiverAcc() != null) {
            String receiverAccountNumber = transaction.getReceiverAcc().getAccountNumber();
            dto.setReceiverAccountNumber(receiverAccountNumber);
            System.out.println("=== Transaction " + transaction.getTransactionId() + ": Receiver Account Number = " + receiverAccountNumber + " ===");
        } else {
            System.out.println("=== Transaction " + transaction.getTransactionId() + ": Receiver Account is null ===");
        }
        
        // Determine the correct transaction type
        String transactionType = transaction.getTransactionType();
        String displayType = transactionType;
        
        System.out.println("=== Transaction " + transaction.getTransactionId() + ": Original Type = " + transactionType + " ===");
        
        // Map transaction types to display types
        if ("TRANSFER_FUNDS".equals(transactionType) || "TRANSFER".equals(transactionType)) {
            // For transfers, determine if it's credit or debit based on the user's perspective
            // If the user is the sender, it's a DEBIT; if they're the receiver, it's a CREDIT
            if (transaction.getUser() != null && transaction.getSenderAcc() != null && 
                transaction.getUser().getUserId().equals(transaction.getSenderAcc().getUser().getUserId())) {
                displayType = "DEBIT";
            } else {
                displayType = "CREDIT";
            }
        } else if ("CREDIT".equals(transactionType)) {
            displayType = "CREDIT";
        } else if ("DEBIT".equals(transactionType)) {
            displayType = "DEBIT";
        }
        
        System.out.println("=== Transaction " + transaction.getTransactionId() + ": Display Type = " + displayType + " ===");
        
        dto.setTransactionType(displayType);
        dto.setAmount(transaction.getAmount());
        
        // Handle enum conversion with error handling
        try {
            dto.setStatus(RequestStatus.valueOf(transaction.getStatus()));
        } catch (IllegalArgumentException e) {
            System.err.println("=== Unknown status '" + transaction.getStatus() + "' for transaction " + transaction.getTransactionId() + ", defaulting to PENDING ===");
            dto.setStatus(RequestStatus.PENDING);
        }
        
        dto.setUser(transaction.getUser());
        dto.setSenderAcc(transaction.getSenderAcc());
        dto.setReceiverAcc(transaction.getReceiverAcc());
        dto.setDate(transaction.getCreatedtime());
        dto.setDescription(displayType + " Transaction");
        
        return dto;
    }
} 