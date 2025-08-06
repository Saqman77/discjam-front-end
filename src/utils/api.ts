/**
 * API utilities for secure requests with proper Origin headers
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://discjam-event-management-system.onrender.com';

/**
 * Get the current frontend origin for API requests
 */
export const getFrontendOrigin = (): string => {
  // In development, use the current origin (Vite dev server)
  if (import.meta.env.DEV) {
    return window.location.origin;
  }
  
  // In production, use environment variable or fallback to current origin
  return import.meta.env.VITE_FRONTEND_ORIGIN || window.location.origin;
};

/**
 * Get CSRF token from cookies
 */
export const getCSRFToken = (): string | null => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  
  return cookieValue ? cookieValue.split('=')[1] : null;
};

/**
 * Fetch CSRF token from Django backend
 */
export const fetchCSRFToken = async (): Promise<string | null> => {
  try {
    console.log('[API] Fetching CSRF token from backend...');
    const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Origin': getFrontendOrigin()
      }
    });
    
    console.log(`[API] CSRF token response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[API] CSRF token received successfully');
      return data.csrfToken;
    } else {
      console.error('[API] Failed to fetch CSRF token - response not ok');
      const errorData = await response.text();
      console.error('[API] CSRF token error response:', errorData);
    }
  } catch (error) {
    console.error('[API] Failed to fetch CSRF token:', error);
  }
  
  return null;
};

/**
 * Create headers with proper Origin for API requests
 */
export const createApiHeaders = (additionalHeaders: Record<string, string> = {}, includeCSRF: boolean = false): HeadersInit => {
  const origin = getFrontendOrigin();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Origin': origin,
    ...additionalHeaders
  };

  // Include CSRF token for state-changing requests
  if (includeCSRF) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  return headers;
};

/**
 * Enhanced fetch wrapper that ensures proper Origin headers for all API requests
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Get current origin
  const origin = getFrontendOrigin();
  
  // Start with provided headers, then add Origin
  const headers = {
    ...options.headers
  };

  // Ensure Origin header is always present
  (headers as Record<string, string>)['Origin'] = origin;

  console.log(`[API] Making request to: ${url}`);
  console.log(`[API] Origin header: ${origin}`);
  console.log(`[API] Method: ${options.method || 'GET'}`);

  const response = await fetch(url, {
    ...options,
    headers,
    // Include credentials for session-based requests
    credentials: options.credentials || 'include'
  });

  // Log response for debugging
  console.log(`[API] Response status: ${response.status}`);
  
  if (!response.ok && response.status === 403) {
    console.error('[API] 403 Forbidden - Check Origin header and backend security configuration');
    const errorData = await response.clone().json().catch(() => null);
    if (errorData) {
      console.error('[API] Security error details:', errorData);
    }
  }

  return response;
};

/**
 * API request methods with proper Origin headers
 */
export const api = {
  get: (endpoint: string, options: RequestInit = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options: RequestInit = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData 
        ? { 
            // For FormData, don't set Content-Type - browser will set it with boundary
            Origin: getFrontendOrigin(), 
            'X-CSRFToken': getCSRFToken() || '',
            ...options.headers 
          }
        : createApiHeaders(options.headers as Record<string, string>, true) // Include CSRF for POST
    }),
    
  put: (endpoint: string, data?: any, options: RequestInit = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: createApiHeaders(options.headers as Record<string, string>)
    }),
    
  delete: (endpoint: string, options: RequestInit = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
    
  patch: (endpoint: string, data?: any, options: RequestInit = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: createApiHeaders(options.headers as Record<string, string>)
    })
};

/**
 * Legacy fetch wrapper for backward compatibility
 * Automatically adds Origin header to any fetch request to API endpoints
 */
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // Check if this is an API request
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const isApiRequest = url.includes('/api/') || url.includes(API_BASE_URL);
  
  if (isApiRequest) {
    console.log('[FETCH INTERCEPTOR] API request detected, adding Origin header');
    
    const origin = getFrontendOrigin();
    const headers = new Headers(init?.headers);
    
    // Ensure Origin header is present
    if (!headers.has('Origin')) {
      headers.set('Origin', origin);
      console.log(`[FETCH INTERCEPTOR] Added Origin header: ${origin}`);
    }
    
    return originalFetch(input, {
      ...init,
      headers,
      credentials: init?.credentials || 'include'
    });
  }
  
  // Non-API requests use original fetch
  return originalFetch(input, init);
};

export default api;