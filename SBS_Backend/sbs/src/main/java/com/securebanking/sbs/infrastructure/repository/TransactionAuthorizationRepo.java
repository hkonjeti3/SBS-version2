package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.modules.customer.model.TransactionAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionAuthorizationRepo extends JpaRepository<TransactionAuthorization, Integer> {
    
    @Query("SELECT ta FROM TransactionAuthorization ta WHERE ta.transaction.transactionId = :transactionId")
    Optional<TransactionAuthorization> findByTransactionTransactionId(@Param("transactionId") Integer transactionId);
}
