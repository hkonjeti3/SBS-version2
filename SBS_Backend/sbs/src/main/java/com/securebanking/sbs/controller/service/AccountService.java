package com.securebanking.sbs.controller.service;

import com.securebanking.sbs.dto.AccountDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.enums.ApprovalStatus;
import com.securebanking.sbs.exception.DatabaseOperationException;
import com.securebanking.sbs.exception.NoAccountsFoundException;
import com.securebanking.sbs.exception.ResourceNotFoundException;
import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.repository.AccountRepo;
import com.securebanking.sbs.repository.TransactionRepo;
import com.securebanking.sbs.repository.UserRepo;
import com.securebanking.sbs.repository.UserRoleRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private AccountDto accountDto;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TransactionRepo transactionRepo;

    public void createAccount(AccountDto accountDto) {
        User user = userRepo.findById(accountDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + accountDto.getUserId()));

        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setAccountType(accountDto.getAccountType());
        account.setBalance(accountDto.getBalance());
        account.setStatus(accountDto.getStatus());
        account.setUser(user);

        try {
            accountRepo.save(account);
        } catch (DataAccessException e) {
            throw new DatabaseOperationException("Error occurred while saving the account", e);
        }
    }

    private String generateUniqueAccountNumber() {
        // Example strategy: Current time in milliseconds + a random 4-digit number
        return String.valueOf(System.currentTimeMillis()) + (int)(Math.random() * 10000);
    }
    public void updateAccount(Long accountId, AccountDto accountDto) {
        // Fetch the existing account
        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));

        // Update the account details
        updateAccountDetails(account, accountDto);
        // Save the updated account
        accountRepo.save(account);
    }
    public List<AccountDto> getAllAccountsForUser(Integer userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Account> accounts = accountRepo.findByUserId(userId);
        if (accounts.isEmpty()) {
            throw new NoAccountsFoundException("No accounts found for user with id: " + userId);
        }

        List<AccountDto> accountDto = new ArrayList<>();
        accounts.forEach(account -> {
            AccountDto dto = convertToAccountDto(account);
            accountDto.add(dto);
        });

        return accountDto;
    }

