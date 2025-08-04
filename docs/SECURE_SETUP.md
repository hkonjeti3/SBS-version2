# 🔒 Secure Setup Guide

## **Overview**
This guide shows you how to set up the Secure Banking System with proper password security and environment variable management.

## **🚀 Quick Setup (Recommended)**

### **Step 1: Create Environment File**
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your actual values
nano .env
# or
code .env
```

### **Step 2: Configure Your .env File**
Edit the `.env` file with your actual values:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secureBanking
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password_here

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8081

# Email Configuration (if using Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRATION=86400000
```

### **Step 3: Setup Database**
```bash
# Run the secure database setup
./setup-database.sh
```

### **Step 4: Start the Application**
```bash
# Start the complete system
./quick-start.sh
```

## **🔐 Security Features**

### **✅ What's Protected:**
- **Database Passwords**: Stored in `.env` file (gitignored)
- **Email Credentials**: Environment variables
- **JWT Secrets**: Secure environment variables
- **API Keys**: All sensitive data in `.env`

### **✅ What's Gitignored:**
- `.env` files (contains actual passwords)
- `*.log` files (may contain sensitive data)
- `node_modules/` (large dependency files)
- `target/` (build artifacts)
- IDE files (`.vscode/`, `.idea/`)

## **🛡️ Security Best Practices**

### **1. Password Management:**
- ✅ Never commit passwords to git
- ✅ Use environment variables
- ✅ Use strong, unique passwords
- ✅ Rotate passwords regularly

### **2. Environment Variables:**
- ✅ `.env` file is gitignored
- ✅ `env.example` shows structure without real values
- ✅ All sensitive data uses environment variables

### **3. Database Security:**
- ✅ PostgreSQL password stored securely
- ✅ Connection uses environment variables
- ✅ No hardcoded credentials

## **🔧 Troubleshooting**

### **If you get "Permission denied":**
```bash
chmod +x setup-database.sh quick-start.sh
```

### **If .env file is missing:**
```bash
cp env.example .env
# Then edit .env with your values
```

### **If database connection fails:**
1. Check if PostgreSQL is running
2. Verify your password in `.env`
3. Test connection: `./setup-database.sh test-connection`

### **If you forget your password:**
1. Reset PostgreSQL password
2. Update `.env` file
3. Run `./setup-database.sh` again

## **📋 Environment Variables Reference**

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | secureBanking |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | (required) |
| `SERVER_PORT` | Application port | 8081 |
| `MAIL_HOST` | Email server | smtp.gmail.com |
| `MAIL_USERNAME` | Email username | (required) |
| `MAIL_PASSWORD` | Email password | (required) |
| `JWT_SECRET` | JWT signing key | (required) |

## **🚨 Security Warnings**

### **❌ Never Do:**
- Commit `.env` files to git
- Share passwords in chat/email
- Use weak passwords
- Store passwords in code

### **✅ Always Do:**
- Use strong, unique passwords
- Keep `.env` file secure
- Rotate credentials regularly
- Use environment variables

## **🔍 Verification**

### **Check if setup is secure:**
```bash
# Check if .env is gitignored
git status

# Should NOT show .env file
# Should show .gitignore includes .env
```

### **Test database connection:**
```bash
./setup-database.sh test-connection
```

### **Verify application starts:**
```bash
./quick-start.sh
```

## **🎉 Success!**

Once you've completed this setup:
- ✅ Your passwords are secure
- ✅ No credentials in git
- ✅ Environment variables working
- ✅ Database connection secure
- ✅ Application ready for 100+ users

Your Secure Banking System is now properly configured with enterprise-grade security! 🔒 