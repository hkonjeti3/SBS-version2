package com.securebanking.sbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class SbsApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(SbsApplication.class, args);
		
		// Debug: Print database connection details
		System.out.println("=== DATABASE CONNECTION DEBUG ===");
		System.out.println("SPRING_DATASOURCE_URL: " + System.getenv("SPRING_DATASOURCE_URL"));
		System.out.println("SPRING_DATASOURCE_USERNAME: " + System.getenv("SPRING_DATASOURCE_USERNAME"));
		System.out.println("SPRING_DATASOURCE_PASSWORD: " + (System.getenv("SPRING_DATASOURCE_PASSWORD") != null ? "***SET***" : "NULL"));
		System.out.println("SPRING_PROFILES_ACTIVE: " + System.getenv("SPRING_PROFILES_ACTIVE"));
		System.out.println("=================================");
	}
	
	@EventListener(ApplicationReadyEvent.class)
	public void printEnvironmentVariables() {
		System.out.println("=== ALL ENVIRONMENT VARIABLES ===");
		System.getenv().forEach((key, value) -> {
			if (key.contains("DATASOURCE") || key.contains("SPRING") || key.contains("DB") || key.contains("POSTGRES")) {
				System.out.println(key + ": " + (key.contains("PASSWORD") ? "***MASKED***" : value));
			}
		});
		System.out.println("=================================");
	}
}
