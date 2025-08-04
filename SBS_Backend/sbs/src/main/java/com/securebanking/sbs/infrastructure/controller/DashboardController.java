package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.infrastructure.service.ActivityLogService;
import com.securebanking.sbs.infrastructure.service.AccountService;
import com.securebanking.sbs.infrastructure.service.TransactionService;
import com.securebanking.sbs.shared.dto.AccountDto;
import com.securebanking.sbs.shared.dto.TransactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ActivityLogService activityLogService;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Integer userId) {
        try {
            // Get user's accounts
            List<AccountDto> userAccounts = accountService.getAllAccountsForUser(userId);
            
            // Calculate total balance
            double totalBalance = userAccounts.stream()
                .mapToDouble(account -> {
                    String balance = account.getBalance();
                    return balance != null ? Double.parseDouble(balance) : 0.0;
                })
                .sum();
            
            // Get recent transactions count
            List<TransactionDto> recentTransactions = transactionService.getTransactionHistory(userId);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAccounts", userAccounts.size());
            stats.put("totalBalance", String.format("%.2f", totalBalance));
            stats.put("recentTransactions", recentTransactions.size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting dashboard stats for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/activity/logs")
    public ResponseEntity<List<Map<String, Object>>> getActivityLogs() {
        try {
            // Get real activity logs from database
            List<Map<String, Object>> activityLogs = activityLogService.getAllActivityLogs();
            
            // If no activity logs exist, create some sample data
            if (activityLogs.isEmpty()) {
                createSampleActivityLogs();
                activityLogs = activityLogService.getAllActivityLogs();
            }
            
            return ResponseEntity.ok(activityLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/activity/logs/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserActivityLogs(@PathVariable Integer userId) {
        try {
            // Get activity logs for specific user
            List<Map<String, Object>> activityLogs = activityLogService.getDashboardActivityLogs(userId, 10);
            return ResponseEntity.ok(activityLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/activity/logs/{userId}/since-login")
    public ResponseEntity<List<Map<String, Object>>> getUserActivityLogsSinceLastLogin(@PathVariable Integer userId) {
        try {
            // Get activity logs for specific user since their last login
            List<Map<String, Object>> activityLogs = activityLogService.getDashboardActivityLogsSinceLastLogin(userId);
            return ResponseEntity.ok(activityLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Create sample activity logs for demonstration
     */
    private void createSampleActivityLogs() {
        try {
            // Sample activities for demonstration
            activityLogService.logActivity(1, "User Login", "Admin user logged into the system");
            activityLogService.logActivity(2, "Account Created", "New savings account created for user ID 123");
            activityLogService.logActivity(3, "Transaction Approved", "Transfer of $500 approved for account #12345");
            activityLogService.logActivity(4, "Profile Updated", "User profile information updated");
            activityLogService.logActivity(5, "Security Alert", "Suspicious login attempt detected and blocked");
            activityLogService.logActivity(6, "User Registration", "New customer registered in the system");
            activityLogService.logActivity(7, "Transaction Rejected", "Transfer request rejected due to insufficient funds");
            activityLogService.logActivity(8, "Account Deactivated", "User account deactivated by admin");
            activityLogService.logActivity(9, "Password Reset", "User password reset requested");
            activityLogService.logActivity(10, "System Maintenance", "Scheduled system maintenance completed");
            
            System.out.println("Sample activity logs created successfully");
        } catch (Exception e) {
            System.err.println("Error creating sample activity logs: " + e.getMessage());
        }
    }
} 