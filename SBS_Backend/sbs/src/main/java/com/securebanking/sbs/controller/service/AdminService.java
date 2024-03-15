package com.securebanking.sbs.controller.service;
import com.securebanking.sbs.dto.AccountDto;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.dto.UserRoleDto;
import com.securebanking.sbs.iservice.IAdmin;
import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.model.UserRole;
import com.securebanking.sbs.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService implements IAdmin {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    public UserRepo userRepo;


    public List<UserDto> getAllUsers() {
        List<User> users = userRepo.findAll();

        return users.
                stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());

    }

    private UserDto convertEntityToDto(User user){
        UserDto userDto = new UserDto();
        //UserRoleDto userRoleDto = new UserRoleDto();
        userDto.setUserId(user.getUserId());
        userDto.setFirstName((user.getFirstName()));
        userDto.setEmailAddress(user.getEmailAddress());

//        userRoleDto.setRoleId(user.getRole().getRoleId());
//        userRoleDto.setRoleName(userDto.getRole().getRoleName());
//        userDto.setRole(userRoleDto);
        return userDto;
    }

    public Optional<User> findUserById(Long userId) {
        LOGGER.info("Finding user by ID: {}", userId);
        return userRepo.findById(Math.toIntExact(userId));
    }

//    public User activateUser(Long userId) {
//        LOGGER.info("Activating user with ID: {}", userId);
//        return userRepo.findById(userId).map(user -> {
//            user.setActive(true);
//            return userRepo.save(user);
//        }).orElseThrow(() -> new RuntimeException("User not found"));
//    }
//
//    public User deactivateUser(Long userId) {
//        LOGGER.info("Deactivating user with ID: {}", userId);
//        return userRepo.findById(userId).map(user -> {
//            user.setActive(false);
//            return userRepo.save(user);
//        }).orElseThrow(() -> new RuntimeException("User not found"));
//    }
}
