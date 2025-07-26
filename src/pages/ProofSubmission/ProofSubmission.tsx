import { useState, useRef } from 'react';
import { Card, CardContent } from '@uikit/card';
import { Route } from '@routes/RegistrationProofSubmission/$registrationId';
import ProofSubmissionHeader from './ProofSubmissionHeader';
import ProofSubmissionDetails from './ProofSubmissionDetails';
import ProofSubmissionForm from './ProofSubmissionForm';

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
        const err = await resp.json();
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

  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  if (!registration) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-xl">
        <ProofSubmissionHeader registrationId={registration.id} />
        <CardContent>
          <ProofSubmissionDetails registration={registration} />
          <ProofSubmissionForm
            inputRef={inputRef}
            isSubmitting={isSubmitting}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            success={success}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProofSubmission;