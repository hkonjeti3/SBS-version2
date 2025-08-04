package com.securebanking.sbs.modules.internal_user.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.securebanking.sbs.shared.model.User;

@Entity
@Table(name = "profile_update_requests")
public class ProfileUpdateRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "request_type", nullable = false)
    private String requestType;
    
    @Column(name = "current_value", nullable = false)
    private String currentValue;
    
    @Column(name = "requested_value", nullable = false)
    private String requestedValue;
    
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
    public ProfileUpdateRequest() {
        this.timestamp = LocalDateTime.now();
        this.status = "Pending";
    }
    
    public ProfileUpdateRequest(Integer userId, String requestType, String currentValue, 
                              String requestedValue, String reason) {
        this();
        this.userId = userId;
        this.requestType = requestType;
        this.currentValue = currentValue;
        this.requestedValue = requestedValue;
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
    
    public String getRequestType() {
        return requestType;
    }
    
    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }
    
    public String getCurrentValue() {
        return currentValue;
    }
    
    public void setCurrentValue(String currentValue) {
        this.currentValue = currentValue;
    }
    
    public String getRequestedValue() {
        return requestedValue;
    }
    
    public void setRequestedValue(String requestedValue) {
        this.requestedValue = requestedValue;
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