package com.securebanking.sbs.infrastructure.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            logger.info("Sending OTP email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Secure Banking System - OTP Verification");
            message.setText("Your OTP for verification is: " + otp + "\n\n" +
                          "This code will expire in 5 minutes.\n" +
                          "If you didn't request this code, please ignore this email.\n\n" +
                          "Best regards,\nSecure Banking System Team");
            
            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", to);
            
        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {}", to, e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }

    public void sendNotificationEmail(String to, String subject, String message) {
        try {
            logger.info("Sending notification email to: {}", to);
            
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(to);
            emailMessage.setSubject("Secure Banking System - " + subject);
            emailMessage.setText(message + "\n\nBest regards,\nSecure Banking System Team");
            
            mailSender.send(emailMessage);
            logger.info("Notification email sent successfully to: {}", to);
            
        } catch (Exception e) {
            logger.error("Failed to send notification email to: {}", to, e);
            throw new RuntimeException("Failed to send notification email: " + e.getMessage(), e);
        }
    }

    public void sendWelcomeEmail(String to, String firstName) {
        try {
            logger.info("Sending welcome email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to Secure Banking System");
            message.setText("Dear " + firstName + ",\n\n" +
                          "Welcome to Secure Banking System!\n\n" +
                          "Your account has been successfully created. You can now log in and start using our secure banking services.\n\n" +
                          "If you have any questions, please don't hesitate to contact our support team.\n\n" +
                          "Best regards,\nSecure Banking System Team");
            
            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", to);
            
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", to, e);
            throw new RuntimeException("Failed to send welcome email: " + e.getMessage(), e);
        }
    }
} 