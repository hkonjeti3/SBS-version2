package com.securebanking.sbs.shared.dto;

import java.time.LocalDateTime;

public class ProfileUpdateRequestDto {
    
    private Integer id;
    private Integer userId;
    private String requestType;
    private String currentValue;
    private String requestedValue;
    private String reason;
    private String status;
    private LocalDateTime timestamp;
    private String userName; // For display purposes
    
    // Constructors
    public ProfileUpdateRequestDto() {}
    
    public ProfileUpdateRequestDto(Integer userId, String requestType, String currentValue, 
                                 String requestedValue, String reason) {
        this.userId = userId;
        this.requestType = requestType;
        this.currentValue = currentValue;
        this.requestedValue = requestedValue;
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
} 