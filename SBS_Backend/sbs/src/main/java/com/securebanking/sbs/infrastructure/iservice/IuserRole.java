package com.securebanking.sbs.infrastructure.iservice;

import com.securebanking.sbs.shared.dto.UserRoleDto;

public interface IuserRole {
    public UserRoleDto addNewUserRole(UserRoleDto userRoleDto);
}
