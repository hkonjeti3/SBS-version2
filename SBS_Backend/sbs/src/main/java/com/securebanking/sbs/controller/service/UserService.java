package com.securebanking.sbs.controller.service;

import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.iservice.Iuser;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.model.UserRole;
import com.securebanking.sbs.repository.UserRepo;
import com.securebanking.sbs.repository.UserRoleRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements Iuser {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    public Void createOrUpdateUser(@Valid UserDto userDto) {
        User user = new User();
        UserRole userRole = userRoleRepo.findById(userDto.getRole().getRoleId()).get();
        if(userDto.getUserId() != null){
            user = userRepo.findById(userDto.getUserId()).get();
//            add exception and validation for user fetching by id.
        }
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setUsername(userDto.getUsername());
        user.setPasswordHash(userDto.getPasswordHash());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setEmailAddress(userDto.getEmailAddress());
        user.setAddress(userDto.getAddress());
        user.setRole(userRole);
        user.setStatus("Active");

        user=userRepo.save(user);
//        BeanUtils.copyProperties(user,userDto); //remove and return void

//        return userDto;
        return null;
    }
}
