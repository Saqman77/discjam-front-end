
import { useState } from 'react'
import './terms.scss'

const Terms = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }

  return (
    <div className='tc-container'>
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
                <button className={`submit ${!isChecked ? 'disabled' : ''}`}>
                    submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default Terms