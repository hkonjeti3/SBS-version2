package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserService;
import com.securebanking.sbs.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    public UserService userService;

    @PostMapping("/CreateOrUpdateUser")
    @CrossOrigin(origins = "*")
    public Void CreateOrUpdateUser(@RequestBody UserDto userDto){
        return userService.createOrUpdateUser(userDto);
    }

}
