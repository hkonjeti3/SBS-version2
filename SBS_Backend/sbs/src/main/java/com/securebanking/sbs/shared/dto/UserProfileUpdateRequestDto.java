package com.securebanking.sbs.shared.dto;

import com.securebanking.sbs.shared.enums.ApprovalStatus;
import com.securebanking.sbs.shared.enums.RequestStatus;
import com.securebanking.sbs.shared.model.User;

import java.time.LocalDateTime;

public class UserProfileUpdateRequestDto {
    private Integer id;
    private User user;
    private String updateData;
    private RequestStatus status;
    private User approver;
    private ApprovalStatus approvalStatus;
    private LocalDateTime requestDate;
    private LocalDateTime approvalDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUpdateData() {
        return updateData;
    }

    public void setUpdateData(String updateData) {
        this.updateData = updateData;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public User getApprover() {
        return approver;
    }

    public void setApprover(User approver) {
        this.approver = approver;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }
}
