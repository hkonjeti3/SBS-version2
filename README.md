# Secure Banking System (SBS)

A comprehensive banking system with role-based access control, transaction management, and approval workflows.

## Project Structure

```
SystemProtocol_SBS/
├── SBS_Backend/          # Spring Boot backend application
├── SBS_Frontend/         # Angular frontend application
├── tests/                # Organized test files
│   ├── api/             # API endpoint tests
│   ├── integration/     # Database and integration tests
│   ├── load/           # Load testing scripts
│   └── scripts/        # Shell test scripts
├── docs/               # Documentation files
└── scripts/            # Setup and utility scripts
```

## Quick Start

1. **Setup Database**: `./scripts/setup-database.sh`
2. **Start Backend**: `cd SBS_Backend && ./mvnw spring-boot:run`
3. **Start Frontend**: `cd SBS_Frontend && ng serve`
4. **Access Application**: `http://localhost:4200`

## Features

- **Multi-Role System**: Admin, Internal User, Customer roles
- **Account Management**: Create, activate, deactivate accounts
- **Transaction Processing**: Transfer funds, credit, debit operations
- **Approval Workflows**: Account and profile approval system
- **Activity Logging**: Comprehensive activity tracking
- **Notification System**: Real-time notifications via email and in-app notifications
- **Security**: JWT authentication, OTP validation

## Testing

See `tests/README.md` for detailed testing information and organized test files.

## Documentation

- `docs/SETUP_GUIDE.md` - Detailed setup instructions
- `docs/SECURE_SETUP.md` - Security configuration guide
- `docs/SCALABILITY_ANALYSIS.md` - Performance analysis 