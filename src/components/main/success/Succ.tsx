import succ from '@assets/succ/succ.svg'
import booboo from '@assets/succ/booboo.svg'
import { useState } from 'react'
import './succ.scss'
const Succ = () => {
const [glug, setglug] = useState(false) 
    const gluger = ()=>{
        if(!glug){
            setglug(false)
        }
    }
  return (
    <div className='succ-container'>
        <div className="succ-wrapper">
            <div className="text">
                <h5>{glug? 'You’re form is successfully submitted':'There was an error please re-submit your form'}</h5>
                <p>{glug? 'we have received your submission, we will contact you once your verification is complete':'to enter please re-submit your form'}</p>
            </div>
            <div className={glug ? 'circ' : 'circ boobooer'}>
                <img src={glug ? succ : booboo} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Succ