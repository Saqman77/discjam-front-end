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
  return (
    <div className="t-container" ref={containerRef}>
        <div className="t-header">
            <div className="t-heading">
                <h1>See you at the event!</h1>
            </div>
            <div className="t-desc">
                <p>
                Sorry the ticketing portal is now closed.
                </p>
            </div>
        </div>
        <div className="t-wrapper">
            <div className="l-box">
                <div className="center">
                    <div className="icon">
                        <img src={single} alt="" />
                    </div>
                    <div className="text">
                        <p>Single Pass</p>
                    </div>
                </div>
                <div className="bottom">
                    <p>Sold Out</p>
                </div>
            </div>
            <div className="r-box">
                <div className="center">
                    <div className="icon">
                        <img src={couple} alt="" />
                    </div>
                    <div className="text">
                        <p>Couple Pass</p>
                    </div>
                </div>
                <div className="bottom">
                    <p>Sold Out</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Type