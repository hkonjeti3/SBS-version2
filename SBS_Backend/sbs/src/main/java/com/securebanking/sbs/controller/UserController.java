package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserService;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.exception.UserNotFoundException;
import com.securebanking.sbs.exception.UserRoleNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
