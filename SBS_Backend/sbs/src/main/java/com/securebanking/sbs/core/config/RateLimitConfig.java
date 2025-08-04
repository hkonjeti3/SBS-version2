package com.securebanking.sbs.core.config;

/*
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.LettuceProxyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;

@Configuration
public class RateLimitConfig {
    
    @Autowired
    private RedisConnectionFactory redisConnectionFactory;
    
    @Bean
    public ProxyManager<String> proxyManager() {
        return LettuceProxyManager.builderFor(redisConnectionFactory).build();
    }
    
    @Bean
    public BucketConfiguration bucketConfiguration() {
        // Rate limit: 100 requests per minute per user
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return BucketConfiguration.builder().addLimit(limit).build();
    }
    
    @Bean
    public Bucket bucket(ProxyManager<String> proxyManager, BucketConfiguration configuration) {
        return proxyManager.builder().build("default-bucket", () -> configuration);
    }
}
*/

// Rate limiting temporarily disabled for Kafka focus
public class RateLimitConfig {
    // Placeholder class
} 