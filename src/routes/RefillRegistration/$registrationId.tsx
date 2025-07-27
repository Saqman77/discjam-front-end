import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import name from '@assets/form/name.svg';
import mail from '@assets/form/mail.svg';
import nic from '@assets/form/nic.svg';
import phone from '@assets/form/phone.svg';
import insta from '@assets/form/instagram.svg';
import '@styles/refill-registration-form.scss';

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

      const registrationData = await resp.json().catch(() => ({}));
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

  const [referralText, setReferralText] = useState<string>('');
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
      setReferralText(registrationData.referral || '');
      setPrimaryAttendee(registrationData.primary_attendee_index || 0);
    }

    // Fetch additional data
    fetch('/api/genders/')
      .then(r => r.json().catch(() => ({})))
      .then(data => setGenders(data.genders || data))
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
      referral: referralText,
      attendees: attendeesWithFiles,
      primary_attendee_index: primaryAttendee
    };

    console.log('Payload prepared:', payload);

    const formData = new FormData();
    formData.append('ticket_type', String(payload.ticket_type));
    if (payload.referral && payload.referral.trim()) {
      formData.append('referral', payload.referral.trim());
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
        const err = await response.json().catch(() => ({}));
        console.log('Error response:', err);
        setError(err.error || 'Failed to update registration');
      } else {
        const result = await response.json().catch(() => ({}));
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
    <div className="refill-registration-form-container">
      <div className="refill-registration-form-card">
        <div className="refill-registration-form-content">
          <h1 className="refill-registration-form-title">Correct Your Registration</h1>
          <p className="refill-registration-form-description">
            Please review and correct the information below. All fields marked with * are required.
          </p>

          <form onSubmit={handleSubmit} className="refill-registration-form">
            <h2 className="attendee-details-title">
              <img src={name} alt="Users" className="attendee-icon" /> Attendee Details
            </h2>

            {attendees.map((att, idx) => (
              <div key={idx} className="attendee-section">
                {attendees.length === 2 && (
                  <div className="attendee-label">Attendee {idx + 1}</div>
                )}
                <div className="attendee-fields">
                  <div className="form-field">
                    <label className="form-label">First Name *</label>
                    <div className="input-wrapper">
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="First Name" 
                        value={att.first_name || ''} 
                        onChange={e => handleAttendeeChange(idx, 'first_name', e.target.value)} 
                        required 
                      />
                      <img src={name} alt="" className="input-icon" />
                    </div>
                    {errors[`first_name_${idx}`] && <span className="error-text">{errors[`first_name_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Last Name *</label>
                    <div className="input-wrapper">
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Last Name" 
                        value={att.last_name || ''} 
                        onChange={e => handleAttendeeChange(idx, 'last_name', e.target.value)} 
                        required 
                      />
                      <img src={name} alt="" className="input-icon" />
                    </div>
                    {errors[`last_name_${idx}`] && <span className="error-text">{errors[`last_name_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">CNIC Number *</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="CNIC Number"
                        value={att.cnic_number || ''}
                        onChange={e => handleCNICChange(idx, e.target.value)}
                        onPaste={e => handleCNICPaste(idx, e)}
                        required
                        maxLength={15}
                      />
                      <img src={nic} alt="" className="input-icon" />
                    </div>
                    {errors[`cnic_number_${idx}`] && <span className="error-text">{errors[`cnic_number_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Gender *</label>
                    <select 
                      className="form-select"
                      value={att.gender ? String(att.gender) : 'none'} 
                      onChange={e => handleAttendeeChange(idx, 'gender', e.target.value !== 'none' ? Number(e.target.value) : 0)}
                    >
                      <option value="none">Select Gender</option>
                      {genders.map(g => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
                    </select>
                    {errors[`gender_${idx}`] && <span className="error-text">{errors[`gender_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Instagram URL</label>
                    <div className="input-wrapper">
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Instagram URL" 
                        value={att.instagram_url || ''} 
                        onChange={e => handleAttendeeChange(idx, 'instagram_url', e.target.value)} 
                      />
                      <img src={insta} alt="" className="input-icon" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email *</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Email"
                        value={att.email || ''}
                        onChange={e => handleAttendeeChange(idx, 'email', e.target.value)}
                        required
                      />
                      <img src={mail} alt="" className="input-icon" />
                    </div>
                    {errors[`email_${idx}`] && <span className="error-text">{errors[`email_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">WhatsApp Number *</label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+923001234567"
                        value={att.whatsapp_number || ''}
                        onChange={e => handleAttendeeChange(idx, 'whatsapp_number', e.target.value)}
                        required
                      />
                      <img src={phone} alt="" className="input-icon" />
                    </div>
                    {errors[`whatsapp_number_${idx}`] && <span className="error-text">{errors[`whatsapp_number_${idx}`]}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">CNIC Front (Image) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleAttendeeChange(idx, 'cnic_front', e.target.files?.[0] || '')}
                      required
                      className="file-input"
                    />
                    {errors[`cnic_front_${idx}`] && <span className="error-text">{errors[`cnic_front_${idx}`]}</span>}
                  </div>
                </div>
              </div>
            ))}

            {attendees.length === 2 && (
              <div className="primary-attendee-section">
                <span className="primary-attendee-label">Primary Attendee:</span>
                <div className="primary-attendee-buttons">
                  <button
                    type="button"
                    className={`primary-attendee-button ${primaryAttendee === 0 ? 'active' : ''}`}
                    onClick={() => setPrimaryAttendee(0)}
                  >
                    {attendees[0]?.first_name || 'Attendee 1'}
                  </button>
                  <button
                    type="button"
                    className={`primary-attendee-button ${primaryAttendee === 1 ? 'active' : ''}`}
                    onClick={() => setPrimaryAttendee(1)}
                  >
                    {attendees[1]?.first_name || 'Attendee 2'}
                  </button>
                </div>
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Who referred you?</label>
              <input
                type="text"
                className="form-input"
                placeholder="Referral (Optional)"
                value={referralText}
                onChange={e => setReferralText(e.target.value)}
                maxLength={255}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="back-button"
                onClick={() => window.history.back()} 
                disabled={isSubmitting}
              >
                Back
              </button>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Registration'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-alert">
              <p className="error-text">{error}</p>
            </div>
          )}
          {success && (
            <div className="success-alert">
              <p className="success-text">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 