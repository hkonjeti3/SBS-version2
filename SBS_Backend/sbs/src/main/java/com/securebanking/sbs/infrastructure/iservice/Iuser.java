package com.securebanking.sbs.infrastructure.iservice;

import com.securebanking.sbs.shared.dto.UserDto;
import org.springframework.http.HttpStatus;

public interface Iuser {

    HttpStatus createOrUpdateUser(UserDto userDto);

    UserDto getUserById(Integer id);
//    Void createOrUpdateUser(UserDto userDto);
}
