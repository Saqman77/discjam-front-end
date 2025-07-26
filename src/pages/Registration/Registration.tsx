import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@uikit/card'
import { Button } from '@uikit/button'
import { Input } from '@uikit/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@uikit/select'
import { CheckCircle, AlertCircle, User, Users, ArrowRight, ArrowLeft, Loader2, IdCard, Venus, Instagram, Mail, Phone, Image } from 'lucide-react'
import type { TicketType, Referral, Gender, RegistrationAttendee } from '../../types/api'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import RegistrationHeader from './RegistrationHeader';
import RegistrationTicketType from './RegistrationTicketType';
import RegistrationForm from './RegistrationForm';

const API_REGISTER = '/api/register/'
const API_TICKET_TYPES = '/api/ticket-types/'
const API_REFERRALS = '/api/referrals/'
const API_GENDERS = '/api/genders/'

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^\+\d{9,15}$/;

const Registration = () => {
  const [step, setStep] = useState(1)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null)
  const [attendees, setAttendees] = useState<RegistrationAttendee[]>([])
  const [primaryAttendee, setPrimaryAttendee] = useState(0)
  const [selectedReferral, setSelectedReferral] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch(API_TICKET_TYPES)
      .then(r => r.json())
      .then(data => setTicketTypes(data.ticket_types || data))
    fetch(API_REFERRALS)
      .then(r => r.json())
      .then(data => setReferrals(data.referrals || data))
    fetch(API_GENDERS)
      .then(r => r.json())
      .then(data => setGenders(data.genders || data))
  }, [])

  useEffect(() => {
    // Set default country code for each attendee
  }, [attendees.length]);

  const handleTicketTypeSelect = (id: number) => {
    setSelectedTicketType(id)
    const type = ticketTypes.find(t => t.id === id)
    const count = type && type.name.toLowerCase().includes('couple') ? 2 : 1
    setAttendees(Array(count).fill(null).map(() => ({
      first_name: '', last_name: '', cnic_number: '', gender: 0, instagram_url: '', cnic_front: '', email: '', whatsapp_number: ''
    })))
    setPrimaryAttendee(0)
    setStep(2)
  }

  const handleAttendeeChange = (idx: number, field: keyof RegistrationAttendee, value: string | number | File) => {
    setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a))
  }

  const handleReferralChange = (id: number | null) => setSelectedReferral(id)

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

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!validateAttendees()) {
      setIsSubmitting(false);
      return;
    }
    // Remove base64 conversion for cnic_front, send File object as-is
    const attendeesWithFiles = attendees.map(att => {
      // Remove dashes from CNIC number before sending
      const cnic_number = att.cnic_number ? att.cnic_number.replace(/-/g, '') : '';
      let whatsapp_number = att.whatsapp_number;
      if (whatsapp_number && !whatsapp_number.startsWith('+')) {
        whatsapp_number = '+' + whatsapp_number;
      }
      return { ...att, cnic_number, whatsapp_number };
    });
    const payload = {
      ticket_type: selectedTicketType!,
      referral: selectedReferral,
      attendees: attendeesWithFiles,
      primary_attendee_index: primaryAttendee
    };
    // Use FormData for file uploads
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
        } else {
          formData.append(`attendees[${idx}][${key}]`, value as any);
        }
      });
    });
    try {
      const response = await fetch(API_REGISTER, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' }, // Remove this line for FormData
        body: formData
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Registration failed');
      } else {
        setSuccess('Registration successful! Check your email for confirmation.');
        setStep(1);
        setSelectedTicketType(null);
        setAttendees([]);
        setPrimaryAttendee(0);
        setSelectedReferral(null);
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <RegistrationHeader />
        <CardContent className="flex flex-col items-center">
          {step === 1 && (
            <RegistrationTicketType
              ticketTypes={ticketTypes}
              selectedTicketType={selectedTicketType}
              handleTicketTypeSelect={handleTicketTypeSelect}
            />
          )}
          {step === 2 && (
            <RegistrationForm
              attendees={attendees}
              errors={errors}
              genders={genders}
              referrals={referrals}
              selectedReferral={selectedReferral}
              handleAttendeeChange={handleAttendeeChange}
              handleCNICChange={handleCNICChange}
              handleReferralChange={handleReferralChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              primaryAttendee={primaryAttendee}
              setPrimaryAttendee={setPrimaryAttendee}
              stepBack={() => setStep(1)}
            />
          )}
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
  )
} 

export default Registration;