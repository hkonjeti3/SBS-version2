package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.shared.model.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityLogRepo extends JpaRepository<SecurityLog, Long> {
}
