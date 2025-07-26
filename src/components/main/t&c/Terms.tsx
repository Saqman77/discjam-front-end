
import * as React from 'react';
import './terms.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useRef } from 'react'
import { gsap } from 'gsap'

interface TermsProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const Terms = ({ onSubmit }: TermsProps) => {
    const { state } = useRegistrationContext();
    const [isChecked, setIsChecked] = React.useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChecked) {
            alert('Please accept the terms and conditions');
            return;
        }
        
        if (!formRef.current) return;
        
        // Call the onSubmit prop from parent component
        await onSubmit(e);
    };

    return (
        <div className="tc-container" ref={formRef}>
            <div className="terms">
                <div className="heading">
                    <h4>TERMS & CONDITIONS</h4>
                </div>
                <div className="desc">
                <p>
                {'As collectives we function on inclusivity & work tirelessly towards making our events a safe space for everyone. This includes (but is not limited to) a zero tolerance policy towards any form of harassment, discrimination, sexism, violence and anything nonconsensual including documentation (for example: photography or video)'}
                </p>
                <span className='space'></span>
                <p>
                    {'By submitting this form, you agree to our safe space policies and understand that violating any of these terms will result in you being removed from the event and banned from future events.'}
                </p>
            </div>
                <form onSubmit={handleSubmitForm}>
                    <div className="agree">
                      <label className="checkbox-container">
                        <input 
                            type="checkbox"
                            className="circular-checkbox"
                            id="terms-checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            required
                        />
                        <span className="checkmark"></span>
                        <span className="agree-text">I agree</span>
                      </label>
                    </div>
                    <button type="submit" className="submit-button" disabled={state.isSubmitting || !isChecked}>
                        {state.isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Terms