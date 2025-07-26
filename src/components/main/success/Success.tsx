import succ from '@assets/succ/succ.svg'
import booboo from '@assets/succ/booboo.svg'
import './succ.scss'
import { useRegistrationContext } from '../RegistrationContext';
import { useMemo } from 'react';

const Success = () => {
  const { state, dispatch } = useRegistrationContext();
  const { success, error } = useMemo(() => {
    return state;
  }, [state]);
  return (
    <div className='succ-container'>
        <div className="succ-wrapper">
            <div className="text">
              {success && <h5>Your form is successfully submitted</h5>}
              {error && <h5>There was an error</h5>}
              {success && <p>we have received your submission, we will contact you once your verification is complete</p>}
              {error && <p>{error}</p>}
            </div>
            <div className={success ? 'circ' : 'circ boobooer'}>
                <img src={success ? succ : booboo} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Success