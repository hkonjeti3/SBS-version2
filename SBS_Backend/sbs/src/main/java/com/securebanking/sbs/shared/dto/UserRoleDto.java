package com.securebanking.sbs.shared.dto;

import com.securebanking.sbs.shared.model.User;


import java.util.Set;

public class UserRoleDto {
    private Integer roleId;

    private String roleName;

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
