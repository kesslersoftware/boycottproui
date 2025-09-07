# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this 
repository.

## Development Commands

### Starting the Application
- `npm run start:dev` - Start with development environment
- `npm run start:qa` - Start with QA environment  
- `npm run start:ps` - Start with pre-production environment
- `npm run start:prod` - Start with production environment

### Platform-Specific Development
- `npm run android:dev` - Run on Android with dev environment
- `npm run ios:dev` - Run on iOS with dev environment
- `npm run android` - Run on Android with current .env
- `npm run ios` - Run on iOS with current .env

### Environment Management
Environment files (.env.dev, .env.qa, .env.ps, .env.prod) are automatically copied to .env 
based on the command used. Each environment contains:
- API_URL - Backend API endpoint
- COGNITO_* - AWS Cognito authentication configuration
- APP_ENV - Environment identifier

## Architecture Overview

### Authentication System
- **AWS Amplify + Cognito**: Primary authentication using JWT tokens
- **UserContext**: React context managing user state and session persistence
- **AsyncStorage**: Local user data caching to prevent login flicker
- **Auto-refresh**: Automatic token refresh and session restoration on app start

### Navigation Structure
- **Dual Stack Architecture**: Separate navigation stacks for authenticated and unauthenticated 
- users
- **AuthStack**: Login, registration, password reset flows
- **AppStack**: Main application screens (Home, Trends, Company/Cause details, etc.)
- **Conditional Rendering**: RootNavigator switches stacks based on authentication state

### API Layer
- **Centralized HTTP Client** (`src/api/api.ts`): Handles authentication headers, token refresh, 
- and error handling
- **Domain-specific APIs**: Separated into users.ts, companies.ts, causes.ts, misc.ts
- **Automatic Retry**: 401 responses trigger token refresh and single retry attempt

### Type System
- **Comprehensive TypeScript**: Strict type checking enabled
- **Domain Models**: Well-structured types in `/src/types/` organized by domain (users, companies, 
-  causes)
- **Form Types**: Dedicated form types for all user inputs (LoginForm, RegisterForm, etc.)
- **API Response Types**: Structured response and error handling types

### State Management
- **React Context**: UserContext for global user state
- **Local Storage**: AsyncStorage for offline data persistence
- **Services**: LocalBoycottStore and AnonymousStatsService for data management

### Project Structure
```
src/
├── api/           # API client and domain-specific endpoints
├── components/    # Reusable UI components
├── context/       # React contexts (UserContext)
├── screens/       # Screen components organized by feature
├── services/      # Business logic and data services  
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── helpers/       # Helper functions (DateUtil)
├── debug/         # Development debugging tools
└── amplify.ts     # AWS Amplify configuration
```

### Key Development Notes
- **Environment Variables**: Managed via react-native-dotenv with @env imports
- **Polyfills**: Required polyfills loaded in App.tsx for AWS compatibility
- **Debug Tools**: Optional fetch/XHR loggers available for API debugging
- **Expo Framework**: Built on Expo with React Native new architecture enabled
- **Absolute Imports**: Configured via tsconfig.json baseUrl for clean imports

### Authentication Flow
1. App boots → `bootstrapIfSignedIn()` checks existing session
2. If valid session → Load user profile from API → Navigate to AppStack
3. If invalid/no session → Clear cached data → Navigate to AuthStack  
4. Login → Cognito sign-in → Get JWT → Fetch user profile → Cache user → Navigate to AppStack
5. Auto-refresh handles token expiry transparently

### Error Handling
- **API Errors**: Structured error responses with status codes
- **Authentication Errors**: Automatic token refresh and retry logic
- **Network Errors**: Graceful degradation with user feedback
- **Form Validation**: Client-side validation with server-side backup
