import type { TicketType, Referral, Gender, RegistrationAttendee } from '../../types/api';

export interface RegistrationState {
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

export type RegistrationAction =
  | { type: 'SET_STEP_NUMBER'; stepNumber: number }
  | { type: 'SET_TICKET_TYPE'; ticketType: 'single' | 'couple' }
  | { type: 'SET_TICKET_TYPES'; ticketTypes: TicketType[] }

  | { type: 'SET_GENDERS'; genders: Gender[] }
  | { type: 'UPDATE_ATTENDEE'; index: number; field: keyof RegistrationAttendee; value: string | number | File }
  | { type: 'SET_REFERRAL'; referral: string }
  | { type: 'SET_PRIMARY_ATTENDEE'; index: number }
  | { type: 'SET_ERRORS'; errors: { [key: string]: string } }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_SUCCESS'; success: string | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'INIT' };

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
  isLoading: false,
};

export const registrationReducer = (state: RegistrationState, action: RegistrationAction): RegistrationState => {
  switch (action.type) {
    case 'SET_STEP_NUMBER':
      return {
        ...state,
        step: action.stepNumber,
      };

      case 'SET_TICKET_TYPE': {
        const blankAttendee = {
          first_name: '',
          last_name: '',
          cnic_number: '',
          gender: 0,
          instagram_url: '',
          cnic_front: '',
          email: '',
          whatsapp_number: ''
        };
      
        let newAttendeesInfo: RegistrationAttendee[] = [];
      
        if (action.ticketType === 'couple') {
          newAttendeesInfo = [blankAttendee, blankAttendee];
        } else {
          newAttendeesInfo = [blankAttendee];
        }
      
        return {
          ...state,
          ticketType: action.ticketType,
          attendees: newAttendeesInfo,
          step: 2,
        };
      }

    case 'SET_TICKET_TYPES':
      return {
        ...state,
        ticketTypes: action.ticketTypes,
      };



    case 'SET_GENDERS':
      return {
        ...state,
        genders: action.genders,
      };

    case 'UPDATE_ATTENDEE':
      return {
        ...state,
        attendees: state.attendees.map((attendee, index) =>
          index === action.index
            ? { ...attendee, [action.field]: action.value }
            : attendee
        ),
      };

    case 'SET_REFERRAL':
      return {
        ...state,
        referralText: action.referral,
      };

    case 'SET_PRIMARY_ATTENDEE':
      return {
        ...state,
        primaryAttendeeIndex: action.index,
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };

    case 'SET_SUCCESS':
      return {
        ...state,
        success: action.success,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'INIT':
      return initialState;

    default:
      return state;
  }
};