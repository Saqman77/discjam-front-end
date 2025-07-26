import succ from '@assets/succ/succ.svg'
import booboo from '@assets/succ/booboo.svg'
import './succ.scss'

interface SuccessProps {
  isSuccess: boolean;
  onRetry?: () => void;
}

const Success = ({ isSuccess, onRetry }: SuccessProps) => {
  return (
    <div className='succ-container'>
        <div className="succ-wrapper">
            <div className="text">
                <h5>{isSuccess ? 'Your form is successfully submitted' : 'There was an error please re-submit your form'}</h5>
                <p>{isSuccess ? 'we have received your submission, we will contact you once your verification is complete' : 'to enter please re-submit your form'}</p>
            </div>
            <div className={isSuccess ? 'circ' : 'circ boobooer'}>
                <img src={isSuccess ? succ : booboo} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Success