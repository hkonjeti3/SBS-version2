package com.securebanking.sbs.util;

import com.securebanking.sbs.controller.service.JwtUtil;
import com.securebanking.sbs.model.User;
import com.securebanking.sbs.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;


@Component
public class JwtTokenInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    public JwtTokenInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            if (handlerMethod.getMethod().isAnnotationPresent(JwtTokenRequired.class)) {
                // Check for JWT token and validate it
                String token = request.getHeader("Authorization");

                if (token == null || !token.startsWith("Bearer ")) {
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "JWT token is missing or invalid");
                    return false;
                }

                token = token.substring(7); // Remove "Bearer " prefix

                // Validate the token
                Integer id = jwtUtil.extractUserId(token);
                Optional<User> userOptional = userRepo.findById(id);
                if (userOptional.isEmpty()) {
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "User not found");
                    return false;
                }

                User user = userOptional.get();
                String username = jwtUtil.extractUsername(token);
                if (!jwtUtil.validateToken(token, user.getUsername(), user.getRole().getRoleId(), user.getEmailAddress())) {
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "JWT token is invalid");
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}


