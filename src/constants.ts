// API Configuration with proper fallbacks for development
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://discjam-event-management-system.onrender.com';

// Frontend Origin for API requests (used in Origin header)
export const FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_ORIGIN || (
  import.meta.env.DEV ? window.location.origin : ''
);

// API Endpoints
export const API_ENDPOINTS = {
  // CSRF for secure requests
  CSRF: '/api/csrf/',
  
  // Public endpoints (require origin validation)
  REGISTER: '/api/register/',
  VERIFY_REGISTRATION: '/api/verify-registration/',
  TICKET_TYPES: '/api/ticket-types/',
  GENDERS: '/api/genders/',
  
  // Registration endpoints
  REGISTRATION_DETAIL: (id: number) => `/api/register/${id}/`,
  PAYMENT_PROOF: (id: number) => `/api/register/${id}/payment-proof/`,
  REFILL_REGISTRATION: (id: number) => `/api/refill-registration/${id}/`,
  REFILL_SUBMIT: (id: number) => `/api/refill-registration/${id}/submit/`,
  ADDITIONAL_VERIFICATION: (id: number) => `/api/additional-verification/${id}/submit/`,
} as const;

// Development configuration warning
if (import.meta.env.DEV) {
  console.log('[CONFIG] Development mode detected');
  console.log(`[CONFIG] API Base URL: ${BASE_URL}`);
  console.log(`[CONFIG] Frontend Origin: ${FRONTEND_ORIGIN || 'Auto-detected'}`);
}