package com.securebanking.sbs.iservice;

import com.securebanking.sbs.dto.UserDto;
import org.springframework.http.HttpStatus;

public interface Iuser {

    HttpStatus createOrUpdateUser(UserDto userDto);
//    Void createOrUpdateUser(UserDto userDto);
}
