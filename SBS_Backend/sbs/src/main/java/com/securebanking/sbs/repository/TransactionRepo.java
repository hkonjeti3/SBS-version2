package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {
}
