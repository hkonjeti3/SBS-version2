package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.event.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    // Publish notification event
    public void publishNotificationEvent(NotificationEvent event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send("notifications", event.getUserId().toString(), event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Notification event sent successfully to partition {} with offset {}", 
                        result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                } else {
                    logger.error("Failed to send notification event", ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error publishing notification event", e);
        }
    }
    
    // Publish profile update request event
    public void publishProfileUpdateRequestEvent(Object event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send("profile-update-requests", "profile-update", event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Profile update request event sent successfully");
                } else {
                    logger.error("Failed to send profile update request event", ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error publishing profile update request event", e);
        }
    }
    
    // Publish account request event
    public void publishAccountRequestEvent(Object event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send("account-requests", "account-request", event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Account request event sent successfully");
                } else {
                    logger.error("Failed to send account request event", ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error publishing account request event", e);
        }
    }
    
    // Publish audit log event
    public void publishAuditLogEvent(Object event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send("audit-logs", "audit", event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Audit log event sent successfully");
                } else {
                    logger.error("Failed to send audit log event", ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error publishing audit log event", e);
        }
    }
} 