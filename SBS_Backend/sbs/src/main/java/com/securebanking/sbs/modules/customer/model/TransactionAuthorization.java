package com.securebanking.sbs.modules.customer.model;

import com.securebanking.sbs.shared.enums.ApprovalStatus;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import com.securebanking.sbs.shared.model.User;

@Entity
@Table(name = "transaction_authorizations")
public class TransactionAuthorization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authorizationId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "transactionId")
    private Transaction transaction;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "authorizedByUserID", referencedColumnName = "userId")
    private User user;

    @Column(nullable = false)
    private String status;

    @CreatedDate
    @Column(name = "created_time")
    private LocalDateTime createdtime;

    @LastModifiedDate
    @Column(name = "last_modified_time")
    private LocalDateTime lastModifiedtime;

    @Column(nullable = true)
    private String denialReason;


    public Long getAuthorizationId() {
        return authorizationId;
    }

    public void setAuthorizationId(Long authorizationId) {
        this.authorizationId = authorizationId;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedtime() {
        return createdtime;
    }

    public void setCreatedtime(LocalDateTime createdtime) {
        this.createdtime = createdtime;
    }

    public LocalDateTime getLastModifiedtime() {
        return lastModifiedtime;
    }

    public void setLastModifiedtime(LocalDateTime lastModifiedtime) {
        this.lastModifiedtime = lastModifiedtime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDenialReason() {
        return denialReason;
    }

    public void setDenialReason(String denialReason) {
        this.denialReason = denialReason;
    }
}