import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import '@styles/refill-registration.scss';

function RefillRegistrationEntry() {
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
      const resp = await fetch('/api/verify-refill-access/', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.valid) {
        setError(data.error || 'Verification failed.');
      } else {
        window.location.href = `/RefillRegistration/${registrationId}?token=${encodeURIComponent(data.token)}`;
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };


   // Same CNIC formatting function as original registration
   const formatCNIC = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const handleCNICChange = (idx: number, value: string) => {
    const formatted = formatCNIC(value);
    setCnic(formatted);
  };

  const handleCNICPaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatCNIC(pastedText);
    setCnic(formatted);
  };

  return (
    <div className="refill-registration-container">
      <div className="refill-registration-card">
        <div className="refill-registration-content">
          <h2 className="refill-registration-title">Correct Registration Form</h2>
          <form onSubmit={handleSubmit} className="refill-registration-form">
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
                required 
                onPaste={e => handleCNICPaste(0, e)}
                onChange={e => handleCNICChange(0, e.target.value)}
                maxLength={15}
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

export const Route = createFileRoute('/RefillRegistration/')({
  component: RefillRegistrationEntry,
}); 