package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.infrastructure.model.ActivityLog;
import com.securebanking.sbs.infrastructure.repository.ActivityLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {
    
    @Autowired
    private ActivityLogRepo activityLogRepo;
    
    /**
     * Log an activity for a user
     */
    public void logActivity(Integer userId, String action, String description) {
        ActivityLog activityLog = new ActivityLog(userId, action, description);
        activityLogRepo.save(activityLog);
    }
    
    /**
     * Log an activity for a user with additional details
     */
    public void logActivity(Integer userId, String action, String description, String details) {
        ActivityLog activityLog = new ActivityLog(userId, action, description, details);
        activityLogRepo.save(activityLog);
    }
    
    /**
     * Get recent activity logs for a specific user
     */
    public List<ActivityLog> getUserActivityLogs(Integer userId, int limit) {
        return activityLogRepo.findRecentByUserIdOrderByTimestampDesc(userId, limit);
    }
    
    /**
     * Get all activity logs for a specific user
     */
    public List<ActivityLog> getUserActivityLogs(Integer userId) {
        return activityLogRepo.findByUserIdOrderByTimestampDesc(userId);
    }
    
    /**
     * Get activity logs for a user since their last login
     */
    public List<ActivityLog> getUserActivityLogsSinceLastLogin(Integer userId) {
        // Find the last login activity for this user
        List<ActivityLog> loginActivities = activityLogRepo.findByActionAndUserIdOrderByTimestampDesc("User Login", userId);
        
        if (loginActivities.isEmpty()) {
            // If no login activity found, return recent activities (last 24 hours)
            LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
            return activityLogRepo.findByUserIdAndTimestampAfterOrderByTimestampDesc(userId, twentyFourHoursAgo);
        }
        
        // Get the timestamp of the most recent login
        LocalDateTime lastLoginTime = loginActivities.get(0).getTimestamp();
        
        // Return activities since the last login
        return activityLogRepo.findByUserIdAndTimestampAfterOrderByTimestampDesc(userId, lastLoginTime);
    }
    
    /**
     * Get recent activity logs for all users
     */
    public List<ActivityLog> getRecentActivityLogs(int limit) {
        return activityLogRepo.findRecentOrderByTimestampDesc(limit);
    }
    
    /**
     * Get activity logs by action for a specific user
     */
    public List<ActivityLog> getActivityLogsByAction(Integer userId, String action) {
        return activityLogRepo.findByActionAndUserIdOrderByTimestampDesc(action, userId);
    }
    
    /**
     * Convert ActivityLog to Map for API response
     */
    public Map<String, Object> convertToMap(ActivityLog activityLog) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", activityLog.getId());
        map.put("userId", activityLog.getUserId());
        map.put("action", activityLog.getAction());
        map.put("description", activityLog.getDescription());
        map.put("details", activityLog.getDetails());
        map.put("timestamp", activityLog.getTimestamp());
        map.put("ipAddress", activityLog.getIpAddress());
        map.put("userAgent", activityLog.getUserAgent());
        return map;
    }
    
    /**
     * Convert list of ActivityLog to list of Maps for API response
     */
    public List<Map<String, Object>> convertToMapList(List<ActivityLog> activityLogs) {
        return activityLogs.stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }
    
    /**
     * Get activity logs for dashboard display
     */
    public List<Map<String, Object>> getDashboardActivityLogs(Integer userId, int limit) {
        List<ActivityLog> activityLogs = getUserActivityLogs(userId, limit);
        return convertToMapList(activityLogs);
    }
    
    /**
     * Get activity logs since last login for dashboard display
     */
    public List<Map<String, Object>> getDashboardActivityLogsSinceLastLogin(Integer userId) {
        List<ActivityLog> activityLogs = getUserActivityLogsSinceLastLogin(userId);
        return convertToMapList(activityLogs);
    }
    
    /**
     * Get all activity logs for dashboard display
     */
    public List<Map<String, Object>> getAllActivityLogs() {
        List<ActivityLog> activityLogs = getRecentActivityLogs(50); // Limit to 50 most recent
        return convertToMapList(activityLogs);
    }
} 