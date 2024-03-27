package com.securebanking.sbs.util;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface JwtTokenRequired {
}
