package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.shared.dto.LoginDto;
import com.securebanking.sbs.shared.dto.UserDto;
import com.securebanking.sbs.core.exception.UserNotFoundException;
import com.securebanking.sbs.core.exception.UserRoleNotFoundException;
import com.securebanking.sbs.infrastructure.service.UserService;
import com.securebanking.sbs.infrastructure.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    public UserService userService;
    
    @Autowired
    public ActivityLogService activityLogService;

    @PostMapping("/createOrUpdateUser")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> createOrUpdateUser(@Valid @RequestBody UserDto userDto) {
        try {
            userService.createOrUpdateUser(userDto);
            return ResponseEntity.ok("User created/updated successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UserRoleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PostMapping("/login")
    @CrossOrigin("*")
    public UserDto login(@Valid @RequestBody LoginDto loginRequest) {
        UserDto result = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        
        // Log the login activity
        if (result != null && result.getUserId() != null) {
            activityLogService.logActivity(
                result.getUserId(), 
                "User Login", 
                "User logged into the system",
                "Login successful for user: " + result.getUsername()
            );
        }
        
        return result;
    }

    @GetMapping("/test")
    @CrossOrigin("*")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint working!");
    }

    @GetMapping("/users")
    @CrossOrigin("*")
    public ResponseEntity<String> listUsers() {
        try {
            long count = userService.getUserCount();
            return ResponseEntity.ok("Number of users in database: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check-user")
    @CrossOrigin("*")
    public ResponseEntity<String> checkUser(@RequestParam String username) {
        try {
            boolean exists = userService.userExists(username);
            return ResponseEntity.ok("User '" + username + "' exists: " + exists);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login-test")
    @CrossOrigin("*")
    public ResponseEntity<String> loginTest(@RequestBody LoginDto loginRequest) {
        try {
            UserDto result = userService.loginTest(loginRequest.getUsername(), loginRequest.getPassword());
            
            // Log the login activity with different action name to avoid duplicates
            if (result != null && result.getUserId() != null) {
                activityLogService.logActivity(
                    result.getUserId(), 
                    "Login Test", 
                    "User login test completed",
                    "Login test successful for user: " + result.getUsername()
                );
            }
            
            return ResponseEntity.ok("Login successful for user: " + result.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/update-password")
    @CrossOrigin("*")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String newPassword = request.get("password");
            
            if (username == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Username and password are required");
            }
            
            boolean updated = userService.updatePassword(username, newPassword);
            if (updated) {
                return ResponseEntity.ok("Password updated successfully for user: " + username);
            } else {
                return ResponseEntity.status(404).body("User not found: " + username);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }

    @PostMapping("/validate-otp")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> validateOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        String otpEnteredByUser = otpRequest.get("otp");
        
        System.out.println("OTP Validation Request - Email: " + email + ", OTP: " + otpEnteredByUser);
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || otpEnteredByUser == null) {
            System.out.println("OTP Validation Failed - Missing email or OTP");
            response.put("success", false);
            response.put("message", "Email and OTP must be provided");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean isValid = userService.validateOtp(email, otpEnteredByUser);
        System.out.println("OTP Validation Result: " + isValid);
        
        if (isValid) {
            response.put("success", true);
            response.put("message", "OTP validated successfully");
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP");
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        System.out.println("Resend OTP Request - Email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null) {
            System.out.println("Resend OTP Failed - Missing email");
            response.put("success", false);
            response.put("message", "Email must be provided");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            userService.resendOtp(email);
            System.out.println("Resend OTP Success - Email: " + email);
            response.put("success", true);
            response.put("message", "OTP resent successfully");
        } catch (Exception e) {
            System.out.println("Resend OTP Failed - Email: " + email + ", Error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to resend OTP: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/userProfile")
    @CrossOrigin(origins = "*")
    public UserDto getUserProfile(@RequestParam Integer id) {
        return userService.getUserById(id);
    }
}
