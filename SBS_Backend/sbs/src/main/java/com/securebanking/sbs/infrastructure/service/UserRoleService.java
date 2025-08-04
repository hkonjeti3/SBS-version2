package com.securebanking.sbs.infrastructure.service;

import com.securebanking.sbs.shared.dto.UserRoleDto;
import com.securebanking.sbs.infrastructure.iservice.IuserRole;
import com.securebanking.sbs.shared.model.UserRole;
import com.securebanking.sbs.infrastructure.repository.UserRoleRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserRoleService implements IuserRole {

    @Autowired
    private UserRoleRepo userRoleRepo;

    public UserRoleDto addNewUserRole(UserRoleDto userRoleDto) {
        UserRole userRole = new UserRole();

//        userRole.setRoleId(userRoleDto.getRoleId());
        userRole.setRoleName(userRoleDto.getRoleName());

        userRole=userRoleRepo.save(userRole);
        BeanUtils.copyProperties(userRole,userRoleDto);

        return userRoleDto;
    }


    public List<UserRoleDto> getUserRoles() {
        Iterable<UserRole> allUserRoles = userRoleRepo.findAll();
        List<UserRoleDto> userRoleDtoList = new ArrayList<>();
        allUserRoles.forEach(customer -> {
            UserRoleDto cust = new UserRoleDto();
            cust.setRoleId(customer.getRoleId());
            cust.setRoleName(customer.getRoleName());
            userRoleDtoList.add(cust);
        });
        return userRoleDtoList;
    }
}
