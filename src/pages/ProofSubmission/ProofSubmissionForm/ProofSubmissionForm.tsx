import React, { RefObject } from 'react';
import '@styles/proof-submission-form.scss';

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
  <form onSubmit={handleSubmit} className="proof-submission-form">
    <input type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} className="file-input" />
    <button type="submit" disabled={isSubmitting} className="submit-button">
      {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
    </button>
    {success && <div className="success-message">{success}</div>}
    {error && <div className="error-message">{error}</div>}
  </form>
);

export default ProofSubmissionForm; 