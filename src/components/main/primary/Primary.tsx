import single from '@assets/type/single.svg'
// import couple from '@assets/type/couple.svg'
import './primary.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useMemo } from 'react'
import { useRef } from 'react'
import { gsap } from 'gsap'

const Primary = () => {
    const {state, dispatch} = useRegistrationContext();
    const {ticketType} = useMemo(() => {
        return state;
    }, [state]);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleSelect = (idx: number) => {
        if (!containerRef.current) return;
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
                <h1>SELECT THE PRIMARY ATTENDEE</h1>
            </div>
            <div className="t-desc">
                <p>
                who should receive all the important emails
                </p>
            </div>
        </div>
        <div className="t-wrapper">
            <div className="l-box" onClick={() => handleSelect(1)} style={{cursor:'pointer'}}>
                <div className="center">
                    <div className="icon">
                        <img src={single} alt="" />
                    </div>
                    <div className="text">
                        <p>ATTENDEE - 1</p>
                    </div>
                </div>
                {/* <div className="bottom">
                    <p>PKR8000</p>
                </div> */}
            </div>
            <div className="r-box" onClick={() => handleSelect(1)} style={{cursor:'pointer'}}>
                <div className="center">
                    <div className="icon">
                        <img src={single} alt="" />
                    </div>
                    <div className="text">
                        <p>ATTENDEE - 2</p>
                    </div>
                </div>
                {/* <div className="bottom">
                    <p>PKR16000</p>
                </div> */}
            </div>
        </div>
    </div>
  )
}

export default Primary