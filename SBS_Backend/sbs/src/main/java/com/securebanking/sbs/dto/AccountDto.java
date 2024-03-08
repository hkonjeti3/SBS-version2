package com.securebanking.sbs.dto;

import com.securebanking.sbs.model.User;

import java.math.BigDecimal;

public class AccountDto {
    private Long accountId;
//    private Integer user;
    private Integer userId;
    private String accountNumber;
    private String accountType;
    private String balance;
    private String status;

    // Constructors, Getters, and Setters

    public AccountDto() {}

    // Getters and setters here
    // ...

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
