package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.dto.AccountRequestDto;
import com.securebanking.sbs.shared.event.NotificationEvent;
import com.securebanking.sbs.modules.internal_user.model.AccountRequest;
import com.securebanking.sbs.shared.model.User;
import com.securebanking.sbs.infrastructure.repository.AccountRequestRepo;
import com.securebanking.sbs.infrastructure.repository.UserRepo;
import com.securebanking.sbs.core.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountRequestService {
    
    @Autowired
    private AccountRequestRepo accountRequestRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private KafkaProducerService kafkaProducerService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    // Submit a new account request
    @Transactional
    public AccountRequestDto submitAccountRequest(AccountRequestDto requestDto) {
        // Validate user exists
        User user = userRepo.findById(requestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + requestDto.getUserId()));
        
        // Create new account request
        AccountRequest request = new AccountRequest(
                requestDto.getUserId(),
                requestDto.getAccountType(),
                requestDto.getInitialBalance(),
                requestDto.getReason()
        );
        
        // Save the request
        AccountRequest savedRequest = accountRequestRepo.save(request);
        
        // Log activity
        activityLogService.logActivity(
            requestDto.getUserId(),
            "Account Creation Request",
            "New account request submitted for " + requestDto.getAccountType() + " account",
            "Initial Balance: $" + requestDto.getInitialBalance() + ", Reason: " + requestDto.getReason()
        );
        
        // Publish event to Kafka for async processing
        kafkaProducerService.publishAccountRequestEvent(savedRequest);
        
        // Convert to DTO and return
        return convertToDto(savedRequest);
    }
    
    // Get all account requests for a user
    public List<AccountRequestDto> getUserAccountRequests(Integer userId) {
        List<AccountRequest> requests = accountRequestRepo.findByUserIdOrderByTimestampDesc(userId);
        return requests.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get all pending account requests (for admin/internal users)
    public List<AccountRequestDto> getPendingAccountRequests() {
        List<AccountRequest> requests = accountRequestRepo.findByStatusOrderByTimestampDesc("Pending");
        return requests.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Approve an account request
    @Transactional
    public AccountRequestDto approveAccountRequest(Integer requestId) {
        AccountRequest request = accountRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Account request not found with ID: " + requestId));
        
        // Update the request status
        request.setStatus("Approved");
        AccountRequest savedRequest = accountRequestRepo.save(request);
        
        // Create the actual account (you would implement this based on your account creation logic)
        createAccountFromRequest(request);
        
        // Log activity
        activityLogService.logActivity(
            request.getUserId(),
            "Account Request Approved",
            "Account creation request approved for " + request.getAccountType() + " account",
            "Request ID: " + request.getId() + ", Initial Balance: $" + request.getInitialBalance()
        );
        
        // Publish notification event to Kafka
        createNotificationEvent(request, "approved");
        
        return convertToDto(savedRequest);
    }
    
    // Reject an account request
    @Transactional
    public AccountRequestDto rejectAccountRequest(Integer requestId, String reason) {
        AccountRequest request = accountRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Account request not found with ID: " + requestId));
        
        // Update the request status
        request.setStatus("Rejected");
        AccountRequest savedRequest = accountRequestRepo.save(request);
        
        // Log activity
        activityLogService.logActivity(
            request.getUserId(),
            "Account Request Rejected",
            "Account creation request rejected for " + request.getAccountType() + " account",
            "Request ID: " + request.getId() + ", Reason: " + reason
        );
        
        // Publish notification event to Kafka
        createNotificationEvent(request, "rejected", reason);
        
        return convertToDto(savedRequest);
    }
    
    // Create account from approved request
    private void createAccountFromRequest(AccountRequest request) {
        // This is a placeholder - you would implement actual account creation logic
        // For now, we'll just log that the account should be created
        System.out.println("Creating account for user " + request.getUserId() + 
                          " with type " + request.getAccountType() + 
                          " and initial balance " + request.getInitialBalance());
    }
    
    // Create notification event and publish to Kafka
    private void createNotificationEvent(AccountRequest request, String action, String... reason) {
        String title = "Account Request " + action.substring(0, 1).toUpperCase() + action.substring(1);
        String message = "Your account creation request for " + request.getAccountType() + " account has been " + action;
        
        if (reason.length > 0 && reason[0] != null) {
            message += ". Reason: " + reason[0];
        }
        
        NotificationEvent event = new NotificationEvent(
                request.getUserId(),
                "account_request",
                title,
                message,
                request.getId()
        );
        
        // Publish to Kafka for async processing
        kafkaProducerService.publishNotificationEvent(event);
    }
    
    // Convert entity to DTO
    private AccountRequestDto convertToDto(AccountRequest request) {
        AccountRequestDto dto = new AccountRequestDto();
        dto.setId(request.getId());
        dto.setUserId(request.getUserId());
        dto.setAccountType(request.getAccountType());
        dto.setInitialBalance(request.getInitialBalance());
        dto.setReason(request.getReason());
        dto.setStatus(request.getStatus());
        dto.setTimestamp(request.getTimestamp());
        
        // Set user name if user exists
        if (request.getUser() != null) {
            dto.setUserName(request.getUser().getFirstName() + " " + request.getUser().getLastName());
        }
        
        return dto;
    }
} 