import React from 'react';
import '@styles/proof-submission-header.scss';

interface ProofSubmissionHeaderProps {
  registrationId: string | number;
}

const ProofSubmissionHeader: React.FC<ProofSubmissionHeaderProps> = ({ registrationId }) => (
  <div className="proof-submission-header">
    <h2 className="proof-submission-header-title">Submit Payment Proof</h2>
    <p className="proof-submission-header-description">
      Registration ID: <span className="registration-id">{registrationId}</span>
    </p>
  </div>
);

export default ProofSubmissionHeader; 