//    public void requestTransfer(Long fromAccountId, Long toAccountId, String transactionType, String amount) {
//        Transaction transaction = new Transaction();
//        transaction.setSenderAcc(accountRepo.findById(fromAccountId)
//                .orElseThrow(() -> new ResourceNotFoundException("From Account not found with id " + fromAccountId)));
//        transaction.setReceiverAcc(accountRepo.findById(toAccountId)
//                .orElseThrow(() -> new ResourceNotFoundException("To Account not found with id " + toAccountId)));
//        transaction.setAmount(amount);
//        transaction.setStatus("Pending");
//
//        transactionRepo.save(transaction);
//    }


    public void transferFunds(Transaction transaction) {
        BigDecimal amount = new BigDecimal(transaction.getAmount());

        Account senderAccount = transaction.getSenderAcc();
        Account receiverAccount = transaction.getReceiverAcc();

        BigDecimal senderBalance = new BigDecimal(senderAccount.getBalance());
        if (senderBalance.compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds in the sender account");
        }

        BigDecimal newSenderBalance = senderBalance.subtract(amount);
        BigDecimal newReceiverBalance = new BigDecimal(receiverAccount.getBalance()).add(amount);

        senderAccount.setBalance(newSenderBalance.toString());
        receiverAccount.setBalance(newReceiverBalance.toString());
        accountRepo.save(senderAccount);
        accountRepo.save(receiverAccount);
        transaction.setStatus(ApprovalStatus.COMPLETED.toString()); // use the appropriate status
        transactionRepo.save(transaction);
    }

    @Transactional
    public void executeTransaction(Transaction transaction) {
        Account senderAccount = transaction.getSenderAcc();
        Account receiverAccount = transaction.getReceiverAcc();
        BigDecimal amount = new BigDecimal(transaction.getAmount());

        // Ensure there are sufficient funds
        BigDecimal senderBalance = new BigDecimal(senderAccount.getBalance());
        if (senderBalance.compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Debit from sender
        BigDecimal newSenderBalance = senderBalance.subtract(amount);
        senderAccount.setBalance(newSenderBalance.toPlainString());
        accountRepo.save(senderAccount);

        // Credit to receiver
        BigDecimal receiverBalance = new BigDecimal(receiverAccount.getBalance());
        BigDecimal newReceiverBalance = receiverBalance.add(amount);
        receiverAccount.setBalance(newReceiverBalance.toPlainString());
        accountRepo.save(receiverAccount);

        // Update transaction status
        transaction.setStatus(ApprovalStatus.COMPLETED.toString());
        transactionRepo.save(transaction);
    }

    @Transactional
    public void delete(Transaction transaction) {
        Account accountToDelete = transaction.getSenderAcc(); // Assuming the account to delete is the sender

        // Check if the account has a zero balance before proceeding
        BigDecimal balance = new BigDecimal(accountToDelete.getBalance());
        if (balance.compareTo(BigDecimal.ZERO) != 0) {
            throw new RuntimeException("Account balance must be zero to delete");
        }
        // Optionally, check for no pending transactions
        // This part depends on how you track transactions in your system
//        boolean hasPendingTransactions = transactionRepo.findByAccountAndStatus(
//                accountToDelete, "PENDING").stream().findAny().isPresent();
//        if (hasPendingTransactions) {
//            throw new RuntimeException("Account has pending transactions and cannot be deleted");
//        }
        // Proceed with account deletion
        accountRepo.delete(accountToDelete);

        // Optionally, update the transaction to reflect the account deletion
        transaction.setStatus(ApprovalStatus.DELETED.toString());
        transactionRepo.save(transaction);
    }

//    @Transactional
//    public void credit(Transaction transaction) {
//        Account receiverAccount = transaction.getReceiverAcc();
//        BigDecimal amount = new BigDecimal(transaction.getAmount());
//
//        // Calculate new balance
//        BigDecimal newReceiverBalance = new BigDecimal(receiverAccount.getBalance()).add(amount);
//
//        // Convert the BigDecimal balance back to String and update the account
//        receiverAccount.setBalance(newReceiverBalance.toPlainString());
//
//        // Save the updated account
//        accountRepo.save(receiverAccount);
//
//        // Optionally, update transaction status or perform additional actions
//        transaction.setStatus(ApprovalStatus.COMPLETED.toString());
//        transactionRepo.save(transaction);
//    }
//
//    @Transactional
//    public void debit(Transaction transaction) {
//        Account senderAccount = transaction.getSenderAcc();
//        BigDecimal amount = new BigDecimal(transaction.getAmount());
//
//        // Ensure there are sufficient funds
//        BigDecimal senderBalance = new BigDecimal(senderAccount.getBalance());
//        if (senderBalance.compareTo(amount) < 0) {
//            throw new RuntimeException("Insufficient funds");
//        }
//        // Calculate new balance
//        BigDecimal newSenderBalance = senderBalance.subtract(amount);
//
//        // Convert the BigDecimal balance back to String and update the account
//        senderAccount.setBalance(newSenderBalance.toPlainString());
//
//        // Save the updated account
//        accountRepo.save(senderAccount);
//
//        // Optionally, update transaction status or perform additional actions
//        transaction.setStatus(ApprovalStatus.COMPLETED.toString());
//        transactionRepo.save(transaction);
//    }

    public AccountDto convertToAccountDto(Account account) {
        AccountDto dto = new AccountDto();
        dto.setAccountId(account.getAccountId());
        dto.setUserId(account.getUser().getId()); // This assumes a getter exists in the User class
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setStatus(account.getStatus());
        return dto;
    }

    private void updateAccountDetails(Account account, AccountDto accountDto){
        account.setAccountType(accountDto.getAccountType());
        account.setBalance(accountDto.getBalance());
        account.setStatus(accountDto.getStatus());
    }
}
