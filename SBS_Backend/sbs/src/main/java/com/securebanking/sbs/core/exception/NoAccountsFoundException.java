package com.securebanking.sbs.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoAccountsFoundException extends RuntimeException {
    public NoAccountsFoundException(String message) {
        super(message);
    }
}
