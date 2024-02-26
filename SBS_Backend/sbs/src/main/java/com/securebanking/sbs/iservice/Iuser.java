package com.securebanking.sbs.iservice;

import com.securebanking.sbs.dto.UserDto;

public interface Iuser {

    Void createOrUpdateUser(UserDto userDto);
}
