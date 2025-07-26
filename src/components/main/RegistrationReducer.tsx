export interface Attendee {
    firstName?: string;
    lastName?: string;
    gender?: 'female' | 'male' | 'others';
    cnicNumber?: number;
    email?: string;
    hasAttendedDiscJam?: boolean;
    whatsappNumber?: number;
    cnicFrontImg?: string;
    instagramUrl?: string;
}

export interface RegistrationContext {
    step: number;
    ticketType: 'couple' | 'single';
    referenceName?: number;
    attendees: Attendee[];
    primaryAttendeeIndex: number;
}

export type RegistrationAction = 
    | {
        type: 'SET_STEP_NUMBER',
        stepNumber: number,
    } 
    | {
        type: 'SET_TICKET_TYPE',
        ticketType: 'couple' | 'single',
    }
    | { type: 'INIT' };

export function registrationInitializer (): RegistrationContext {
    const initialData: RegistrationContext = {
        step: 1,
        ticketType: "single",
        attendees: [{}],
        primaryAttendeeIndex: 0,
    }
    return initialData;
}

export function registrationReducer(
    state: RegistrationContext,
    action: RegistrationAction
): RegistrationContext {
    switch (action.type) {
        case 'SET_STEP_NUMBER': {
            return {
                ...state,
                step: action.stepNumber,
            }
        } 
        case 'SET_TICKET_TYPE': {
            const newAttendeesInfo = [];
            if (action.ticketType === 'couple') {
                state.attendees.forEach((attendee) => newAttendeesInfo.push(attendee));
                if (state.ticketType === 'single') {
                    newAttendeesInfo.push({});
                }
            } else {
                newAttendeesInfo.push(state.attendees[0])
            }
            return {
                ...state,
                ticketType: action.ticketType,
                attendees: newAttendeesInfo,
            }
        }
        case 'INIT': {
            return registrationInitializer();
        }
        default:
            return state;
    }
}