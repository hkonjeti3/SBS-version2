package com.securebanking.sbs.controller.service;

import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.dto.UserRoleDto;
import com.securebanking.sbs.exception.InvalidCredentialsException;
import com.securebanking.sbs.exception.UserNotFoundException;
import com.securebanking.sbs.exception.UserRoleNotFoundException;
import com.securebanking.sbs.iservice.Iuser;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.model.UserRole;
import com.securebanking.sbs.repository.UserRepo;
import com.securebanking.sbs.repository.UserRoleRepo;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService implements Iuser {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private JwtUtil jwtUtil;

    private static Map<String, String> otpMap = new ConcurrentHashMap<>();
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
            user.setPasswordHash(userDto.getPasswordHash());
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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP for verification");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
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
        User user = userRepo.findByUsername(username);
        UserDto userDto = new UserDto();
        UserRoleDto userRoleDto = new UserRoleDto();

        if(user == null){
            throw  new InvalidCredentialsException("Invalid username");
        }
        if (!password.equals(user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid password");
        }
        BeanUtils.copyProperties(user,userDto);
        userRoleDto.setRoleId(user.getRole().getRoleId());
        userRoleDto.setRoleName(user.getRole().getRoleName());
        userDto.setRole(userRoleDto);
        String token = jwtUtil.generateToken(userDto.getUsername(),userDto.getUserId(),userDto.getEmailAddress(),userDto.getRole().getRoleId());
        userDto.setToken(token);
        String otp = generateOtp();
        System.out.println(otp);
        otpMap.put(userDto.getEmailAddress(), otp);
        sendOtpEmail(userDto.getEmailAddress(),otp);

        return userDto;
    }

    public boolean validateOtp(String email, String otpEnteredByUser) {
        String otp = otpMap.get(email);
        if (otp != null && otp.equals(otpEnteredByUser)) {
            otpMap.remove(email); // Remove OTP from storage
            return true;
        }
        return false;
    }

    public UserDto getUserById(Integer id){
        User user = userRepo.findById(id).get();
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user,userDto);
        userDto.setPasswordHash(null);
        return userDto;
    }

}
