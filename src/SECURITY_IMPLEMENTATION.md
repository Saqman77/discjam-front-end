# Security Implementation

This document outlines the security measures implemented in the main project based on the security infrastructure from the `frontend/` project.

## Overview

The security implementation includes JWT token management, secure API requests with proper Origin headers, and CSRF protection for registration workflows.

## Files Added/Modified

### New Security Files

1. **`src/utils/auth.ts`** - JWT token management utilities
   - Registration-specific token storage and retrieval
   - Token validation and expiration handling
   - Authenticated request helpers

2. **`src/utils/api.ts`** - Secure API utilities
   - Origin header management for CORS
   - CSRF token handling
   - Enhanced fetch wrapper with security headers
   - API request methods (GET, POST, PUT, DELETE, PATCH)

3. **`src/constants.ts`** - API configuration
   - Environment-aware API endpoints
   - Security-related constants

### Modified Files

1. **`src/App.tsx`** - Updated for clean routing (no authentication providers)
2. **`src/types/api.ts`** - Added authentication types for JWT tokens
3. **`src/routes/RegistrationProofSubmission/$registrationId.tsx`** - Updated to use secure API
4. **`src/components/main/RegistrationContext.tsx`** - Updated to use secure API
5. **`src/pages/ProofSubmission/ProofSubmission.tsx`** - Updated to use secure API

## Security Features

### 1. JWT Token Management
- Registration-specific token storage in localStorage
- Token validation (basic JWT format check)
- Automatic token cleanup
- Token expiration handling with redirects

### 2. Origin Header Security
- Automatic Origin header injection for all API requests
- Environment-aware origin detection
- CORS compliance for cross-origin requests

### 3. CSRF Protection
- CSRF token fetching from Django backend
- Automatic CSRF token inclusion in state-changing requests
- Cookie-based CSRF token management

### 4. API Request Security
- Enhanced fetch wrapper with security headers
- Credential inclusion for session-based authentication
- Error handling for security-related HTTP status codes
- Logging for debugging security issues

### 5. Registration-Specific Security
- Token-based access for registration verification flows
- Secure proof submission with authentication
- Registration-specific token validation

## Usage Examples

### Making Secure API Calls
```tsx
import { api } from '@utils/api';

// GET request
const response = await api.get('/api/protected-endpoint/');

// POST request with data
const response = await api.post('/api/data/', { key: 'value' });

// Using registration tokens
import { makeAuthenticatedRequest } from '../utils/auth';
const response = await makeAuthenticatedRequest('/api/endpoint/', registrationId);
```

### Using Registration Tokens
```tsx
import { getRegistrationToken, makeAuthenticatedRequest } from '@utils/auth';

// For registration-specific authenticated requests
const token = getRegistrationToken(registrationId);
if (token) {
  const response = await makeAuthenticatedRequest('/api/endpoint/', registrationId);
}
```

## Environment Variables

For production deployments, ensure these environment variables are set:

- `VITE_API_BASE_URL` - Backend API base URL (required)
- `VITE_FRONTEND_ORIGIN` - Frontend origin for API requests (optional, auto-detected if not set)

## Security Considerations

1. **Token Storage**: Registration tokens are stored in localStorage for registration workflows only.

2. **HTTPS**: Ensure all production deployments use HTTPS to protect tokens and data in transit.

3. **CORS Configuration**: Ensure the backend CORS configuration matches the frontend origins.

4. **Registration Security**: Registration tokens are short-lived and specific to individual registration flows.

5. **Content Security Policy**: Consider implementing CSP headers to prevent XSS attacks.

## Migration Notes

The following files had their API calls updated to use the secure utilities:
- Registration forms now use the secure API wrapper
- Proof submission uses authenticated requests
- All fetch calls include proper Origin headers
- CSRF tokens are automatically included where needed

## Implementation Focus

This security implementation is focused on:

1. **Registration Security** - Secure registration workflows with token validation
2. **API Security** - Origin headers and CSRF protection for all API calls  
3. **Data Protection** - Secure transmission of form data and file uploads
4. **Error Handling** - Comprehensive security error logging and user feedback

**Note**: This implementation does not include user session management or admin authentication by design. It focuses purely on secure registration workflows.