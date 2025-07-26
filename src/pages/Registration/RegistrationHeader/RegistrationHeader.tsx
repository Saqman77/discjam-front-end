import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@uikit/card';
import { Users } from 'lucide-react';

const RegistrationHeader: React.FC = () => (
  <CardHeader className="text-center">
    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
      <Users className="w-8 h-8" /> Event Registration
    </CardTitle>
    <CardDescription>
      Register for the event in two easy steps
    </CardDescription>
  </CardHeader>
);

export default RegistrationHeader; 