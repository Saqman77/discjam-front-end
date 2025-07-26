import React from 'react';
import './proof-submission-details.scss';

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
  <div className="proof-submission-details">
    <div className="detail-item"><strong>Ticket Type:</strong> {registration.ticket_type}</div>
    <div className="detail-item"><strong>Status:</strong> {registration.status}</div>
    <div className="detail-item"><strong>Registration Date:</strong> {registration.registration_date}</div>
    {registration.referral && <div className="detail-item"><strong>Referral:</strong> {registration.referral}</div>}
    <div className="attendees-section">
      <strong>Attendees:</strong>
      <ul className="attendees-list">
        {registration.attendees.map(a => (
          <li key={a.id} className="attendee-item">
            {a.first_name} {a.last_name} ({a.email}){a.is_primary ? ' [Primary]' : ''}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProofSubmissionDetails; 