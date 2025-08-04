package com.securebanking.sbs.infrastructure.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.securebanking.sbs.shared.event.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(EmailConsumerService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "notifications", groupId = "email-group")
    public void consumeEmailNotification(Object message) {
        try {
            NotificationEvent event;
            
            // Handle different message formats
            if (message instanceof String) {
                // Parse JSON string
                event = objectMapper.readValue((String) message, NotificationEvent.class);
            } else if (message instanceof Map) {
                // Convert Map to NotificationEvent
                event = objectMapper.convertValue(message, NotificationEvent.class);
            } else {
                // Try to convert to string first, then parse
                String messageStr = objectMapper.writeValueAsString(message);
                event = objectMapper.readValue(messageStr, NotificationEvent.class);
            }
            
            logger.info("Processing email notification for user: {}", event.getUserId());
            
            // Send the actual email
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(event.getTitle()); // Using title as email address for OTP
            emailMessage.setSubject("Secure Banking System - " + event.getType());
            emailMessage.setText(event.getMessage());
            
            mailSender.send(emailMessage);
            logger.info("Email sent successfully to: {}", event.getTitle());
            
        } catch (Exception e) {
            logger.error("Error processing email notification: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "profile-update-requests", groupId = "profile-group")
    public void consumeProfileUpdateRequest(String message) {
        try {
            logger.info("Processing profile update request: {}", message);
        } catch (Exception e) {
            logger.error("Error processing profile update request: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "account-requests", groupId = "account-group")
    public void consumeAccountRequest(String message) {
        try {
            logger.info("Processing account request: {}", message);
        } catch (Exception e) {
            logger.error("Error processing account request: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "audit-logs", groupId = "audit-group")
    public void consumeAuditLog(String message) {
        try {
            logger.info("Processing audit log: {}", message);
        } catch (Exception e) {
            logger.error("Error processing audit log: {}", e.getMessage());
        }
    }
} 