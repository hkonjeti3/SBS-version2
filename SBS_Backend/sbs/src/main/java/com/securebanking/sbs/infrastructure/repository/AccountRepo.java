package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.modules.customer.model.Account;
import com.securebanking.sbs.shared.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepo extends JpaRepository<Account, Long> {

    @Query("SELECT a FROM Account a WHERE a.user.userId = :userId")
    List<Account> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Account findbyaccountnumber(@Param("accountNumber") String accountNumber);
}
