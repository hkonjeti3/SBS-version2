package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.shared.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Integer> {
    
    // Find all notifications for a specific user
    List<Notification> findByUserIdOrderByTimestampDesc(Integer userId);
    
    // Find unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalse(Integer userId);
    
    // Count unread notifications for a user
    long countByUserIdAndIsReadFalse(Integer userId);
    
    // Find notifications by type for a user
    List<Notification> findByUserIdAndTypeOrderByTimestampDesc(Integer userId, String type);
    
    // Find notifications by related ID
    List<Notification> findByRelatedIdOrderByTimestampDesc(Integer relatedId);
} 