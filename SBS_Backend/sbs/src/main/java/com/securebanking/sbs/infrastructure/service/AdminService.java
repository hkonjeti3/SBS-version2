package com.securebanking.sbs.infrastructure.service;
import com.securebanking.sbs.shared.dto.AccountDto;
import com.securebanking.sbs.shared.dto.UserDto;
import com.securebanking.sbs.shared.dto.UserRoleDto;
import com.securebanking.sbs.infrastructure.iservice.IAdmin;
import com.securebanking.sbs.modules.customer.model.Account;
import com.securebanking.sbs.shared.model.User;
import com.securebanking.sbs.shared.model.UserRole;
import com.securebanking.sbs.infrastructure.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.securebanking.sbs.core.exception.UserNotFoundException;

@Service
public class AdminService implements IAdmin {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    public UserRepo userRepo;

    public List<UserDto> getAllUsers() {
        try {
            List<User> users = userRepo.findAll();
            LOGGER.info("Found {} users", users.size());

            return users.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            LOGGER.error("Error retrieving users: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve users: " + e.getMessage(), e);
        }
    }

    private UserDto convertEntityToDto(User user) {
        try {
            UserDto userDto = new UserDto();
            userDto.setUserId(user.getUserId());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setUsername(user.getUsername());
            userDto.setPhoneNumber(user.getPhoneNumber());
            userDto.setAddress(user.getAddress());
            userDto.setStatus(user.getStatus());
            userDto.setEmailAddress(user.getEmailAddress());

            // Handle role safely
            if (user.getRole() != null) {
                UserRoleDto userRoleDto = new UserRoleDto();
                userRoleDto.setRoleId(user.getRole().getRoleId());
                userRoleDto.setRoleName(user.getRole().getRoleName());
                userDto.setRole(userRoleDto);
                
                // Debug: Log role information
                System.out.println("User " + user.getUsername() + " has role: " + user.getRole().getRoleName() + " (ID: " + user.getRole().getRoleId() + ")");
            } else {
                LOGGER.warn("User {} has no role assigned", user.getUserId());
                System.out.println("User " + user.getUsername() + " has NO role assigned");
                // Set a default role or leave it null
                userDto.setRole(null);
            }

            return userDto;
        } catch (Exception e) {
            LOGGER.error("Error converting user {} to DTO: {}", user.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Error converting user to DTO: " + e.getMessage(), e);
        }
    }

    public Optional<User> findUserById(Long userId) {
        LOGGER.info("Finding user by ID: {}", userId);
        try {
            return userRepo.findById(Math.toIntExact(userId));
        } catch (Exception e) {
            LOGGER.error("Error finding user by ID {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Error finding user: " + e.getMessage(), e);
        }
    }

    public UserDto updateUserStatus(Integer userId, String status) {
        try {
            LOGGER.info("Updating user {} status to {}", userId, status);
            
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            
            user.setStatus(status);
            User updatedUser = userRepo.save(user);
            
            LOGGER.info("Successfully updated user {} status to {}", userId, status);
            return convertEntityToDto(updatedUser);
        } catch (UserNotFoundException e) {
            LOGGER.error("User not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            LOGGER.error("Error updating user status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user status: " + e.getMessage(), e);
        }
    }
}
