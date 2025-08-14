import single from '@assets/type/single.svg'
import couple from '@assets/type/couple.svg'
import './type.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useMemo, useRef } from 'react'
import { gsap } from 'gsap'

const Type = () => {
    const {state, dispatch} = useRegistrationContext();
    const {ticketType} = useMemo(() => {
        return state;
    }, [state]);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleTicketTypeChange = (type: 'couple' | 'single') => {
        if (!containerRef.current) return;
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                dispatch({type: 'SET_TICKET_TYPE', ticketType: type});
                dispatch({type: 'SET_STEP_NUMBER', stepNumber: 2});
            }
        });
    }
  return (
    <div className="t-container" ref={containerRef}>
        <div className="t-header">
            <div className="t-heading">
                <h1>SELECT THE TYPE OF PASS</h1>
            </div>
            <div className="t-desc">
                <p>
                Select below the type of pass you are eligible for/want for yourself
                </p>
            </div>
        </div>
        <div className="t-wrapper">
            <div className="l-box" onClick={() => handleTicketTypeChange('single')} style={{cursor:'pointer'}}>
                <div className="center">
                    <div className="icon">
                        <img src={single} alt="" />
                    </div>
                    <div className="text">
                        <p>Single Pass</p>
                    </div>
                </div>
                <div className="bottom">
                    <p>PKR8000</p>
                </div>
            </div>
            <div className="r-box" onClick={() => handleTicketTypeChange('couple')} style={{cursor:'pointer'}}>
                <div className="center">
                    <div className="icon">
                        <img src={couple} alt="" />
                    </div>
                    <div className="text">
                        <p>Couple Pass</p>
                    </div>
                </div>
                <div className="bottom">
                    <p>PKR16000</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Type