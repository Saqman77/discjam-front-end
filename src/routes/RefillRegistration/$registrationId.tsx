import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@uikit/card';
import { Button } from '@uikit/button';
import { Input } from '@uikit/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@uikit/select';
import { Users, ArrowLeft, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Same constants as original registration form
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^\+\d{9,15}$/;

export const Route = createFileRoute('/RefillRegistration/$registrationId')({
  component: RefillRegistrationForm,
  loader: async (context) => {
    const { registrationId } = context.params;

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (!token) {
      throw redirect({ to: '/RefillRegistration' });
    }

    try {
      const formData = new FormData();
      formData.append('token', token);

      const resp = await fetch(`/api/refill-registration/${registrationId}/`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw redirect({ to: '/RefillRegistration' });
      }

      const registrationData = await resp.json();
      return { registrationId, registrationData };
    } catch (error) {
      throw redirect({ to: '/RefillRegistration' });
    }
  },
})

function RefillRegistrationForm() {
  const { registrationId, registrationData } = Route.useLoaderData();
  const [attendees, setAttendees] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<number | null>(null);
  const [primaryAttendee, setPrimaryAttendee] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load initial data
    if (registrationData) {
      // Format CNIC numbers when loading data
      const formattedAttendees = (registrationData.attendees || []).map((attendee: any) => ({
        ...attendee,
        cnic_number: attendee.cnic_number ? formatCNIC(attendee.cnic_number.toString()) : ''
      }));
      setAttendees(formattedAttendees);
      setSelectedReferral(registrationData.referral);
      setPrimaryAttendee(registrationData.primary_attendee_index || 0);
    }

    // Fetch additional data
    fetch('/api/genders/')
      .then(r => r.json())
      .then(data => setGenders(data.genders || data))
      .catch(console.error);

    fetch('/api/referrals/')
      .then(r => r.json())
      .then(data => setReferrals(data.referrals || data))
      .catch(console.error);
  }, [registrationData]);

  const handleAttendeeChange = (idx: number, field: string, value: string | number | File) => {
    setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
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
    handleAttendeeChange(idx, 'cnic_number', formatted);
  };

  const handleCNICPaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatCNIC(pastedText);
    handleAttendeeChange(idx, 'cnic_number', formatted);
  };

  // Same validation logic as original registration form
  const validateAttendees = () => {
    const newErrors: { [key: string]: string } = {};
    attendees.forEach((att, idx) => {
      if (!att.first_name) newErrors[`first_name_${idx}`] = 'First name is required.';
      if (!att.last_name) newErrors[`last_name_${idx}`] = 'Last name is required.';
      if (!att.cnic_number) newErrors[`cnic_number_${idx}`] = 'CNIC is required.';
      else if (!CNIC_REGEX.test(att.cnic_number)) newErrors[`cnic_number_${idx}`] = 'Invalid CNIC format.';
      if (!att.gender) newErrors[`gender_${idx}`] = 'Gender is required.';
      if (!att.email) newErrors[`email_${idx}`] = 'Email is required.';
      else if (!EMAIL_REGEX.test(att.email)) newErrors[`email_${idx}`] = 'Invalid email.';
      if (!att.whatsapp_number) newErrors[`whatsapp_number_${idx}`] = 'WhatsApp number is required.';
      else {
        let cleanNumber = att.whatsapp_number.replace(/[^\d+]/g, '');
        if (!cleanNumber.startsWith('+')) {
          cleanNumber = '+' + cleanNumber;
        }
        console.log('Validating WhatsApp:', cleanNumber);
        if (!WHATSAPP_REGEX.test(cleanNumber)) {
          newErrors[`whatsapp_number_${idx}`] = 'Invalid WhatsApp number.';
        }
      }
      if (!att.cnic_front) newErrors[`cnic_front_${idx}`] = 'CNIC front image is required.';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    console.log('Form submitted, validating...');
    console.log('Current attendees:', attendees);

    if (!validateAttendees()) {
      console.log('Validation failed, errors:', errors);
      setIsSubmitting(false);
      return;
    }

    console.log('Validation passed, preparing data...');

    const attendeesWithFiles = attendees.map(att => {
      const cnic_number = att.cnic_number ? att.cnic_number.replace(/-/g, '') : '';
      let whatsapp_number = att.whatsapp_number;
      if (whatsapp_number && !whatsapp_number.startsWith('+')) {
        whatsapp_number = '+' + whatsapp_number;
      }
      return { ...att, cnic_number, whatsapp_number };
    });

    const payload = {
      ticket_type: registrationData.ticket_type,
      referral: selectedReferral,
      attendees: attendeesWithFiles,
      primary_attendee_index: primaryAttendee
    };

    console.log('Payload prepared:', payload);

    const formData = new FormData();
    formData.append('ticket_type', String(payload.ticket_type));
    if (payload.referral !== null && payload.referral !== undefined) {
      formData.append('referral', String(payload.referral));
    }
    formData.append('primary_attendee_index', String(payload.primary_attendee_index));
    
    attendeesWithFiles.forEach((att, idx) => {
      Object.entries(att).forEach(([key, value]) => {
        if (key === 'cnic_front' && value instanceof File) {
          formData.append(`attendees[${idx}][${key}]`, value);
        } else if (value !== null && value !== undefined) {
          formData.append(`attendees[${idx}][${key}]`, String(value));
        }
      });
    });

    // Add token from URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    if (token) {
      formData.append('token', token);
    }

    console.log('FormData prepared, submitting...');

    try {
      const response = await fetch(`/api/refill-registration/${registrationId}/submit/`, {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const err = await response.json();
        console.log('Error response:', err);
        setError(err.error || 'Failed to update registration');
      } else {
        const result = await response.json();
        console.log('Success response:', result);
        setSuccess('Registration updated successfully!');
      }
    } catch (e) {
      console.log('Network error:', e);
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Correct Your Registration</h1>
          <p className="text-center mb-6 text-gray-600">
            Please review and correct the information below. All fields marked with * are required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> Attendee Details
            </h2>

            {attendees.map((att, idx) => (
              <div key={idx} className="border p-4 rounded mb-4">
                {attendees.length === 2 && (
                  <div className="mb-3 text-base font-semibold text-blue-700">Attendee {idx + 1}</div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">First Name *</label>
                    <Input 
                      placeholder="First Name" 
                      value={att.first_name || ''} 
                      onChange={e => handleAttendeeChange(idx, 'first_name', e.target.value)} 
                      required 
                    />
                    {errors[`first_name_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`first_name_${idx}`]}</span>}
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">Last Name *</label>
                    <Input 
                      placeholder="Last Name" 
                      value={att.last_name || ''} 
                      onChange={e => handleAttendeeChange(idx, 'last_name', e.target.value)} 
                      required 
                    />
                    {errors[`last_name_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`last_name_${idx}`]}</span>}
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">CNIC Number *</label>
                    <Input
                      placeholder="CNIC Number"
                      value={att.cnic_number || ''}
                      onChange={e => handleCNICChange(idx, e.target.value)}
                      onPaste={e => handleCNICPaste(idx, e)}
                      required
                      maxLength={15}
                    />
                    {errors[`cnic_number_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`cnic_number_${idx}`]}</span>}
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">Gender *</label>
                    <Select 
                      value={att.gender ? String(att.gender) : 'none'} 
                      onValueChange={v => handleAttendeeChange(idx, 'gender', v !== 'none' ? Number(v) : 0)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Gender</SelectItem>
                        {genders.map(g => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors[`gender_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`gender_${idx}`]}</span>}
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <label className="text-sm font-medium mb-1">Instagram URL</label>
                    <Input 
                      placeholder="Instagram URL" 
                      value={att.instagram_url || ''} 
                      onChange={e => handleAttendeeChange(idx, 'instagram_url', e.target.value)} 
                    />
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">Email *</label>
                    <Input
                      placeholder="Email"
                      value={att.email || ''}
                      onChange={e => handleAttendeeChange(idx, 'email', e.target.value)}
                      required
                      type="email"
                    />
                    {errors[`email_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`email_${idx}`]}</span>}
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">WhatsApp Number *</label>
                    <div className="w-full rounded border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                      <PhoneInput
                        country={'pk'}
                        value={att.whatsapp_number || ''}
                        onChange={(value, data) => {
                          const code = data && typeof data === 'object' && 'dialCode' in data ? `+${data.dialCode}` : '';
                          if (code && value.length < code.length) {
                            handleAttendeeChange(idx, 'whatsapp_number', code);
                          } else {
                            handleAttendeeChange(idx, 'whatsapp_number', value);
                          }
                        }}
                        enableSearch={false}
                        disableSearchIcon={true}
                        onlyCountries={['pk', 'us', 'gb']}
                        placeholder="3001234567"
                        inputProps={{
                          name: 'whatsapp',
                          required: true,
                          autoFocus: false,
                          maxLength: 16
                        }}
                        containerStyle={{ width: '100%', maxWidth: '100%' }}
                        inputStyle={{ width: '100%' }}
                        dropdownStyle={{ maxWidth: '100vw', left: 0, width: 'max-content' }}
                        specialLabel=""
                      />
                    </div>
                    {errors[`whatsapp_number_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`whatsapp_number_${idx}`]}</span>}
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <label className="text-sm font-medium mb-1">CNIC Front (Image) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleAttendeeChange(idx, 'cnic_front', e.target.files?.[0] || '')}
                      required
                      className="col-span-2"
                    />
                    {errors[`cnic_front_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`cnic_front_${idx}`]}</span>}
                  </div>
                </div>
              </div>
            ))}

            {attendees.length === 2 && (
              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium">Primary Attendee:</span>
                <Button
                  type="button"
                  variant={primaryAttendee === 0 ? 'default' : 'outline'}
                  onClick={() => setPrimaryAttendee(0)}
                  className="flex-1"
                >
                  {attendees[0]?.first_name || 'Attendee 1'}
                </Button>
                <Button
                  type="button"
                  variant={primaryAttendee === 1 ? 'default' : 'outline'}
                  onClick={() => setPrimaryAttendee(1)}
                  className="flex-1"
                >
                  {attendees[1]?.first_name || 'Attendee 2'}
                </Button>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Who referred you?</label>
              <Select
                value={selectedReferral !== null ? String(selectedReferral) : 'none'}
                onValueChange={v => setSelectedReferral(v !== 'none' ? Number(v) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No Referral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Referral</SelectItem>
                  {referrals.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.first_name} {r.last_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()} 
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
                ) : (
                  <><ArrowRight className="w-4 h-4 mr-1" />Update Registration</>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 