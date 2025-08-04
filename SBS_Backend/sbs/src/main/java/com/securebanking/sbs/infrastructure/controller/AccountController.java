package com.securebanking.sbs.infrastructure.controller;

import com.securebanking.sbs.infrastructure.service.AccountService;
import com.securebanking.sbs.infrastructure.service.RequestService;
import com.securebanking.sbs.shared.dto.AccountDto;
import com.securebanking.sbs.shared.dto.TransactionDto;
import com.securebanking.sbs.infrastructure.repository.AccountRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.securebanking.sbs.core.exception.DatabaseOperationException;
import com.securebanking.sbs.core.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private AccountService accountService;

    @Autowired
    private RequestService requestService;
    
    @PostMapping("/account/createAccount")
    public ResponseEntity<?> createAccount(@RequestBody AccountDto accountDto) {
        try {
            AccountDto createdAccount = accountService.createAccount(accountDto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully.");
            response.put("account", createdAccount);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DatabaseOperationException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Database operation failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create account");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/account/updateAccount/{accountId}")
    public ResponseEntity<?> updateAccount(@PathVariable Long accountId, @RequestBody AccountDto accountDto){
        accountService.updateAccount(accountId, accountDto);
        return ResponseEntity.ok().build(); // Assuming successful update
    }

    @PutMapping("/account/updateStatus/{accountId}")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long accountId, @RequestBody Map<String, String> request){
        try {
            String status = request.get("status");
            if (status == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Status is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            accountService.updateAccountStatus(accountId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account status updated successfully");
            response.put("accountId", accountId);
            response.put("status", status);
            
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update account status");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/account/user/{userId}/accountDetails")
    public ResponseEntity<Map<String, Object>> getAllUserAccounts(@PathVariable Integer userId) {
        List<AccountDto> accountDto = accountService.getAllAccountsForUser(userId);
        Map<String, Object> response = new HashMap<>();
        if (accountDto.isEmpty()) {
            response.put("message", "No accounts found for the user.");
        }
        response.put("accounts", accountDto);
        return ResponseEntity.ok(response);
    }
    
    // Add the endpoint that frontend expects - /api/v1/accounts/user/{userId}
    @GetMapping("/accounts/user/{userId}")
    public ResponseEntity<List<AccountDto>> getUserAccounts(@PathVariable Integer userId) {
        try {
            List<AccountDto> accounts = accountService.getAllAccountsForUser(userId);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //Request Types - TransferFunds, Credit, Debit and delete
    @PostMapping("/account/{transactionType}/request")
    public ResponseEntity<String> transactionRequest(@RequestBody TransactionDto transactionDto) {
        try {
            requestService.createTransactionRequest(transactionDto);
            return ResponseEntity.ok(String.format("%s request created successfully", transactionDto.getTransactionType()));
        } catch (Exception e) {
            System.err.println("Error creating transaction request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create transaction request: " + e.getMessage());
        }
    }

    // Get all accounts for admin dashboard
    @GetMapping("/accounts")
    public ResponseEntity<Map<String, Object>> getAllAccounts() {
        try {
            List<AccountDto> allAccounts = accountService.getAllAccounts();
            Map<String, Object> response = new HashMap<>();
            response.put("accounts", allAccounts);
            response.put("totalCount", allAccounts.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve accounts");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
