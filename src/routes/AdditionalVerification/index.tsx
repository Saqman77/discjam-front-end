import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import './additional-verification.scss';

function AdditionalVerificationEntry() {
  const [registrationId, setRegistrationId] = useState('');
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('registration_id', registrationId);
      formData.append('cnic_number', cnic.replace(/-/g, ''));
      const resp = await fetch('/api/verify-additional-verification/', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok || !data.valid) {
        setError(data.error || 'Verification failed.');
      } else {
        window.location.href = `/AdditionalVerification/${registrationId}?token=${encodeURIComponent(data.token)}`;
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="additional-verification-container">
      <div className="additional-verification-card">
        <div className="additional-verification-content">
          <h2 className="additional-verification-title">Additional Verification</h2>
          <form onSubmit={handleSubmit} className="additional-verification-form">
            <div className="form-field">
              <label className="form-label">Registration ID</label>
              <input 
                type="text"
                className="form-input"
                value={registrationId} 
                onChange={e => setRegistrationId(e.target.value)} 
                required 
              />
            </div>
            <div className="form-field">
              <label className="form-label">Primary Attendee CNIC Number</label>
              <input 
                type="text"
                className="form-input"
                value={cnic} 
                onChange={e => setCnic(e.target.value)} 
                required 
                placeholder="xxxxx-xxxxxxx-x" 
              />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/AdditionalVerification/')({
  component: AdditionalVerificationEntry,
}); 