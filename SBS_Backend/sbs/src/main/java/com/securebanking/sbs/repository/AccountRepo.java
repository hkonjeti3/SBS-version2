package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepo extends JpaRepository<Account, Long> {
}
