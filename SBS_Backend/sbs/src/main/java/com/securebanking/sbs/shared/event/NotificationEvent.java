package com.securebanking.sbs.shared.event;

import java.time.LocalDateTime;

public class NotificationEvent {
    
    private Integer userId;
    private String type;
    private String title;
    private String message;
    private Integer relatedId;
    private LocalDateTime timestamp;
    
    public NotificationEvent() {
        this.timestamp = LocalDateTime.now();
    }
    
    public NotificationEvent(Integer userId, String type, String title, String message, Integer relatedId) {
        this();
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.relatedId = relatedId;
    }
    
    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getRelatedId() {
        return relatedId;
    }
    
    public void setRelatedId(Integer relatedId) {
        this.relatedId = relatedId;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 