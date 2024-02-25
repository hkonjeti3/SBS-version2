package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecurityLogRepo extends JpaRepository<SecurityLog, Long> {
}
