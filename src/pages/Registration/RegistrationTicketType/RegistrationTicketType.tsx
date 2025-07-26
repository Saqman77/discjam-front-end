import React from 'react';
import { Button } from '@uikit/button';
import { Users, User } from 'lucide-react';
import type { TicketType } from '../../../types/api';

interface RegistrationTicketTypeProps {
  ticketTypes: TicketType[];
  selectedTicketType: number | null;
  handleTicketTypeSelect: (id: number) => void;
}

const RegistrationTicketType: React.FC<RegistrationTicketTypeProps> = ({ ticketTypes, selectedTicketType, handleTicketTypeSelect }) => (
  <div className="space-y-6 w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
      <User className="w-6 h-6" /> Step 1: Select Ticket Type
    </h2>
    <div className="flex gap-4 justify-center">
      {ticketTypes.map(type => (
        <Button
          key={type.id}
          variant={selectedTicketType === type.id ? 'default' : 'outline'}
          className={`flex flex-col items-center gap-2 py-8 px-8 min-w-[10rem] min-h-[10rem] text-lg font-semibold border-2 ${selectedTicketType === type.id ? 'border-blue-600' : 'border-gray-300'}`}
          onClick={() => handleTicketTypeSelect(type.id)}
        >
          {type.name.toLowerCase().includes('couple') ? (
            <Users className="w-10 h-10 mb-2 text-blue-600" />
          ) : (
            <User className="w-10 h-10 mb-2 text-purple-600" />
          )}
          {type.name}
          <span className="text-xs text-muted-foreground mt-2">
            {type.name.toLowerCase().includes('couple') ? 'Register for two attendees' : 'Register for one attendee'}
          </span>
        </Button>
      ))}
    </div>
  </div>
);

export default RegistrationTicketType; 