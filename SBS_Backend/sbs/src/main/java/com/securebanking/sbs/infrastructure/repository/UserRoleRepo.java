package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.shared.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole, Integer> {
}
