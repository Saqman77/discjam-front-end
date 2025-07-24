import single from '@assets/type/single.svg'
import couple from '@assets/type/couple.svg'
const Type = () => {
  return (
    <div className="t-container">
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
            <div className="l-box">
                <div className="center">
                    <div className="icon">
                        <img src={single} alt="" />
                    </div>
                    <div className="text">
                        <p>single</p>
                    </div>
                </div>
                <div className="bottom">
                    <p>PKR8000</p>
                </div>
            </div>
            <div className="r-box">
                <div className="center">
                    <div className="icon">
                        <img src={couple} alt="" />
                    </div>
                    <div className="text">
                        <p>couple</p>
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