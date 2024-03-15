package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.AdminService;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    @GetMapping("/users")
    @CrossOrigin(origins = "*")
    public List<UserDto> getAllUserDetails(){
        return adminService.getAllUsers();
    }

//    // Retrieves details for a specific user
//    @GetMapping("/users/{userId}")
//    public ResponseEntity<Optional<User>> getUserById(@PathVariable Long userId) {
//        LOGGER.info("Request to get user with id: {}", userId);
//        Optional<User> user = adminService.findUserById(userId);
//        return ResponseEntity.ok(user);
//    }

//    // Activates a user account
//    @PostMapping("/users/{userId}/activate")
//    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
//        LOGGER.info("Request to activate user with id: {}", userId);
//        adminService.activateUser(userId);
//        return ResponseEntity.ok().build();
//    }
//
//    // Deactivates a user account
//    @PostMapping("/users/{userId}/deactivate")
//    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
//        LOGGER.info("Request to deactivate user with id: {}", userId);
//        adminService.deactivateUser(userId);
//        return ResponseEntity.ok().build();
//    }
}
