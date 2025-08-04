package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.shared.dto.ProfileUpdateRequestDto;
import com.securebanking.sbs.infrastructure.service.ProfileUpdateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile-update-request")
@CrossOrigin(origins = "*")
public class ProfileUpdateRequestController {
    
    @Autowired
    private ProfileUpdateRequestService profileUpdateRequestService;
    
    // Submit a new profile update request
    @PostMapping
    public ResponseEntity<ProfileUpdateRequestDto> submitProfileUpdateRequest(@RequestBody ProfileUpdateRequestDto requestDto) {
        try {
            ProfileUpdateRequestDto savedRequest = profileUpdateRequestService.submitProfileUpdateRequest(requestDto);
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get user's profile update requests
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProfileUpdateRequestDto>> getUserProfileRequests(@PathVariable Integer userId) {
        try {
            List<ProfileUpdateRequestDto> requests = profileUpdateRequestService.getUserProfileRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get all pending profile update requests (for admin/internal users)
    @GetMapping("/pending")
    public ResponseEntity<List<ProfileUpdateRequestDto>> getPendingProfileRequests() {
        try {
            List<ProfileUpdateRequestDto> requests = profileUpdateRequestService.getPendingProfileRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Approve a profile update request
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<ProfileUpdateRequestDto> approveProfileRequest(@PathVariable Integer requestId) {
        try {
            ProfileUpdateRequestDto approvedRequest = profileUpdateRequestService.approveProfileRequest(requestId);
            return ResponseEntity.ok(approvedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Reject a profile update request
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<ProfileUpdateRequestDto> rejectProfileRequest(
            @PathVariable Integer requestId,
            @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            String reason = requestBody != null ? requestBody.get("reason") : null;
            ProfileUpdateRequestDto rejectedRequest = profileUpdateRequestService.rejectProfileRequest(requestId, reason);
            return ResponseEntity.ok(rejectedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 