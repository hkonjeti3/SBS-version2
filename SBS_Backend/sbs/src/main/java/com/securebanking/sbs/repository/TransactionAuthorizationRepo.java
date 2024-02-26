package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.TransactionAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionAuthorizationRepo extends JpaRepository<TransactionAuthorization, Long> {

}
