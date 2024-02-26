package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.RequestService;
import com.securebanking.sbs.dto.TransactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/trnasactionRequest")
    @CrossOrigin(origins = "*")
    public TransactionDto newTransactionRequest(TransactionDto transactionDto){
        return requestService.createTransactionRequest(transactionDto);
    }
}
