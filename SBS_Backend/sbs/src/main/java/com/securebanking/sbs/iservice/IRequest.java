package com.securebanking.sbs.iservice;

import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;

public interface IRequest {
    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto);
    public TransactionDto createTransactionRequest(TransactionDto transactionDto);
}
