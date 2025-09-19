# BoycottPro React Native UI

## Development Environment Setup

### Starting the Application
To start the application for a specific environment:
```bash
npm run start:dev    # Development environment
npm run start:qa     # QA environment
npm run start:ps     # Pre-production environment
npm run start:prod   # Production environment
```

### Running on Devices
```bash
# Android
npm run android:dev    # Development
npm run android:qa     # QA
npm run android:ps     # Pre-production
npm run android:prod   # Production

# iOS
npm run ios:dev        # Development
npm run ios:qa         # QA
npm run ios:ps         # Pre-production
npm run ios:prod       # Production
```

## Testing

### Basic Testing Commands
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:coverage-ci   # Run coverage for CI/CD (no watch)
```

### Environment-Specific Testing
```bash
# Run tests against specific environments
npm run test:dev           # Test against development environment
npm run test:qa            # Test against QA environment
npm run test:ps            # Test against pre-production environment
npm run test:prod          # Test against production environment
```

### Environment-Specific Coverage Reports
```bash
# Generate coverage reports for specific environments
npm run test:coverage:dev  # Coverage report for dev environment
npm run test:coverage:qa   # Coverage report for QA environment
npm run test:coverage:ps   # Coverage report for PS environment
npm run test:coverage:prod # Coverage report for prod environment
```

### Code Quality Analysis
```bash
npm run sonar              # Run SonarQube analysis
```

## Testing Framework Details

- **Framework**: Jest 29.7.0 with React Native preset
- **TypeScript**: Full support for .ts and .tsx files
- **Coverage**: 90% thresholds enforced (branches, functions, lines, statements)
- **Reports**: HTML, LCOV, JSON, and text formats generated
- **Environment Testing**: Automatic .env file switching per environment

### Coverage Reports Location
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info` (for SonarQube)
- **JSON Report**: `coverage/coverage-final.json`

### Test File Patterns
- `**/__tests__/**/*.(ts|tsx|js)`
- `**/*.(test|spec).(ts|tsx|js)`

## Project Notes

I got the loading JSON animation from:
https://lottiefiles.com/search?q=loading
but then search for free --> loading
then download simply the lottie JSON