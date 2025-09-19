# BoycottPro UI Testing Guide

## Environment-Specific Testing Setup

This React Native application supports comprehensive testing across multiple environments with >90% code coverage requirements.

### Available Test Commands

#### Standard Testing
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:coverage-ci   # Run coverage for CI/CD
```

#### Environment-Specific Testing
```bash
npm run test:dev           # Test against development environment
npm run test:qa            # Test against QA environment
npm run test:ps            # Test against pre-production environment
npm run test:prod          # Test against production environment
```

#### Environment-Specific Coverage
```bash
npm run test:coverage:dev  # Coverage report for dev environment
npm run test:coverage:qa   # Coverage report for QA environment
npm run test:coverage:ps   # Coverage report for PS environment
npm run test:coverage:prod # Coverage report for prod environment
```

### Environment Configuration

Each environment test automatically loads the corresponding `.env` file:
- `test:dev` → `.env.dev`
- `test:qa` → `.env.qa`
- `test:ps` → `.env.ps`
- `test:prod` → `.env.prod`

### Testing Framework

**Core Technologies:**
- **Jest** - Testing framework with 90% coverage thresholds
- **React Native Testing Library** - Component testing utilities
- **Jest Native** - Additional React Native matchers

**Coverage Requirements:**
- **Branches**: 90%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

### Test Structure

```
src/
├── __tests__/
│   ├── setup.ts              # Global test configuration
│   ├── components/           # Component tests
│   ├── api/                  # API layer tests
│   ├── screens/              # Screen component tests
│   └── utils/                # Utility function tests
├── components/
│   └── ComponentName.test.tsx
└── api/
    └── apiModule.test.ts
```

### Environment-Specific Testing Features

#### API Testing
- **Mock API endpoints** per environment
- **Validate environment-specific URLs**
- **Test environment switching logic**

#### Configuration Testing
- **Cognito configuration** per environment
- **AWS region settings**
- **Feature flags** and environment variables

#### Integration Testing
- **Environment-specific workflows**
- **Cross-environment data validation**
- **Environment isolation verification**

### SonarQube Integration

#### Local Analysis
```bash
npm run sonar              # Run SonarQube analysis
```

#### Environment-Specific Analysis
```bash
# Analyze specific environment configuration
sonar-scanner -Dsonar.projectKey=boycottproui-dev -Dsonar.analysis.environment=dev
sonar-scanner -Dsonar.projectKey=boycottproui-qa -Dsonar.analysis.environment=qa
```

### Coverage Reports

**Generated Reports:**
- **Text**: Console output
- **LCOV**: `coverage/lcov.info` (for SonarQube)
- **HTML**: `coverage/lcov-report/index.html`
- **JSON**: `coverage/coverage-final.json`

### Best Practices

#### Component Testing
```typescript
import { render, screen } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly in dev environment', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });
});
```

#### API Testing
```typescript
import { getApiBaseUrl, mockApiResponse } from '../__tests__/setup';

describe('API calls', () => {
  it('should use correct environment URL', () => {
    const baseUrl = getApiBaseUrl();
    expect(baseUrl).toMatch(/https:\/\/api\.(dev|qa|ps|prod)\.example\.com/);
  });
});
```

#### Environment Variable Testing
```typescript
describe('Environment configuration', () => {
  it('should load correct environment variables', () => {
    expect(process.env.API_BASE_URL).toBeDefined();
    expect(process.env.COGNITO_USER_POOL_ID).toBeDefined();
  });
});
```

### Continuous Integration

**Jenkins Pipeline Integration:**
- Environment-specific test runs
- Coverage reporting per environment
- SonarQube quality gates
- Failed test notifications

**Coverage Enforcement:**
- **Minimum 90%** coverage required
- **Quality gates** block deployment if coverage drops
- **Environment-specific** coverage tracking