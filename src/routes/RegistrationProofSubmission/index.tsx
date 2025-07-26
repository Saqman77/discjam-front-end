import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import '@styles/registration-proof-submission.scss';

function ProofSubmissionEntry() {
  const [registrationId, setRegistrationId] = useState('');
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('registration_id', registrationId);
      formData.append('cnic_number', cnic.replace(/-/g, ''));
      const resp = await fetch('/api/verify-registration/', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok || !data.valid) {
        setError(data.error || 'Verification failed.');
      } else {
        window.location.href = `/RegistrationProofSubmission/${registrationId}?token=${encodeURIComponent(data.token)}`;
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="proof-submission-container">
      <div className="proof-submission-card">
        <div className="proof-submission-content">
          <h2 className="proof-submission-title">Submit Payment Proof</h2>
          <form onSubmit={handleSubmit} className="proof-submission-form">
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

export const Route = createFileRoute('/RegistrationProofSubmission/')({
  component: ProofSubmissionEntry,
}); 