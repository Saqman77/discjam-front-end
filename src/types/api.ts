export interface Attendee {
  id: number
  first_name: string
  last_name: string
  cnic_number: string
  gender: number
  instagram_url?: string
  cnic_front: File | string
  email: string
  whatsapp_number: string
  is_primary: boolean
}

export interface TicketType {
  id: number
  name: string
}

export interface Referral {
  id: number
  first_name: string
  last_name: string
}

export interface Gender {
  id: number
  name: string
}

export interface RegistrationAttendee {
  first_name: string
  last_name: string
  cnic_number: string
  gender: number
  instagram_url?: string
  cnic_front: File | string
  email: string
  whatsapp_number: string
}

export interface RegistrationRequest {
  ticket_type: number
  referral?: number | null
  attendees: RegistrationAttendee[]
  primary_attendee_index: number
}

export interface RegistrationResponse {
  message: string
}

export interface SendTicketRequest {
  attendee_id: number
}

export interface SendTicketResponse {
  message: string
  attendee: Attendee
}

export interface ApiError {
  error: string
  details?: Record<string, any>
} 
export interface RegistrationDetail {
  id: number
  ticket_type: string
  status: string
  registration_date: string
  payment_proof: string | null
  referral: string | null
  attendees: Attendee[]
}