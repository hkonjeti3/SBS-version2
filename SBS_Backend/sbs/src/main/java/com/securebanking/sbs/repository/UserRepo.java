package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
