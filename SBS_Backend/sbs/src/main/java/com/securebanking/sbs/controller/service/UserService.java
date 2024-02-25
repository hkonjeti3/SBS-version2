package com.securebanking.sbs.controller.service;

import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.iservice.Iuser;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.repository.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements Iuser {

    @Autowired
    private UserRepo userRepo;
    public UserDto addNewUser(UserDto userDto) {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setUsername(userDto.getUsername());
        user.setAddress(userDto.getAddress());
        user.setEmailAddress(userDto.getEmailAddress());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setPasswordHash(userDto.getPasswordHash());
        user.setStatus(userDto.getStatus());


        User savedUser = userRepo.save(user);
        BeanUtils.copyProperties(savedUser,userDto);

        return userDto;
    }
}
