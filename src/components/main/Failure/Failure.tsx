import succ from '@assets/succ/succ.svg'
import booboo from '@assets/succ/booboo.svg'
import './succ.scss'

interface SuccessProps {
  isSuccess: boolean;
  onRetry?: () => void;
}

const Failure = ({ isSuccess, onRetry }: SuccessProps) => {
  return (
    <div className='succ-container'>
        <div className="succ-wrapper">
            <div className={'circ boobooer'}>
                <img src={booboo} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Failure