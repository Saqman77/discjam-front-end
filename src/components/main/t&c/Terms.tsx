
import { useState } from 'react'
import './terms.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useRef } from 'react'
import { gsap } from 'gsap'

const Terms = () => {
  const [isChecked, setIsChecked] = useState(false)
  const { dispatch } = useRegistrationContext();
  const termsRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsRef.current) return;
    gsap.to(termsRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        dispatch({ type: 'SET_STEP_NUMBER', stepNumber: 5 });
      }
    });
  }

  return (
    <div className='tc-container' ref={termsRef}>
        <div className="terms">
            <div className="heading">
                <h4>TERMS AND CONDITIONS</h4>
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
            <form onSubmit={handleSubmit}>
              <div className="agree">
                  <label className="checkbox-container">
                      <input 
                          type="checkbox" 
                          className="circular-checkbox" 
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                      />
                      <span className="checkmark"></span>
                      <span className="agree-text">I agree</span>
                  </label>
              </div>
              <div className="submit-row">
                  <button className={`submit ${!isChecked ? 'disabled' : ''}`} type="submit" disabled={!isChecked}>
                      submit
                  </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default Terms