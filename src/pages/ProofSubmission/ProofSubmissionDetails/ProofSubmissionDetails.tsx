import React from 'react';

interface Attendee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_primary: boolean;
}

interface Registration {
  id: number;
  ticket_type: string;
  status: string;
  registration_date: string;
  referral: string | null;
  attendees: Attendee[];
}

interface ProofSubmissionDetailsProps {
  registration: Registration;
}

const ProofSubmissionDetails: React.FC<ProofSubmissionDetailsProps> = ({ registration }) => (
  <div className="mb-4">
    <div><b>Ticket Type:</b> {registration.ticket_type}</div>
    <div><b>Status:</b> {registration.status}</div>
    <div><b>Registration Date:</b> {registration.registration_date}</div>
    {registration.referral && <div><b>Referral:</b> {registration.referral}</div>}
    <div className="mt-2">
      <b>Attendees:</b>
      <ul className="list-disc ml-6">
        {registration.attendees.map(a => (
          <li key={a.id}>
            {a.first_name} {a.last_name} ({a.email}){a.is_primary ? ' [Primary]' : ''}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProofSubmissionDetails; 