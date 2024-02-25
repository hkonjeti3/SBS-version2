package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
}
