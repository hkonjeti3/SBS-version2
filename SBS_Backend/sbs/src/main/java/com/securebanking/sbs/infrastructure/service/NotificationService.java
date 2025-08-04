package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.model.Notification;
import com.securebanking.sbs.infrastructure.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepo notificationRepo;
    
    // Create a new notification
    @Transactional
    public Notification createNotification(Integer userId, String type, String title, String message, Integer relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setIsRead(false);
        notification.setTimestamp(LocalDateTime.now());
        
        return notificationRepo.save(notification);
    }
    
    // Get all notifications for a user
    public List<Notification> getUserNotifications(Integer userId) {
        List<Notification> notifications = notificationRepo.findByUserIdOrderByTimestampDesc(userId);
        
        // If no notifications exist, create some sample notifications
        if (notifications.isEmpty()) {
            createSampleNotifications(userId);
            notifications = notificationRepo.findByUserIdOrderByTimestampDesc(userId);
        }
        
        return notifications;
    }
    
    // Get only unread notifications for a user
    public List<Notification> getUnreadNotifications(Integer userId) {
        return notificationRepo.findByUserIdAndIsReadFalse(userId);
    }
    
    // Create sample notifications for testing
    private void createSampleNotifications(Integer userId) {
        // Sample notification 1
        createNotification(userId, "profile_update", "Profile Update Request", 
            "Your address change request has been submitted and is pending approval.", 1);
        
        // Sample notification 2
        createNotification(userId, "account_request", "Account Creation Request", 
            "Your new account request has been received and is under review.", 2);
        
        // Sample notification 3
        createNotification(userId, "general", "Welcome to SBS Banking", 
            "Thank you for choosing SBS Banking. Your account is now active.", 3);
    }
    
    // Get unread notification count for a user
    public long getUnreadCount(Integer userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }
    
    // Mark notification as read
    @Transactional
    public Notification markAsRead(Integer notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        return notificationRepo.save(notification);
    }
    
    // Mark all notifications as read for a user
    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> unreadNotifications = notificationRepo.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepo.saveAll(unreadNotifications);
    }
    
    // Delete a notification
    @Transactional
    public void deleteNotification(Integer notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notificationRepo.delete(notification);
    }
} 