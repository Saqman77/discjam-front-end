import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { registrationReducer } from './RegistrationReducer';
import type { TicketType, Referral, Gender, RegistrationAttendee } from '@api/api';

// Use proxy in development, direct URLs in production
const isDev = import.meta.env.DEV;
const baseUrl = isDev ? '' : 'https://discjam-event-management-system.onrender.com';

const API_REGISTER = `${baseUrl}/api/register/`;
const API_TICKET_TYPES = `${baseUrl}/api/ticket-types/`;
const API_GENDERS = `${baseUrl}/api/genders/`;

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^\+\d{9,15}$/;

interface RegistrationState {
  step: number;
  ticketType: 'single' | 'couple' | null;
  attendees: RegistrationAttendee[];
  primaryAttendeeIndex: number;
  referralText: string;
  ticketTypes: TicketType[];

  genders: Gender[];
  errors: { [key: string]: string };
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  isLoading: boolean;
}

const initialState: RegistrationState = {
  step: 1,
  ticketType: null,
  attendees: [],
  primaryAttendeeIndex: 0,
  referralText: '',
  ticketTypes: [],
  genders: [],
  errors: {},
  isSubmitting: false,
  error: null,
  success: null,
  isLoading: true,
};

interface RegistrationContextType {
  state: RegistrationState;
  dispatch: React.Dispatch<any>;
  handleAttendeeChange: (idx: number, field: keyof RegistrationAttendee, value: string | number | File) => void;
  handleCNICChange: (idx: number, value: string) => void;
  handleReferralChange: (text: string) => void;
  validateAttendees: () => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  formatCNIC: (value: string) => string;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  // Fetch API data on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    
    fetch(API_TICKET_TYPES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json().catch(() => ({}));
      })
      .then(data => dispatch({ type: 'SET_TICKET_TYPES', ticketTypes: data.ticket_types || data }))
      .catch(error => {
        console.error('Error fetching ticket types:', error);
        // Set default ticket types if API fails
        const defaultTicketTypes = [
          { id: 1, name: 'Single', price: 1000 },
          { id: 2, name: 'Couple', price: 1800 }
        ];
        dispatch({ type: 'SET_TICKET_TYPES', ticketTypes: defaultTicketTypes });
      });
    

    
    fetch(API_GENDERS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json().catch(() => ({}));
      })
      .then(data => {
        const genders = data.genders || data;
        dispatch({ type: 'SET_GENDERS', genders });
      })
      .catch(error => {
        console.error('Error fetching genders:', error);
        // Set default genders if API fails
        const defaultGenders = [
          { id: 1, name: 'Male' },
          { id: 2, name: 'Female' },
          { id: 3, name: 'Other' }
        ];
        dispatch({ type: 'SET_GENDERS', genders: defaultGenders });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      });
  }, []);

  const formatCNIC = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const handleAttendeeChange = (idx: number, field: keyof RegistrationAttendee, value: string | number | File) => {
    dispatch({ type: 'UPDATE_ATTENDEE', index: idx, field, value });
  };

  const handleCNICChange = (idx: number, value: string) => {
    const formatted = formatCNIC(value);
    handleAttendeeChange(idx, 'cnic_number', formatted);
  };

  const handleReferralChange = (text: string) => {
    dispatch({ type: 'SET_REFERRAL', referral: text });
  };

  const validateAttendees = () => {
    const newErrors: { [key: string]: string } = {};
    state.attendees.forEach((att, idx) => {
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
    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    dispatch({ type: 'SET_ERROR', error: null });
    dispatch({ type: 'SET_SUCCESS', success: null });
    
    try {
      // Validate attendees first
      if (!validateAttendees()) {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
        return;
      }

      // Sanitize attendees data - remove dashes from CNIC and format WhatsApp numbers
      const attendeesWithFiles = state.attendees.map(att => {
        // Remove dashes from CNIC number before sending
        const cnic_number = att.cnic_number ? att.cnic_number.replace(/-/g, '') : '';
        let whatsapp_number = att.whatsapp_number;
        if (whatsapp_number && !whatsapp_number.startsWith('+')) {
          whatsapp_number = '+' + whatsapp_number;
        }
        return { ...att, cnic_number, whatsapp_number };
      });

      const formData = new FormData();
      
      // Add ticket type (find the actual ticket type ID)
      const ticketTypeObj = state.ticketTypes.find(t => 
        t.name.toLowerCase().includes(state.ticketType || '')
      );
      if (ticketTypeObj) {
        formData.append('ticket_type', ticketTypeObj.id.toString());
      } else {
        formData.append('ticket_type', state.ticketType || '');
      }
      
      // Add referral if provided
      if (state.referralText && state.referralText.trim()) {
        formData.append('referral', state.referralText.trim());
      }
      
      // Add primary attendee index for all ticket types
      formData.append('primary_attendee_index', state.primaryAttendeeIndex.toString());
      
      // Add attendees data using the sanitized data
      attendeesWithFiles.forEach((attendee, index) => {
        Object.entries(attendee).forEach(([key, value]) => {
          if (key === 'cnic_front' && value instanceof File) {
            formData.append(`attendees[${index}][${key}]`, value);
          } else {
            formData.append(`attendees[${index}][${key}]`, value as any);
          }
        });
      });

      // Ensure we have attendees data
      if (state.attendees.length === 0) {
        throw new Error('No attendees data available');
      }

      const response = await fetch(API_REGISTER, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message === 'Registration successful.') {
        dispatch({ type: 'SET_SUCCESS', success: 'Registration submitted successfully!' });
      } else {
        throw new Error(data.error || data.message || 'Registration failed');
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific backend errors
      if (error.message?.includes('Redis') || error.message?.includes('ConnectionError')) {
        dispatch({ 
          type: 'SET_ERROR', 
          error: 'Server is temporarily unavailable. Please try again in a few minutes.' 
        });
      } else if (error.message?.includes('Server error: 500')) {
        dispatch({ 
          type: 'SET_ERROR', 
          error: 'Server error occurred. Please try again later.' 
        });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          error: error.message || 'An unexpected error occurred. Please try again.' 
        });
      }
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  const value: RegistrationContextType = {
    state,
    dispatch,
    handleAttendeeChange,
    handleCNICChange,
    handleReferralChange,
    validateAttendees,
    handleSubmit,
    formatCNIC,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistrationContext must be used within a RegistrationProvider');
  }
  return context;
};