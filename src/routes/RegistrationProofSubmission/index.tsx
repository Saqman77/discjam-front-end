import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@uikit/card';
import { Button } from '@uikit/button';
import { Input } from '@uikit/input';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Submit Payment Proof</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Registration ID</label>
              <Input value={registrationId} onChange={e => setRegistrationId(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Primary Attendee CNIC Number</label>
              <Input value={cnic} onChange={e => setCnic(e.target.value)} required placeholder="xxxxx-xxxxxxx-x" />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/RegistrationProofSubmission/')({
  component: ProofSubmissionEntry,
}); 