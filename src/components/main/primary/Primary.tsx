import single from '@assets/type/single.svg'
// import couple from '@assets/type/couple.svg'
import './primary.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useMemo } from 'react'

const Primary = () => {
    const {state, dispatch} = useRegistrationContext();
    const {ticketType} = useMemo(() => {
        return state;
    }, [state]);

    const handleTicketTypeChange = (ticketType: 'couple' | 'single') => {
        dispatch({type: 'SET_TICKET_TYPE', ticketType: ticketType})
    }
  return (
    <div className="p-container">
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
            <div className="l-box">
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
            <div className="r-box">
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