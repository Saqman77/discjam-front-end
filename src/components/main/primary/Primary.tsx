import single from '@assets/type/single.svg'
// import couple from '@assets/type/couple.svg'
import './primary.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useMemo } from 'react'
import { useRef } from 'react'
import { gsap } from 'gsap'

const Primary = () => {
    const { state, dispatch } = useRegistrationContext();
    const { ticketType, attendees } = useMemo(() => {
        return state;
    }, [state]);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleSelect = (idx: number) => {
        if (!containerRef.current) return;
        
        // Set primary attendee
        dispatch({ type: 'SET_PRIMARY_ATTENDEE', index: idx });
        
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                dispatch({ type: 'SET_STEP_NUMBER', stepNumber: 4 });
            }
        });
    }

    return (
        <div className="p-container" ref={containerRef}>
            <div className="t-header">
                <div className="t-heading">
                    <h1>SELECT PRIMARY ATTENDEE</h1>
                </div>
                <div className="t-desc">
                    <p>Choose who will be the primary contact for this registration</p>
                </div>
            </div>
            <div className="t-wrapper">
                {attendees.map((attendee, idx) => (
                    <div 
                        key={idx} 
                        className="l-box" 
                        onClick={() => handleSelect(idx)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="center">
                            <div className="icon">
                                <img src={single} alt="" />
                            </div>
                            <div className="text">
                                <p>{attendee.first_name || `Attendee ${idx + 1}`}</p>
                            </div>
                        </div>
                        {/* <div className="bottom">
                            <p>{attendee.first_name && attendee.last_name ? `${attendee.first_name} ${attendee.last_name}` : `ATTENDEE ${idx + 1}`}</p>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Primary