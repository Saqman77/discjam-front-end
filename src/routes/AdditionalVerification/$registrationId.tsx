import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { api } from '@utils/api';
import { getRegistrationToken, makeAuthenticatedRequest, handleTokenExpiration } from '@utils/auth';
import { BASE_URL } from '@constants';
import '@styles/additional-verification-form.scss';

export const Route = createFileRoute('/AdditionalVerification/$registrationId')({
  component: AdditionalVerificationReferralForm,
  loader: async (context) => {
    const { registrationId } = context.params;
    
    // Check if we have a valid JWT token
    const jwtToken = getRegistrationToken(registrationId);
    
    if (!jwtToken) {
      throw redirect({ to: '/AdditionalVerification' });
    }
    
    try {
      // Fetch registration data with JWT authentication
      const regResp = await makeAuthenticatedRequest(
        `${BASE_URL}/api/register/${registrationId}/`,
        registrationId
      );
      
      if (regResp.status === 401 || regResp.status === 403) {
        handleTokenExpiration(registrationId, '/AdditionalVerification');
        throw redirect({ to: '/AdditionalVerification' });
      }
      
      if (!regResp.ok) {
        throw redirect({ to: '/AdditionalVerification' });
      }
      
      const registration = await regResp.json();
      return { registrationId, registration };
    } catch (error) {
      throw redirect({ to: '/AdditionalVerification' });
    }
  },
});

function AdditionalVerificationReferralForm() {
  const { registrationId } = Route.useLoaderData();
  const [selectedReferral, setSelectedReferral] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!selectedReferral || selectedReferral.trim() === '') {
      setError('Referral is required.');
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append('referral', selectedReferral);
    try {
      const resp = await makeAuthenticatedRequest(
        `${BASE_URL}/api/additional-verification/${registrationId}/submit/`,
        registrationId,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.error || 'Failed to submit referral.');
      } else {
        setSuccess('Referral submitted successfully!');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to submit referral.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="additional-verification-form-container">
      <div className="additional-verification-form-card">
        <div className="additional-verification-form-content">
          <h2 className="additional-verification-form-title">Provide Referral</h2>
          <form onSubmit={handleSubmit} className="additional-verification-form">
            <div className="form-field">
              <label className="form-label">Referral <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter referral name"
                value={selectedReferral}
                onChange={e => setSelectedReferral(e.target.value)}
                required
                maxLength={255}
              />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Referral'}
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
} 