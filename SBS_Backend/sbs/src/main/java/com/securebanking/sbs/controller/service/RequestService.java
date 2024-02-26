package com.securebanking.sbs.controller.service;

import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.iservice.IRequest;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RequestService implements IRequest {

    @Autowired
    UserRepo userRepo;
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
}
