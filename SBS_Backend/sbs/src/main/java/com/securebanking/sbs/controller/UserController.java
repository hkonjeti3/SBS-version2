package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserService;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.exception.UserNotFoundException;
import com.securebanking.sbs.exception.UserRoleNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.securebanking.sbs.dto.LoginDto;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    public UserService userService;

//    @PostMapping("/CreateOrUpdateUser")
//    @CrossOrigin(origins = "*")
//    public Void CreateOrUpdateUser(@RequestBody UserDto userDto){
//        return userService.createOrUpdateUser(userDto);
//    }

    @PostMapping("/createOrUpdateUser")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> createOrUpdateUser(@Valid @RequestBody UserDto userDto) {
        try {
            HttpStatus result = userService.createOrUpdateUser(userDto);
            if(HttpStatus.OK == result){
                return ResponseEntity.ok("User created/updated successfully");
            }
            else{
                throw new Exception();
            }

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
        return result;

    }

    @PostMapping("/validate-otp")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> validateOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        String otpEnteredByUser = otpRequest.get("otp");
        if (email == null || otpEnteredByUser == null) {
            return ResponseEntity.badRequest().body("Email and OTP must be provided");
        }
        if (userService.validateOtp(email, otpEnteredByUser)) {
            return ResponseEntity.ok("OTP is valid");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }

    @GetMapping("/userProfile")
    @CrossOrigin(origins = "*")
    public UserDto getUserProfile(@RequestParam Integer id) {
        return userService.getUserById(id);
    }

}
