import React from 'react';
import { Button } from '@uikit/button';
import { Input } from '@uikit/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@uikit/select';
import { Users, ArrowLeft, ArrowRight, Loader2, IdCard, Venus, Instagram, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface Attendee {
  first_name: string;
  last_name: string;
  cnic_number: string;
  gender: number;
  instagram_url?: string;
  cnic_front: string | File;
  email: string;
  whatsapp_number: string;
}

interface Gender { id: number; name: string; }
interface Referral { id: number; first_name: string; last_name: string; }

interface RegistrationFormProps {
  attendees: Attendee[];
  errors: { [key: string]: string };
  genders: Gender[];
  referrals: Referral[];
  selectedReferral: number | null;
  handleAttendeeChange: (idx: number, field: keyof Attendee, value: string | number | File) => void;
  handleCNICChange: (idx: number, value: string) => void;
  handleReferralChange: (id: number | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  primaryAttendee: number;
  setPrimaryAttendee: (idx: number) => void;
  stepBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  attendees,
  errors,
  genders,
  referrals,
  selectedReferral,
  handleAttendeeChange,
  handleCNICChange,
  handleReferralChange,
  handleSubmit,
  isSubmitting,
  primaryAttendee,
  setPrimaryAttendee,
  stepBack,
}) => (
  <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
      <Users className="w-6 h-6" /> Step 2: Attendee Details
    </h2>
    {attendees.map((att, idx) => (
      <div key={idx} className="border p-4 rounded mb-2">
        {attendees.length === 2 && (
          <div className="mb-2 text-base font-semibold text-blue-700">Attendee {idx + 1}</div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              First Name
            </label>
            <Input placeholder="First Name" value={att.first_name} onChange={e => handleAttendeeChange(idx, 'first_name', e.target.value)} required />
            {errors[`first_name_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`first_name_${idx}`]}</span>}
          </div>
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Last Name
            </label>
            <Input placeholder="Last Name" value={att.last_name} onChange={e => handleAttendeeChange(idx, 'last_name', e.target.value)} required />
            {errors[`last_name_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`last_name_${idx}`]}</span>}
          </div>
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              CNIC Number
            </label>
            <Input
              placeholder="CNIC Number"
              value={att.cnic_number}
              onChange={e => handleCNICChange(idx, e.target.value)}
              required
              maxLength={15}
            />
            {errors[`cnic_number_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`cnic_number_${idx}`]}</span>}
          </div>
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Gender
            </label>
            <Select value={att.gender ? String(att.gender) : 'none'} onValueChange={v => handleAttendeeChange(idx, 'gender', v !== 'none' ? Number(v) : 0)}>
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
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Instagram URL
            </label>
            <Input placeholder="Instagram URL" value={att.instagram_url} onChange={e => handleAttendeeChange(idx, 'instagram_url', e.target.value)} />
          </div>
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Email
            </label>
            <Input
              placeholder="Email"
              value={att.email}
              onChange={e => handleAttendeeChange(idx, 'email', e.target.value)}
              required
              type="email"
            />
            {errors[`email_${idx}`] && <span className="text-xs text-red-600 mt-1">{errors[`email_${idx}`]}</span>}
          </div>
          <div className="col-span-1 flex flex-col">
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              WhatsApp Number
            </label>
            <div className="w-full rounded border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <PhoneInput
                country={'pk'}
                value={att.whatsapp_number}
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
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              CNIC Front (Image)
            </label>
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
          {attendees[0].first_name || 'Attendee 1'}
        </Button>
        <Button
          type="button"
          variant={primaryAttendee === 1 ? 'default' : 'outline'}
          onClick={() => setPrimaryAttendee(1)}
          className="flex-1"
        >
          {attendees[1].first_name || 'Attendee 2'}
        </Button>
      </div>
    )}
    <div className="mb-2">
      <label className="block mb-1">Who referred you?</label>
      <Select
        value={selectedReferral !== null ? String(selectedReferral) : 'none'}
        onValueChange={v => handleReferralChange(v !== 'none' ? Number(v) : null)}
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
    <div className="flex gap-2 justify-between">
      <Button type="button" variant="outline" onClick={stepBack} disabled={isSubmitting}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : (<><ArrowRight className="w-4 h-4 mr-1" />Submit Registration</>)}
      </Button>
    </div>
  </form>
);

export default RegistrationForm; 