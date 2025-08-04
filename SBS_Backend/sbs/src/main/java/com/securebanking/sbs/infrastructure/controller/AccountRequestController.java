package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.shared.dto.AccountRequestDto;
import com.securebanking.sbs.infrastructure.service.AccountRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/account-request")
@CrossOrigin(origins = "*")
public class AccountRequestController {
    
    @Autowired
    private AccountRequestService accountRequestService;
    
    // Submit a new account request
    @PostMapping
    public ResponseEntity<AccountRequestDto> submitAccountRequest(@RequestBody AccountRequestDto requestDto) {
        try {
            AccountRequestDto savedRequest = accountRequestService.submitAccountRequest(requestDto);
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get user's account requests
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountRequestDto>> getUserAccountRequests(@PathVariable Integer userId) {
        try {
            List<AccountRequestDto> requests = accountRequestService.getUserAccountRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get all pending account requests (for admin/internal users)
    @GetMapping("/pending")
    public ResponseEntity<List<AccountRequestDto>> getPendingAccountRequests() {
        try {
            List<AccountRequestDto> requests = accountRequestService.getPendingAccountRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Approve an account request
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<AccountRequestDto> approveAccountRequest(@PathVariable Integer requestId) {
        try {
            AccountRequestDto approvedRequest = accountRequestService.approveAccountRequest(requestId);
            return ResponseEntity.ok(approvedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Reject an account request
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<AccountRequestDto> rejectAccountRequest(
            @PathVariable Integer requestId,
            @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            String reason = requestBody != null ? requestBody.get("reason") : null;
            AccountRequestDto rejectedRequest = accountRequestService.rejectAccountRequest(requestId, reason);
            return ResponseEntity.ok(rejectedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 