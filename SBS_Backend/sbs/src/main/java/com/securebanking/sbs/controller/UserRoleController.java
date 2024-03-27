package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.UserRoleService;
import com.securebanking.sbs.dto.UserRoleDto;
import com.securebanking.sbs.util.JwtTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserRoleController {

    @Autowired
    public UserRoleService userRoleService  ;

    @PostMapping("/addUserRole")
    @CrossOrigin(origins = "*")
    public UserRoleDto addUserRole(@RequestBody UserRoleDto userRoleDto){
        return userRoleService.addNewUserRole(userRoleDto);
    }

    @GetMapping("/getUserRoles")
//    @JwtTokenRequired
    @CrossOrigin(origins = "*")
    public List<UserRoleDto> getAllUserRole(){
        return userRoleService.getUserRoles();
    }

}
