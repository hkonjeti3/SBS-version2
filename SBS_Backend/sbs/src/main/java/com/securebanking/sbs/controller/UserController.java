package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserService;
import com.securebanking.sbs.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    public UserService userService;

    @PostMapping("/addUser")
    @CrossOrigin(origins = "*")
    public UserDto addUser(UserDto userDto){
        return userService.addNewUser(userDto);
    }

}
