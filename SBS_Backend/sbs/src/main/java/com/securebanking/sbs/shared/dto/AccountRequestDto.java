package com.securebanking.sbs.shared.dto;

import java.time.LocalDateTime;

public class AccountRequestDto {
    
    private Integer id;
    private Integer userId;
    private String accountType;
    private Double initialBalance;
    private String reason;
    private String status;
    private LocalDateTime timestamp;
    private String userName; // For display purposes
    
    // Constructors
    public AccountRequestDto() {}
    
    public AccountRequestDto(Integer userId, String accountType, Double initialBalance, String reason) {
        this.userId = userId;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
        this.reason = reason;
        this.status = "Pending";
        this.timestamp = LocalDateTime.now();
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
} 