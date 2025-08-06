# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml from the sbs directory
COPY SBS_Backend/sbs/mvnw .
COPY SBS_Backend/sbs/pom.xml .
COPY SBS_Backend/sbs/.mvn ./.mvn

# Copy the source code
COPY SBS_Backend/sbs/src ./src

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Create a non-root user
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser

# Change ownership of the app directory
RUN chown -R javauser:javauser /app

# Switch to non-root user
USER javauser

# Expose port
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "target/sbs-0.0.1-SNAPSHOT.jar"] 