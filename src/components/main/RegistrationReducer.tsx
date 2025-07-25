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
        ticketType: string,
    };

export function RegistrationInitializer (): RegistrationContext {
    const initialData: RegistrationContext = {
        step: 1,
        ticketType: "single",
        attendees: [],
        primaryAttendeeIndex: 0,
    }
    return initialData;
}

export function registrationReducer(
    state: RegistrationContext,
    action: RegistrationAction
): RegistrationContext {
    switch (action.type) {
        default:
            return state;
    }
}