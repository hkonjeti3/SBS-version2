package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.infrastructure.service.AdminService;
import com.securebanking.sbs.shared.dto.UserDto;
import com.securebanking.sbs.shared.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUserDetails() {
        try {
            LOGGER.info("Request to get all users");
            List<UserDto> users = adminService.getAllUsers();
            LOGGER.info("Successfully retrieved {} users", users.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("message", "Users retrieved successfully");
            response.put("count", users.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.error("Error retrieving users: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve users");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/updateUserStatus")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> updateUserStatus(@RequestBody Map<String, Object> request) {
        try {
            LOGGER.info("Request to update user status: {}", request);
            
            Integer userId = (Integer) request.get("userId");
            String status = (String) request.get("status");
            
            if (userId == null || status == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid request");
                errorResponse.put("message", "userId and status are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            UserDto updatedUser = adminService.updateUserStatus(userId, status);
            LOGGER.info("Successfully updated user {} status to {}", userId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.error("Error updating user status: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update user status");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
