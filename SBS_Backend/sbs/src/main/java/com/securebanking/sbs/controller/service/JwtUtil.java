package com.securebanking.sbs.controller.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private int expirationTime;

    public String generateToken(String username, Integer userId, String email, Integer role) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("email", email)
                .claim("role",role)
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token, String username, Integer roleId, String email) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token)  && email.equals(extractEmail(token)) && roleId.equals(extractRoleId(token)));
    }
    public Integer extractRoleId(String token) {
        return (Integer) extractClaims(token).get("role");
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    public Integer extractUserId(String token) {
        return (Integer) extractClaims(token).get("userId");
    }

    public String extractEmail(String token) {
        return (String) extractClaims(token).get("email");
    }
}