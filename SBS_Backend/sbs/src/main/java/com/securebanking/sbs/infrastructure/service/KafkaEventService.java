package com.securebanking.sbs.infrastructure.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class KafkaEventService {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaEventService.class);
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Publish login event
    public void publishLoginEvent(String username, boolean success, String ipAddress) {
        try {
            LoginEvent event = new LoginEvent(username, success, ipAddress, LocalDateTime.now());
            kafkaTemplate.send("audit-logs", "login", event);
            logger.info("Login event published for user: {}", username);
        } catch (Exception e) {
            logger.error("Error publishing login event", e);
        }
    }
    
    // Publish transaction event
    public void publishTransactionEvent(String transactionType, double amount, 
                                     String senderAccount, String receiverAccount) {
        try {
            TransactionEvent event = new TransactionEvent(transactionType, amount, 
                senderAccount, receiverAccount, LocalDateTime.now());
            kafkaTemplate.send("audit-logs", "transaction", event);
            logger.info("Transaction event published: type={}, amount={}", transactionType, amount);
        } catch (Exception e) {
            logger.error("Error publishing transaction event", e);
        }
    }
    
    // Publish email notification
    public void publishEmailNotification(String to, String subject, String message) {
        try {
            EmailNotification notification = new EmailNotification(to, subject, message);
            kafkaTemplate.send("notifications", "email", notification);
            logger.info("Email notification published to: {}", to);
        } catch (Exception e) {
            logger.error("Error publishing email notification", e);
        }
    }
    
    // Publish audit log
    public void publishAuditLog(String action, Integer userId, String details) {
        try {
            AuditLog auditLog = new AuditLog(action, userId, details, LocalDateTime.now());
            kafkaTemplate.send("audit-logs", "audit", auditLog);
            logger.info("Audit log published: action={}, userId={}", action, userId);
        } catch (Exception e) {
            logger.error("Error publishing audit log", e);
        }
    }
    
    // Publish notification event
    public void publishNotificationEvent(com.securebanking.sbs.shared.event.NotificationEvent event) {
        try {
            kafkaTemplate.send("notifications", "notification", event);
            logger.info("Notification event published for user: {}", event.getUserId());
        } catch (Exception e) {
            logger.error("Error publishing notification event", e);
        }
    }
    
    // Event classes
    public static class LoginEvent {
        private String username;
        private boolean success;
        private String ipAddress;
        private LocalDateTime timestamp;
        
        public LoginEvent(String username, boolean success, String ipAddress, LocalDateTime timestamp) {
            this.username = username;
            this.success = success;
            this.ipAddress = ipAddress;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
    
    public static class TransactionEvent {
        private String transactionType;
        private double amount;
        private String senderAccount;
        private String receiverAccount;
        private LocalDateTime timestamp;
        
        public TransactionEvent(String transactionType, double amount, 
                             String senderAccount, String receiverAccount, LocalDateTime timestamp) {
            this.transactionType = transactionType;
            this.amount = amount;
            this.senderAccount = senderAccount;
            this.receiverAccount = receiverAccount;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getTransactionType() { return transactionType; }
        public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getSenderAccount() { return senderAccount; }
        public void setSenderAccount(String senderAccount) { this.senderAccount = senderAccount; }
        public String getReceiverAccount() { return receiverAccount; }
        public void setReceiverAccount(String receiverAccount) { this.receiverAccount = receiverAccount; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
    
    public static class EmailNotification {
        private String to;
        private String subject;
        private String message;
        
        public EmailNotification(String to, String subject, String message) {
            this.to = to;
            this.subject = subject;
            this.message = message;
        }
        
        // Getters and setters
        public String getTo() { return to; }
        public void setTo(String to) { this.to = to; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    public static class AuditLog {
        private String action;
        private Integer userId;
        private String details;
        private LocalDateTime timestamp;
        
        public AuditLog(String action, Integer userId, String details, LocalDateTime timestamp) {
            this.action = action;
            this.userId = userId;
            this.details = details;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
} 