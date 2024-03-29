package com.securebanking.sbs.iservice;

import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.model.Transaction;

import java.util.List;

public interface IRequest {
    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto);
    public TransactionDto createTransactionRequest(TransactionDto transactionDto);
//    public UserProfileUpdateRequestDto ApproveProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto);

    public TransactionAuthorizationDto approveTransactionRequest(TransactionAuthorizationDto transactionAuthorizationDto);

    public TransactionAuthorizationDto rejectTransactionRequest(TransactionAuthorizationDto transactionAuthorizationDto);

    public UserProfileUpdateRequestDto createUpdateProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto);
    public List<UserProfileUpdateRequestDto> getPendingUpdateRequests();
}
