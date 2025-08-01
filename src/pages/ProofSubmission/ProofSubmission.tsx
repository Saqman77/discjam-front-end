import { useState, useRef } from 'react';
import { Route } from '@routes/RegistrationProofSubmission/$registrationId';
import ProofSubmissionHeader from './ProofSubmissionHeader';
import ProofSubmissionDetails from './ProofSubmissionDetails';
import ProofSubmissionForm from './ProofSubmissionForm';
import '@styles/proof-submission.scss';

const ProofSubmission = () => {
  const { registrationId, registration } = Route.useLoaderData();
  const { token } = (Route.useSearch() as any) || {};
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);
    if (!file) {
      setError('Please select an image file.');
      setIsSubmitting(false);
      return;
    }
    try {
      // Use FormData for file upload, similar to registration form
      const formData = new FormData();
      formData.append('payment_proof', file);
      if (token) formData.append('token', token);
      
      const resp = await fetch(`/api/register/${registrationId}/payment-proof/`, {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setError(err.error || 'Failed to submit payment proof.');
      } else {
        setSuccess('Payment proof submitted successfully!');
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
      }
    } catch (e: any) {
      setError(e.message || 'Failed to submit payment proof.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="error-container">{error}</div>;
  if (!registration) return null;

  return (
    <div className="proof-submission-page-container">
      <div className="proof-submission-page-card">
        <ProofSubmissionHeader registrationId={registration.id} />
        <div className="proof-submission-page-content">
          <ProofSubmissionDetails registration={registration} />
          <ProofSubmissionForm
            inputRef={inputRef}
            isSubmitting={isSubmitting}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            success={success}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ProofSubmission;