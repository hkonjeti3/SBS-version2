package com.securebanking.sbs.controller.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.enums.ApprovalStatus;
import com.securebanking.sbs.enums.RequestStatus;
import com.securebanking.sbs.iservice.IRequest;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.model.UserProfileUpdateRequest;
import com.securebanking.sbs.repository.UserProfileUpdateRequestRepo;
import com.securebanking.sbs.repository.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestService implements IRequest {

    @Autowired
    UserRepo userRepo;

    @Autowired
    UserService userService;
    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto) {

        return transactionAuthorizationDto;
    }
//    transactionId,user,Acc-recAcc,tranctiontype,amount, status
    public TransactionDto createTransactionRequest(TransactionDto transactionDto) {
        Transaction transaction =new Transaction();
//        User user = userRepo.findById().get();
//        Account account =
//        transaction.setUser(user);
//        transaction.setReceiverAcc();
        transaction.setTransactionType(transactionDto.getTransactionType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setStatus("Created");


        return transactionDto;
    }

    @Autowired
    private UserProfileUpdateRequestRepo userProfileUpdateRequestRepo;

    public List<UserProfileUpdateRequest> getPendingUpdateRequests() {
        return userProfileUpdateRequestRepo.findByStatus(RequestStatus.PENDING);
    }


    public UserProfileUpdateRequestDto createUpdateProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto) throws JsonProcessingException {
        UserProfileUpdateRequest userProfileUpdateRequest = new UserProfileUpdateRequest();
        if(userProfileUpdateRequestDto.getId() != null){
            userProfileUpdateRequest = userProfileUpdateRequestRepo.findById(userProfileUpdateRequestDto.getId()).get();
            if(userProfileUpdateRequest.getApprovalStatus() == ApprovalStatus.PENDING && userProfileUpdateRequestDto.getApprovalStatus()==ApprovalStatus.APPROVED){
                userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.APPROVED);
                userProfileUpdateRequest.setApprover(userProfileUpdateRequestDto.getApprover());
                userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());

                ObjectMapper mapper = new ObjectMapper();
                UserDto updatedUserData = mapper.readValue(userProfileUpdateRequest.getUpdateData(), UserDto.class);
                HttpStatus userUpdateStatus= userService.createOrUpdateUser(updatedUserData);
                if(userUpdateStatus.equals(HttpStatus.OK)){
                    userProfileUpdateRequest.setStatus(RequestStatus.UPDATED);
                }
                else{
                    userProfileUpdateRequest.setStatus(RequestStatus.PENDING);
                }

                userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
                userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
            }
            else if (userProfileUpdateRequest.getApprovalStatus() == ApprovalStatus.PENDING && userProfileUpdateRequestDto.getApprovalStatus()==ApprovalStatus.REJECTED){
                userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.REJECTED);
                userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());
                userProfileUpdateRequest.setStatus(RequestStatus.REJECTED);
                userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
                userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
            }


        }
        else{
            BeanUtils.copyProperties(userProfileUpdateRequestDto,userProfileUpdateRequest);
            userProfileUpdateRequest.setStatus(RequestStatus.CREATED);
            userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.PENDING);
            userProfileUpdateRequest.setRequestDate(LocalDateTime.now());
            userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
        }

        BeanUtils.copyProperties(userProfileUpdateRequest,userProfileUpdateRequestDto);
        return userProfileUpdateRequestDto;
    }

    public UserProfileUpdateRequestDto ApproveProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto) {
        UserProfileUpdateRequest userProfileUpdateRequest = userProfileUpdateRequestRepo.findById(userProfileUpdateRequestDto.getId()).get();
        userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.APPROVED);
        User aprrover= userRepo.findById(userProfileUpdateRequestDto.getApprover().getUserId()).get();
        userProfileUpdateRequest.setApprover(aprrover);
        userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());
        userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
        userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
        BeanUtils.copyProperties(userProfileUpdateRequest,userProfileUpdateRequestDto);
    return userProfileUpdateRequestDto;
    }
}
