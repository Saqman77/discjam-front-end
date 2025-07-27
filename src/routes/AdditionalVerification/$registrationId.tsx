import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import '@styles/additional-verification-form.scss';

export const Route = createFileRoute('/AdditionalVerification/$registrationId')({
  component: AdditionalVerificationReferralForm,
  loader: async (context) => {
    const { registrationId } = context.params;
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    if (!token) throw redirect({ to: '/AdditionalVerification' });
    // Validate token and fetch registration
    const formData = new FormData();
    formData.append('token', token);
    const regResp = await fetch(`/api/register/${registrationId}/`, { credentials: 'include' });
    if (!regResp.ok) throw redirect({ to: '/AdditionalVerification' });
    const registration = await regResp.json();
    return { registrationId, token, registration };
  },
});

function AdditionalVerificationReferralForm() {
  const { registrationId, token, registration } = Route.useLoaderData();
  const [referralText, setReferralText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!referralText || !referralText.trim()) {
      setError('Referral is required.');
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append('token', token);
    formData.append('referral', referralText.trim());
    try {
      const resp = await fetch(`/api/additional-verification/${registrationId}/submit/`, {
        method: 'POST',
        body: formData,
      });
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
                value={referralText}
                onChange={e => setReferralText(e.target.value)}
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