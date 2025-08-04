package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.modules.internal_user.model.AccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRequestRepo extends JpaRepository<AccountRequest, Integer> {
    
    // Find all requests for a specific user
    List<AccountRequest> findByUserIdOrderByTimestampDesc(Integer userId);
    
    // Find all pending requests
    List<AccountRequest> findByStatusOrderByTimestampDesc(String status);
    
    // Find all requests for a specific user with a specific status
    List<AccountRequest> findByUserIdAndStatusOrderByTimestampDesc(Integer userId, String status);
    
    // Count pending requests
    long countByStatus(String status);
    
    // Find requests by user ID and account type
    List<AccountRequest> findByUserIdAndAccountTypeOrderByTimestampDesc(Integer userId, String accountType);
} 