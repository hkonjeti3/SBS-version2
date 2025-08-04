package com.securebanking.sbs.infrastructure.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    // Fallback to in-memory storage if Redis is not available
    private static final ConcurrentHashMap<String, OtpData> inMemoryOtpStore = new ConcurrentHashMap<>();
    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    public void storeOtp(String email, String otp) {
        System.out.println("Storing OTP for email: " + email + ", OTP: " + otp);
        
        try {
            if (redisTemplate != null) {
                // Use Redis if available
                String key = OTP_PREFIX + email;
                redisTemplate.opsForValue().set(key, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
                System.out.println("OTP stored in Redis for email: " + email + ", key: " + key);
            } else {
                // Fallback to in-memory storage
                inMemoryOtpStore.put(email, new OtpData(otp, System.currentTimeMillis()));
                System.out.println("OTP stored in memory for email: " + email);
            }
        } catch (Exception e) {
            // Fallback to in-memory storage on Redis error
            System.out.println("Redis unavailable, using in-memory storage: " + e.getMessage());
            inMemoryOtpStore.put(email, new OtpData(otp, System.currentTimeMillis()));
        }
    }

    public String getOtp(String email) {
        try {
            if (redisTemplate != null) {
                String key = OTP_PREFIX + email;
                return redisTemplate.opsForValue().get(key);
            } else {
                OtpData otpData = inMemoryOtpStore.get(email);
                if (otpData != null && !isExpired(otpData)) {
                    return otpData.getOtp();
                }
                return null;
            }
        } catch (Exception e) {
            logger.warn("Redis error, checking in-memory storage: {}", e.getMessage());
            OtpData otpData = inMemoryOtpStore.get(email);
            if (otpData != null && !isExpired(otpData)) {
                return otpData.getOtp();
            }
            return null;
        }
    }

    public boolean validateAndRemoveOtp(String email, String otp) {
        System.out.println("Validating OTP for email: " + email + ", provided OTP: " + otp);
        
        try {
            if (redisTemplate != null) {
                String key = OTP_PREFIX + email;
                String storedOtp = redisTemplate.opsForValue().get(key);
                System.out.println("Redis OTP lookup - Key: " + key + ", Stored OTP: " + storedOtp);
                
                if (storedOtp != null && storedOtp.equals(otp)) {
                    redisTemplate.delete(key);
                    System.out.println("OTP validated and removed from Redis for email: " + email);
                    return true;
                }
                System.out.println("OTP validation failed - stored OTP: " + storedOtp + ", provided OTP: " + otp);
                return false;
            } else {
                OtpData otpData = inMemoryOtpStore.get(email);
                System.out.println("Memory OTP lookup - Email: " + email + ", Stored OTP: " + (otpData != null ? otpData.getOtp() : "null"));
                
                if (otpData != null && !isExpired(otpData) && otpData.getOtp().equals(otp)) {
                    inMemoryOtpStore.remove(email);
                    System.out.println("OTP validated and removed from memory for email: " + email);
                    return true;
                }
                System.out.println("OTP validation failed - stored OTP: " + (otpData != null ? otpData.getOtp() : "null") + ", provided OTP: " + otp);
                return false;
            }
        } catch (Exception e) {
            System.out.println("Redis error, validating from in-memory storage: " + e.getMessage());
            OtpData otpData = inMemoryOtpStore.get(email);
            if (otpData != null && !isExpired(otpData) && otpData.getOtp().equals(otp)) {
                inMemoryOtpStore.remove(email);
                return true;
            }
            return false;
        }
    }

    public void removeOtp(String email) {
        try {
            if (redisTemplate != null) {
                String key = OTP_PREFIX + email;
                redisTemplate.delete(key);
            } else {
                inMemoryOtpStore.remove(email);
            }
        } catch (Exception e) {
            logger.warn("Redis error, removing from in-memory storage: {}", e.getMessage());
            inMemoryOtpStore.remove(email);
        }
    }

    private boolean isExpired(OtpData otpData) {
        long currentTime = System.currentTimeMillis();
        long expiryTime = otpData.getTimestamp() + (OTP_EXPIRY_MINUTES * 60 * 1000);
        return currentTime > expiryTime;
    }

    // Clean up expired OTPs periodically
    public void cleanupExpiredOtps() {
        inMemoryOtpStore.entrySet().removeIf(entry -> isExpired(entry.getValue()));
    }

    private static class OtpData {
        private final String otp;
        private final long timestamp;

        public OtpData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() { return otp; }
        public long getTimestamp() { return timestamp; }
    }
} 