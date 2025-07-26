import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@uikit/card';

interface ProofSubmissionHeaderProps {
  registrationId: string | number;
}

const ProofSubmissionHeader: React.FC<ProofSubmissionHeaderProps> = ({ registrationId }) => (
  <CardHeader>
    <CardTitle>Submit Payment Proof</CardTitle>
    <CardDescription>
      Registration ID: <span className="font-mono">{registrationId}</span>
    </CardDescription>
  </CardHeader>
);

export default ProofSubmissionHeader; 