package com.securebanking.sbs.controller;

import com.securebanking.sbs.controller.service.AccountService;
import com.securebanking.sbs.controller.service.RequestService;
import com.securebanking.sbs.dto.AccountDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.repository.AccountRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private AccountService accountService;

    @Autowired
    private RequestService requestService;
    @PostMapping("/createAccount")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> createAccount(@RequestBody AccountDto accountDto) {
        accountService.createAccount(accountDto);
        return new ResponseEntity<>("Account created successfully.", HttpStatus.CREATED);
    }

    @PutMapping("/updateAccount/{accountId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> updateAccount(@PathVariable Long accountId, @RequestBody AccountDto accountDto){
        accountService.updateAccount(accountId, accountDto);
        return ResponseEntity.ok().build(); // Assuming successful update
    }

    @GetMapping("/user/{userId}/accountDetails")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> getAllUserAccounts(@PathVariable Integer userId) {
        List<AccountDto> accountDto = accountService.getAllAccountsForUser(userId);
        Map<String, Object> response = new HashMap<>();
        if (accountDto.isEmpty()) {
            response.put("message", "No accounts found for the user.");
        }
//        else {
//            response.put("message", "Accounts retrieved successfully.");
//        }
        response.put("accounts", accountDto);
        return ResponseEntity.ok(response);
    }

    //Request Types - TransferFunds, Credit, Debit and delete
    @PostMapping("/{transactionType}/request")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> transactionRequest(@RequestBody TransactionDto transactionDto) {
        requestService.createTransactionRequest(transactionDto);
        return ResponseEntity.ok(String.format("%s request created successfully", transactionDto.getTransactionType()));
    }
}
