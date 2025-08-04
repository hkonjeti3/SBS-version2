package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.modules.internal_user.model.ProfileUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileUpdateRequestRepo extends JpaRepository<ProfileUpdateRequest, Integer> {
    
    // Find all requests for a specific user
    List<ProfileUpdateRequest> findByUserIdOrderByTimestampDesc(Integer userId);
    
    // Find all pending requests
    List<ProfileUpdateRequest> findByStatusOrderByTimestampDesc(String status);
    
    // Find all requests for a specific user with a specific status
    List<ProfileUpdateRequest> findByUserIdAndStatusOrderByTimestampDesc(Integer userId, String status);
    
    // Count pending requests
    long countByStatus(String status);
    
    // Find requests by user ID and request type
    List<ProfileUpdateRequest> findByUserIdAndRequestTypeOrderByTimestampDesc(Integer userId, String requestType);
    
    // Custom query to get requests with user information
    @Query("SELECT p FROM ProfileUpdateRequest p WHERE p.status = :status ORDER BY p.timestamp DESC")
    List<ProfileUpdateRequest> findPendingRequestsWithUserInfo(@Param("status") String status);
} 