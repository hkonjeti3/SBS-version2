package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.infrastructure.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityLogService activityLogService;

    @PostMapping("/activity/log")
    public ResponseEntity<?> logActivity(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            String action = (String) request.get("action");
            String description = (String) request.get("description");
            String details = (String) request.get("details");

            if (userId == null || action == null || description == null) {
                return ResponseEntity.badRequest().body("Missing required fields: userId, action, description");
            }

            activityLogService.logActivity(userId, action, description, details);
            
            return ResponseEntity.ok().body(Map.of(
                "message", "Activity logged successfully",
                "userId", userId,
                "action", action
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to log activity: " + e.getMessage());
        }
    }
} 