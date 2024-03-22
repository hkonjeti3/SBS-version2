package com.securebanking.sbs.repository;

import com.securebanking.sbs.enums.RequestStatus;
import com.securebanking.sbs.model.UserProfileUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileUpdateRequestRepo extends JpaRepository<UserProfileUpdateRequest, Integer> {

    @Query("SELECT r FROM UserProfileUpdateRequest r WHERE r.approvalStatus = :status")
    List<UserProfileUpdateRequest> findByStatus(@Param("status") String status);
}

