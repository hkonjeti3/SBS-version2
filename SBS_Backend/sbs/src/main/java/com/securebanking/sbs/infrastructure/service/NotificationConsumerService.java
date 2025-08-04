package com.securebanking.sbs.infrastructure.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.securebanking.sbs.shared.event.NotificationEvent;
import com.securebanking.sbs.shared.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationConsumerService.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "notifications", groupId = "notification-consumer-group")
    public void consumeNotification(Object message) {
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
            
            logger.info("Processing notification for user: {}, type: {}, title: {}", 
                       event.getUserId(), event.getType(), event.getTitle());
            
            // Create notification in database
            Notification notification = notificationService.createNotification(
                event.getUserId(),
                event.getType(),
                event.getTitle(),
                event.getMessage(),
                event.getRelatedId()
            );
            
            logger.info("Notification created successfully with ID: {}", notification.getId());
            
        } catch (Exception e) {
            logger.error("Error processing notification: {}", e.getMessage(), e);
        }
    }
} 