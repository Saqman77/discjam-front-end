import './form.scss'

const Form = () => {
    return (
        <div className="f-container">
            <div className="f-wrapper">
                <div className="l-content">
                    <div className="heading">
                        <h2>
                            PLEASE ENTER THE DETAILS
                        </h2>
                    </div>
                    <div className="desc">
                        <p>
                            06th Jan 2024
                            Location: To the ticket holders only

                            Before filling this form please note:

                            - Filling out this registration form does not guarantee you a ticket/entry.
                            - You must be over 18 with a valid CNIC / Passport / ID
                            - CNIC / Passport / ID numbers are mandatory for every attendee.
                            - If you are registering for a couple's ticket, you must enter together.
                            - Forms with incomplete information will not be entertained.
                            - Once you've filled out & submitted the form with your correct email & contact information, please wait and you'll hear back from us via email.
                        </p>
                    </div>
                </div>
                <div className="r-content">
                    <div className="form-wrapper">
                        <div className="form">
                            <div className="form-header">
                                <h3>DISC JAM 2025</h3>
                                <p>Fill down this form and press submit! we will get back to you right after you’re verified!</p>
                            </div>
                            <div className="field-wrapper">
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" />
                                    <img src="" alt="" />
                                </div>
                            </div>
                            <div className='up-wrapper'>
                                <p>Upload the front of your CNIC</p>
                                <div className="cnic-upload">
                                    <input type="image" accept="image/*" />
                                </div>
                            </div>
                        </div>
                        <div className="submit">
                            <button type="submit" className='submit-button' >
                                continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form