/**
 * Authentication utilities for JWT token management
 */

export interface RegistrationToken {
  token: string;
  registrationId: string;
}

/**
 * Store JWT token for a specific registration
 */
export const storeRegistrationToken = (registrationId: string, token: string): void => {
  localStorage.setItem(`registration_token_${registrationId}`, token);
};

/**
 * Get JWT token for a specific registration
 */
export const getRegistrationToken = (registrationId: string): string | null => {
  return localStorage.getItem(`registration_token_${registrationId}`);
};

/**
 * Remove JWT token for a specific registration
 */
export const removeRegistrationToken = (registrationId: string): void => {
  localStorage.removeItem(`registration_token_${registrationId}`);
};

/**
 * Clear all registration tokens
 */
export const clearAllRegistrationTokens = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('registration_token_')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Check if token exists and is valid format (basic check)
 */
export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  // Basic JWT format check (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Create Authorization header for API requests
 */
export const createAuthHeader = (token: string): { Authorization: string } => {
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Make authenticated API request with JWT token and proper Origin headers
 */
export const makeAuthenticatedRequest = async (
  url: string,
  registrationId: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getRegistrationToken(registrationId);
  
  if (!isValidToken(token)) {
    throw new Error('No valid authentication token found');
  }

  // Import the API utility for proper Origin handling
  const { apiRequest, getFrontendOrigin } = await import('./api');
  
  const headers = {
    ...options.headers,
    ...createAuthHeader(token!),
    'Origin': getFrontendOrigin()
  };

  return apiRequest(url, {
    ...options,
    headers
  });
};

/**
 * Handle token expiration and redirect to verification
 */
export const handleTokenExpiration = (registrationId: string, redirectTo?: string): void => {
  removeRegistrationToken(registrationId);
  // Redirect to appropriate verification page based on context
  const defaultRedirect = '/RegistrationProofSubmission';
  window.location.href = redirectTo || defaultRedirect;
};