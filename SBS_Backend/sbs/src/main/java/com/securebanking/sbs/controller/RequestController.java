package com.securebanking.sbs.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.securebanking.sbs.controller.service.RequestService;
import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.model.UserProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction")
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

    @PostMapping("/request")
    @CrossOrigin(origins = "*")
    public TransactionDto newTransactionRequest(@RequestBody TransactionDto transactionDto){
        return requestService.createTransactionRequest(transactionDto);
    }

    @GetMapping("/pendingProfileRequests")
    @CrossOrigin(origins = "*")
    public List<UserProfileUpdateRequestDto> getPendingUpdateRequests() {
        return requestService.getPendingUpdateRequests();
    }

//    @PostMapping("/{requestId}/approve")
//    public ResponseEntity<String> approveUpdateRequest(@PathVariable Long requestId, @RequestParam Long approverId) {
//        requestService.approveUpdateRequest(requestId, approverId);
//        return ResponseEntity.ok("Request approved successfully.");
//    }
    @PostMapping("/updateUserProfile")  // send data to update as json string of new user data in UpdatdData variable.
    @CrossOrigin(origins =  "*")
    public UserProfileUpdateRequestDto createUpdateProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto)  {
        return requestService.createUpdateProfileRequest(userProfileUpdateRequestDto);

    }

    @PostMapping("/approveRequest") // POST method for approval of transactions
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> approveTransaction(@RequestBody TransactionAuthorizationDto transactionAuthorizationDto) {
        try {
            TransactionAuthorizationDto approvedTransaction = requestService.approveTransactionRequest(transactionAuthorizationDto);
            return ResponseEntity.ok("approvedTransaction");
        } catch (Exception e) {
            // Handle the exception, possibly returning a different HTTP status code
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @PostMapping("/rejectRequest") // POST method for approval of transactions
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> rejectTransaction(@RequestBody TransactionAuthorizationDto transactionAuthorizationDto) {
        try {
            TransactionAuthorizationDto approvedTransaction = requestService.rejectTransactionRequest(transactionAuthorizationDto);
            return ResponseEntity.ok("rejected Transaction");
        } catch (Exception e) {
            // Handle the exception, possibly returning a different HTTP status code
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @GetMapping("/allTransactions")
    @CrossOrigin(origins = "*")
    public List<Transaction> getAllTransactions() {
        return requestService.getAllTransactions();
    }

//    @PostMapping("/updateProfile/Approve")  // send data to update as json string of new user data in UpdatdData variable.
//    public UserProfileUpdateRequestDto ApproveProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto) throws JsonProcessingException {
//        return requestService.ApproveProfileRequest(userProfileUpdateRequestDto);
//
//    }
}
