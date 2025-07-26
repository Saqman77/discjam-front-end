import React, { RefObject } from 'react';
import { Button } from '@uikit/button';

interface ProofSubmissionFormProps {
  inputRef: RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  success: string | null;
  error: string | null;
}

const ProofSubmissionForm: React.FC<ProofSubmissionFormProps> = ({
  inputRef,
  isSubmitting,
  handleFileChange,
  handleSubmit,
  success,
  error,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <input type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
    <Button type="submit" disabled={isSubmitting} className="w-full">
      {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
    </Button>
    {success && <div className="text-green-600 text-center">{success}</div>}
    {error && <div className="text-red-600 text-center">{error}</div>}
  </form>
);

export default ProofSubmissionForm; 