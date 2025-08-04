package com.securebanking.sbs.modules.internal_user.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.securebanking.sbs.shared.model.User;

@Entity
@Table(name = "account_requests")
public class AccountRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "account_type", nullable = false)
    private String accountType;
    
    @Column(name = "initial_balance", nullable = false)
    private Double initialBalance;
    
    @Column(name = "reason", nullable = false)
    private String reason;
    
    @Column(name = "status", nullable = false)
    private String status; // Pending, Approved, Rejected
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "approver_id")
    private Integer approverId;
    
    @Column(name = "approval_date")
    private LocalDateTime approvalDate;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    // Constructors
    public AccountRequest() {
        this.timestamp = LocalDateTime.now();
        this.status = "Pending";
    }
    
    public AccountRequest(Integer userId, String accountType, Double initialBalance, String reason) {
        this();
        this.userId = userId;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
        this.reason = reason;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getAccountType() {
        return accountType;
    }
    
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
    
    public Double getInitialBalance() {
        return initialBalance;
    }
    
    public void setInitialBalance(Double initialBalance) {
        this.initialBalance = initialBalance;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Integer getApproverId() {
        return approverId;
    }
    
    public void setApproverId(Integer approverId) {
        this.approverId = approverId;
    }
    
    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }
    
    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
} 