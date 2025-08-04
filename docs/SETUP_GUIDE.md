# Secure Banking System - Setup Guide for 100+ Users

## 🎯 **How This Application Supports 100+ Simultaneous Users**

### **Architecture Overview:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular       │    │   Spring Boot   │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   (Port 4200)   │    │   (Port 8081)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Kafka       │    │     Redis       │
                       │   (Port 9092)   │    │   (Port 6379)   │
                       └─────────────────┘    └─────────────────┘
```

### **Scalability Features:**

1. **Database Connection Pooling**: 20 concurrent connections with HikariCP
2. **Server Thread Pool**: 100 concurrent requests with Tomcat
3. **Async Processing**: Kafka message queues for non-blocking operations
4. **Caching**: Redis for OTP storage and session management
5. **Load Balancing**: Ready for horizontal scaling
6. **Monitoring**: Actuator endpoints for health checks

## 🚀 **Step-by-Step Setup Guide**

### **Prerequisites:**
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Redis 6 or higher (optional)
- Kafka 3.0 or higher (optional)

### **1. Database Setup (PostgreSQL)**

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Ubuntu)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE secureBanking;
CREATE USER postgres WITH PASSWORD '24Saketh24!';
GRANT ALL PRIVILEGES ON DATABASE secureBanking TO postgres;
\q
```

### **2. Redis Setup (Optional - for distributed OTP storage)**

```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu)
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### **3. Kafka Setup (Optional - for async processing)**

```bash
# Install Kafka (macOS)
brew install kafka
brew services start zookeeper
brew services start kafka

# Install Kafka (Ubuntu)
wget https://downloads.apache.org/kafka/3.6.1/kafka_2.13-3.6.1.tgz
tar -xzf kafka_2.13-3.6.1.tgz
cd kafka_2.13-3.6.1

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties &

# Start Kafka
bin/kafka-server-start.sh config/server.properties &

# Create topics (optional - will be auto-created)
bin/kafka-topics.sh --create --topic login-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
bin/kafka-topics.sh --create --topic transaction-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
bin/kafka-topics.sh --create --topic email-notifications --bootstrap-server localhost:9092 --partitions 2 --replication-factor 1
bin/kafka-topics.sh --create --topic audit-logs --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

### **4. Backend Setup (Spring Boot)**

```bash
# Navigate to backend directory
cd SBS_Backend/sbs

# Clean and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or with JVM optimizations for production
java -Xms1g -Xmx2g -XX:+UseG1GC -jar target/sbs-0.0.1-SNAPSHOT.jar
```

**Backend will start on:** `http://localhost:8081`

**Health Check:** `http://localhost:8081/actuator/health`

### **5. Frontend Setup (Angular)**

```bash
# Navigate to frontend directory
cd SBS_Frontend

# Install dependencies
npm install

# Start development server
ng serve

# Or for production build
ng build --configuration production
ng serve --configuration production
```

**Frontend will start on:** `http://localhost:4200`

### **6. Verify Installation**

```bash
# Check all services are running
curl http://localhost:8081/actuator/health
curl http://localhost:4200
redis-cli ping
# Kafka topics (if installed)
kafka-topics.sh --list --bootstrap-server localhost:9092
```

## 📊 **Performance Testing**

### **Load Test Setup:**

```bash
# Install Node.js dependencies
npm install axios

# Run load test
node load-test.js
```

### **Expected Results with 100 Users:**
- **Success Rate**: > 95%
- **Response Time**: < 500ms average
- **Throughput**: 100+ requests/second
- **Error Rate**: < 1%

## 🔧 **Configuration Options**

### **Database Connection Pool (application.properties):**
```properties
# For 100 users
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# For 500 users
spring.datasource.hikari.maximum-pool-size=50
spring.datasource.hikari.minimum-idle=10

# For 1000+ users
spring.datasource.hikari.maximum-pool-size=100
spring.datasource.hikari.minimum-idle=20
```

### **Server Thread Pool:**
```properties
# For 100 users
server.tomcat.threads.max=100
server.tomcat.threads.min-spare=10

# For 500 users
server.tomcat.threads.max=200
server.tomcat.threads.min-spare=20

# For 1000+ users
server.tomcat.threads.max=400
server.tomcat.threads.min-spare=40
```

## 🚀 **Production Deployment**

### **Single Server Deployment:**
```bash
# Build backend
cd SBS_Backend/sbs
./mvnw clean package -DskipTests

# Run with production settings
java -Xms2g -Xmx4g -XX:+UseG1GC \
  -Dspring.profiles.active=prod \
  -jar target/sbs-0.0.1-SNAPSHOT.jar
```

### **Multi-Server Deployment (Docker):**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: secure-banking-system
    replicas: 3
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - REDIS_URL=redis://redis:6379
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    ports:
      - "8081:8081"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    ports:
      - "9092:9092"
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: secureBanking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 24Saketh24!
    ports:
      - "5432:5432"
```

### **Load Balancer (Nginx):**
```nginx
upstream backend {
    server app1:8081;
    server app2:8081;
    server app3:8081;
    least_conn;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 **Scaling Beyond 100 Users**

### **For 500+ Users:**
1. **Horizontal Scaling**: Deploy 3-5 application instances
2. **Database Read Replicas**: Separate read/write operations
3. **CDN**: Cache static assets
4. **Connection Pool**: Increase to 50-100 connections

### **For 1000+ Users:**
1. **Microservices**: Split into smaller services
2. **Database Sharding**: Distribute data across multiple databases
3. **Redis Cluster**: Distributed caching
4. **API Gateway**: Centralized routing and rate limiting

## 🔍 **Monitoring and Troubleshooting**

### **Health Checks:**
```bash
# Application health
curl http://localhost:8081/actuator/health

# Database connectivity
psql -h localhost -U postgres -d secureBanking -c "SELECT 1;"

# Redis connectivity
redis-cli ping

# Kafka connectivity
kafka-topics.sh --list --bootstrap-server localhost:9092
```

### **Logs:**
```bash
# Application logs
tail -f logs/application.log

# Database logs
tail -f /var/log/postgresql/postgresql-*.log

# Redis logs
tail -f /var/log/redis/redis-server.log

# Kafka logs
tail -f logs/server.log
```

### **Performance Monitoring:**
```bash
# JVM metrics
curl http://localhost:8081/actuator/metrics/jvm.memory.used

# Database connection pool
curl http://localhost:8081/actuator/metrics/hikaricp.connections

# HTTP requests
curl http://localhost:8081/actuator/metrics/http.server.requests
```

## ✅ **Verification Checklist**

- [ ] PostgreSQL running on port 5432
- [ ] Redis running on port 6379 (optional)
- [ ] Kafka running on port 9092 (optional)
- [ ] Backend running on port 8081
- [ ] Frontend running on port 4200
- [ ] Health check returns "UP"
- [ ] Load test passes with >95% success rate
- [ ] Response times < 500ms average

## 🎯 **Summary**

This application is designed to handle **100+ simultaneous users** through:

1. **Optimized Database Pooling**: Efficient connection management
2. **Async Processing**: Kafka message queues for non-blocking operations
3. **Caching Layer**: Redis for improved performance
4. **Thread Pool Optimization**: Tomcat configured for concurrent requests
5. **Monitoring**: Real-time health checks and metrics
6. **Scalable Architecture**: Ready for horizontal scaling

The system automatically adapts to available infrastructure (Redis/Kafka optional) and provides fallback mechanisms for reliability. 