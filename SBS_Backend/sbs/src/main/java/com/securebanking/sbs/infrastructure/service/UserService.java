package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.dto.UserDto;
import com.securebanking.sbs.shared.dto.UserRoleDto;
import com.securebanking.sbs.core.exception.InvalidCredentialsException;
import com.securebanking.sbs.core.exception.UserNotFoundException;
import com.securebanking.sbs.core.exception.UserRoleNotFoundException;
import com.securebanking.sbs.shared.model.User;
import com.securebanking.sbs.shared.model.UserRole;
import com.securebanking.sbs.infrastructure.repository.UserRepo;
import com.securebanking.sbs.infrastructure.repository.UserRoleRepo;
import com.securebanking.sbs.infrastructure.service.OtpService;
// KafkaEventService import removed for Render deployment
import com.securebanking.sbs.infrastructure.service.EmailService;
import com.securebanking.sbs.core.util.JwtUtil;
import com.securebanking.sbs.infrastructure.iservice.Iuser;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService implements Iuser {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private OtpService otpService;
    @Autowired
    private EmailService emailService;
    // KafkaEventService removed for Render deployment
    
    @Autowired
    private ActivityLogService activityLogService;

    private static final String CHARACTERS = "0123456789";
    private static final int OTP_LENGTH = 6;

    public HttpStatus createOrUpdateUser(@Valid UserDto userDto) throws UserNotFoundException {
        User user = new User();
        UserRole userRole = userRoleRepo.findById(userDto.getRole().getRoleId()).orElseThrow(() -> new UserRoleNotFoundException("User role not found"));

        if(userDto.getUserId() != null){
            user = userRepo.findById(userDto.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found"));
        }

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        if (userDto.getUsername() != null) {
            user.setUsername(userDto.getUsername());
        }
        if(userDto.getPasswordHash() != null) {
            // Hash the password with BCrypt before storing
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(userDto.getPasswordHash());
            user.setPasswordHash(hashedPassword);
            logger.info("Password hashed and stored for user: {}", userDto.getUsername());
        }
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setEmailAddress(userDto.getEmailAddress());
        user.setAddress(userDto.getAddress());
        user.setRole(userRole);
        user.setStatus("Active");

        user=userRepo.save(user);
        if (user != null){
            return HttpStatus.OK;
        }
        else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

    public void sendOtpEmail(String to, String otp) {
        emailService.sendOtpEmail(to, otp);
    }
    
    public static String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return otp.toString();
    }

    public UserDto login(String username, String password) throws InvalidCredentialsException {
        try {
            logger.info("Login attempt for username: {}", username);
            
            User user = userRepo.findByUsername(username);
            logger.info("User lookup result: {}", user != null ? "User found" : "User not found");
            
            UserDto userDto = new UserDto();
            UserRoleDto userRoleDto = new UserRoleDto();

            if(user == null){
                logger.warn("Login failed - User not found: {}", username);
                // Kafka event publishing removed for Render deployment
                throw new InvalidCredentialsException("Invalid username");
            }
            
            logger.info("User found, verifying password for user: {}", username);
            
            // Use BCrypt to verify password
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                logger.warn("Login failed - Invalid password for user: {}", username);
                // Kafka event publishing removed for Render deployment
                throw new InvalidCredentialsException("Invalid password");
            }
            
            logger.info("Password verified successfully for user: {}", username);
            
            // Check if user is active
            if (!"Active".equals(user.getStatus())) {
                logger.warn("Login failed - User is not active: {} (status: {})", username, user.getStatus());
                // Kafka event publishing removed for Render deployment
                throw new InvalidCredentialsException("Account is deactivated. Please contact administrator.");
            }
            
            logger.info("User status verified - User is active: {}", username);
            
            BeanUtils.copyProperties(user,userDto);
            userRoleDto.setRoleId(user.getRole().getRoleId());
            userRoleDto.setRoleName(user.getRole().getRoleName());
            userDto.setRole(userRoleDto);
            
            logger.info("Generating JWT token for user: {}", username);
            String token = jwtUtil.generateToken(userDto.getUsername(), userDto.getUserId(), userDto.getEmailAddress(), userDto.getRole().getRoleId(), userDto.getFirstName(), userDto.getLastName());
            userDto.setToken(token);
            
            logger.info("Generating OTP for user: {}", username);
            String otp = generateOtp();
            logger.info("Generated OTP for user {}: {}", username, otp);
            
            logger.info("Storing OTP for user: {}", username);
            otpService.storeOtp(userDto.getEmailAddress(), otp);
            
            // Send OTP email using dedicated email service
            try {
                emailService.sendOtpEmail(userDto.getEmailAddress(), otp);
                logger.info("OTP email sent successfully to: {}", userDto.getEmailAddress());
            } catch (Exception e) {
                logger.error("Failed to send OTP email to: {}", userDto.getEmailAddress(), e);
                // Don't throw exception, just log the error and continue
                // The login is still successful even if email fails
            }
            
            // Log successful login activity
            activityLogService.logActivity(
                userDto.getUserId(),
                "Login",
                "User logged in successfully",
                "Username: " + username + ", Role: " + userDto.getRole().getRoleName()
            );
            
            logger.info("Login successful for user: {}", username);
            return userDto;
            
        } catch (InvalidCredentialsException e) {
            logger.warn("Login failed with InvalidCredentialsException: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Login failed with unexpected error for user: {}", username, e);
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    }

    public boolean validateOtp(String email, String otpEnteredByUser) {
        return otpService.validateAndRemoveOtp(email, otpEnteredByUser);
    }

    public void resendOtp(String email) {
        // Generate new OTP
        String newOtp = generateOtp();
        logger.info("Resending OTP for {}: {}", email, newOtp);
        
        // Store the new OTP
        otpService.storeOtp(email, newOtp);
        
        // Send new OTP email using dedicated email service
        try {
            emailService.sendOtpEmail(email, newOtp);
            logger.info("Resend OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to resend OTP email to: {}", email, e);
            throw new RuntimeException("Failed to resend OTP email", e);
        }
    }

    public UserDto getUserById(Integer id){
        User user = userRepo.findById(id).get();
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user,userDto);
        userDto.setPasswordHash(null);
        return userDto;
    }

    public long getUserCount() {
        return userRepo.count();
    }

    public boolean userExists(String username) {
        return userRepo.findByUsername(username) != null;
    }

    public boolean updatePassword(String username, String newPassword) {
        try {
            User user = userRepo.findByUsername(username);
            if (user == null) {
                logger.warn("Password update failed - User not found: {}", username);
                return false;
            }
            
            // Hash the new password with BCrypt
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPasswordHash(hashedPassword);
            
            userRepo.save(user);
            logger.info("Password updated successfully for user: {}", username);
            return true;
            
        } catch (Exception e) {
            logger.error("Password update failed for user: {}", username, e);
            return false;
        }
    }

    public UserDto loginTest(String username, String password) throws InvalidCredentialsException {
        try {
            logger.info("Login test for username: {}", username);
            
            User user = userRepo.findByUsername(username);
            if(user == null){
                throw new InvalidCredentialsException("User not found: " + username);
            }
            
            logger.info("User found: {}", user.getUsername());
            logger.info("Stored password hash: {}", user.getPasswordHash());
            
            // Use BCrypt to verify password
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            boolean passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
            logger.info("Password matches: {}", passwordMatches);
            
            if (!passwordMatches) {
                throw new InvalidCredentialsException("Invalid password for user: " + username);
            }
            
            // Check if user is active
            if (!"Active".equals(user.getStatus())) {
                logger.warn("Login test failed - User is not active: {} (status: {})", username, user.getStatus());
                throw new InvalidCredentialsException("Account is deactivated. Please contact administrator.");
            }
            
            logger.info("User status verified - User is active: {}", username);
            
            UserDto userDto = new UserDto();
            UserRoleDto userRoleDto = new UserRoleDto();
            
            BeanUtils.copyProperties(user, userDto);
            userRoleDto.setRoleId(user.getRole().getRoleId());
            userRoleDto.setRoleName(user.getRole().getRoleName());
            userDto.setRole(userRoleDto);
            
            logger.info("Login test successful for user: {}", username);
            return userDto;
            
        } catch (InvalidCredentialsException e) {
            logger.warn("Login test failed with InvalidCredentialsException: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Login test failed with unexpected error for user: {}", username, e);
            throw new RuntimeException("Login test failed: " + e.getMessage(), e);
        }
    }
}
