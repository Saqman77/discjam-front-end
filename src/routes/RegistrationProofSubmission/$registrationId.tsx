import { createFileRoute, redirect } from '@tanstack/react-router';
import ProofSubmission from '@pages/ProofSubmission/ProofSubmission';
import { RegistrationDetail } from '../../types/api';

export const Route = createFileRoute('/RegistrationProofSubmission/$registrationId')({
  component: ProofSubmission,
  loader: async (context) => {
    const { registrationId } = context.params;
    
    // Try to access search params from the context
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    if (!token) {
      throw redirect({ to: '/RegistrationProofSubmission' });
    }
    
    try {
      // Validate token with backend
      const resp = await fetch(`/api/validate-proof-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: registrationId, token }),
      });
      
      if (!resp.ok) {
        throw redirect({ to: '/RegistrationProofSubmission' });
      }
      
      const data = await resp.json();
      
      if (!data.valid) {
        throw redirect({ to: '/RegistrationProofSubmission' });
      }
      
      const registration: RegistrationDetail = await fetch(`/api/register/${registrationId}/`).then(res => {
        if (!res.ok) {
          throw new Error(`Registration fetch failed: ${res.status}`);
        }
        return res.json();
      });
      
      return { registrationId, registration };
    } catch (error) {
      throw redirect({ to: '/RegistrationProofSubmission' });
    }
  },
})

export default function RegistrationProofSubmission() {
  return <ProofSubmission />
} 