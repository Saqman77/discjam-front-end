import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@uikit/card';
import { Button } from '@uikit/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@uikit/select';

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
    // Fetch referrals
    const refResp = await fetch('/api/referrals/');
    const refData = await refResp.json();
    const referrals = refData.referrals || refData;
    return { registrationId, token, registration, referrals };
  },
});

function AdditionalVerificationReferralForm() {
  const { registrationId, token, registration, referrals } = Route.useLoaderData();
  const [selectedReferral, setSelectedReferral] = useState<string>('none');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!selectedReferral || selectedReferral === 'none') {
      setError('Referral is required and cannot be "no referral".');
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append('token', token);
    formData.append('referral', selectedReferral);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Provide Referral</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Referral <span className="text-red-600">*</span></label>
              <Select value={selectedReferral} onValueChange={setSelectedReferral} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Referral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Referral</SelectItem>
                  {referrals.filter((r: any) => r.id).map((r: any) => (
                    <SelectItem key={r.id} value={String(r.id)}>{r.first_name} {r.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Referral'}
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 