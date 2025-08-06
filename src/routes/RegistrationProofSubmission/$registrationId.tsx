import { createFileRoute, redirect } from '@tanstack/react-router';
import ProofSubmission from '@pages/ProofSubmission/ProofSubmission';
import type { RegistrationDetail } from '@api/api';
import { getRegistrationToken, makeAuthenticatedRequest, handleTokenExpiration } from '@utils/auth';
import { BASE_URL } from '@constants';

export const Route = createFileRoute('/RegistrationProofSubmission/$registrationId')({
  component: ProofSubmission,
  loader: async (context) => {
    const { registrationId } = context.params;
    
    // Check if we have a valid JWT token
    const jwtToken = getRegistrationToken(registrationId);
    
    if (!jwtToken) {
      throw redirect({ to: '/RegistrationProofSubmission' });
    }
    
    try {
      // Fetch registration data with JWT authentication
      const res = await makeAuthenticatedRequest(
        `${BASE_URL}/api/register/${registrationId}/`,
        registrationId
      );
      
      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        handleTokenExpiration(registrationId);
        throw redirect({ to: '/RegistrationProofSubmission' });
      }
      
      if (!res.ok) {
        throw new Error(`Registration fetch failed: ${res.status}`);
      }
      
      const registration: RegistrationDetail = await res.json();
      
      return { registrationId, registration };
    } catch (error) {
      throw redirect({ to: '/RegistrationProofSubmission' });
    }
  },
})

export default function RegistrationProofSubmission() {
  return <ProofSubmission />
} 