package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.modules.customer.model.Account;
import com.securebanking.sbs.modules.customer.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Integer> {

    @Query("SELECT t FROM Transaction t WHERE t.senderAcc = :account AND t.status = :status")
    List<Transaction> findByAccountAndStatus(@Param("account") Account account, @Param("status") String status);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status ORDER BY t.createdtime DESC")
    List<Transaction> findByStatusOrderByCreatedtimeDesc(@Param("status") String status);
}
