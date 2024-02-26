package com.securebanking.sbs.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.securebanking.sbs.controller.service.RequestService;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.model.UserProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RequestController {

//    @PostMapping("/requestTransaction")
//    @CrossOrigin(origins = "*")
//    public TransactionAuthorizationDto

    @Autowired
    RequestService requestService;

//    @GetMapping("/allTransactionRequests")
//    @CrossOrigin(origins = "*")
//    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto) {
//        return requestService.getAllTranctionRequests(transactionAuthorizationDto);
//    }

    @PostMapping("/transactionRequest")
    @CrossOrigin(origins = "*")
    public TransactionDto newTransactionRequest(TransactionDto transactionDto){
        return requestService.createTransactionRequest(transactionDto);
    }

    @GetMapping("/pendingProfileRequests")
    public List<UserProfileUpdateRequest> getPendingUpdateRequests() {
        List<UserProfileUpdateRequest> requests = requestService.getPendingUpdateRequests();
        return requests;
    }

//    @PostMapping("/{requestId}/approve")
//    public ResponseEntity<String> approveUpdateRequest(@PathVariable Long requestId, @RequestParam Long approverId) {
//        requestService.approveUpdateRequest(requestId, approverId);
//        return ResponseEntity.ok("Request approved successfully.");
//    }
    @PostMapping("/updateUserProfile")  // send data to update as json string of new user data in UpdatdData variable.
    public UserProfileUpdateRequestDto createUpdateProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto) throws JsonProcessingException {
        return requestService.createUpdateProfileRequest(userProfileUpdateRequestDto);

    }

//    @PostMapping("/updateProfile/Approve")  // send data to update as json string of new user data in UpdatdData variable.
//    public UserProfileUpdateRequestDto ApproveProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto) throws JsonProcessingException {
//        return requestService.ApproveProfileRequest(userProfileUpdateRequestDto);
//
//    }
}
