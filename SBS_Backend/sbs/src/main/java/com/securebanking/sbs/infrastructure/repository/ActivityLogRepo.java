package com.securebanking.sbs.infrastructure.repository;

import com.securebanking.sbs.infrastructure.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepo extends JpaRepository<ActivityLog, Integer> {
    
    @Query("SELECT a FROM ActivityLog a WHERE a.userId = :userId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByUserIdOrderByTimestampDesc(@Param("userId") Integer userId);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.userId = :userId ORDER BY a.timestamp DESC LIMIT :limit")
    List<ActivityLog> findRecentByUserIdOrderByTimestampDesc(@Param("userId") Integer userId, @Param("limit") int limit);
    
    @Query("SELECT a FROM ActivityLog a ORDER BY a.timestamp DESC LIMIT :limit")
    List<ActivityLog> findRecentOrderByTimestampDesc(@Param("limit") int limit);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.action = :action AND a.userId = :userId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByActionAndUserIdOrderByTimestampDesc(@Param("action") String action, @Param("userId") Integer userId);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.userId = :userId AND a.timestamp > :timestamp ORDER BY a.timestamp DESC")
    List<ActivityLog> findByUserIdAndTimestampAfterOrderByTimestampDesc(@Param("userId") Integer userId, @Param("timestamp") LocalDateTime timestamp);
} 