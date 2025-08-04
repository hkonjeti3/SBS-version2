package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.event.NotificationEvent;
import com.securebanking.sbs.shared.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class KafkaNotificationConsumer {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaNotificationConsumer.class);
    
    @Autowired
    private NotificationService notificationService;
    
    @KafkaListener(
        topics = "notifications",
        groupId = "notification-consumer-group"
    )
    public void consumeNotificationEvent(
            @Payload NotificationEvent event,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        
        try {
            logger.info("Processing notification event for user {} from partition {} with offset {}", 
                event.getUserId(), partition, offset);
            
            // Create notification in database
            Notification notification = new Notification();
            notification.setUserId(event.getUserId());
            notification.setType(event.getType());
            notification.setTitle(event.getTitle());
            notification.setMessage(event.getMessage());
            notification.setRelatedId(event.getRelatedId());
            notification.setIsRead(false);
            notification.setTimestamp(event.getTimestamp());
            
            notificationService.createNotification(
                event.getUserId(),
                event.getType(),
                event.getTitle(),
                event.getMessage(),
                event.getRelatedId()
            );
            
            logger.info("Notification processed successfully for user {}", event.getUserId());
            
        } catch (Exception e) {
            logger.error("Error processing notification event for user {}", event.getUserId(), e);
            // In a production system, you might want to send to a dead letter queue
        }
    }
} 