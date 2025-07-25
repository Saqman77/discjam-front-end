import * as React from 'react';
import mail from '@assets/form/mail.svg'
import insta from '@assets/form/instagram.svg'
import name from '@assets/form/name.svg'
import nic from '@assets/form/nic.svg'
import phone from '@assets/form/phone.svg'
import './form.scss'

const Form = () => {
    const [uploadState, setUploadState] = React.useState<'idle' | 'success' | 'reupload'>('idle');
    const [fileName, setFileName] = React.useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setUploadState('success');
        }
    };

    const handleReupload = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        setUploadState('reupload');
        setFileName(null);
    };

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

                            <span>06th Jan 2024</span>
                            <span>Location: To the ticket holders only</span>
                            <span className='space'></span>

                            <span>Before filling this form please note:</span>
                            <span className='space'></span>
                            <span>Filling out this registration form does not guarantee you a ticket/entry.</span>
                            <span>You must be over 18 with a valid CNIC / Passport / ID</span>
                            <span>CNIC / Passport / ID numbers are mandatory for every attendee.</span>
                            <span>If you are registering for a couple's ticket, you must enter together.</span>
                            <span>Forms with incomplete information will not be entertained.</span>
                            <span>Once you've filled out & submitted the form with your correct email & contact information, please wait and you'll hear back from us via email.</span>
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
                                    <input type="text" placeholder='First name (important*)' />
                                    <img src={name} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='Last name (important*)' />
                                    <img src={name} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='valid email (important*)' />
                                    <img src={mail} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='CNIC-number (important*)' />
                                    <img src={nic} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='whatsapp phone (important*)' />
                                    <img src={phone} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='instagram url (important*)' />
                                    <img src={insta} alt="" />
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder='reference (optional)' />
                                    <img src={name} alt="" />
                                </div>
                            </div>
                            {/* Gender Dropdown Start */}
                            <div className="input-wrapper">
                                <select className="gender-select" defaultValue="" required>
                                    <option value="" disabled>Select gender (important*)</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {/* Gender Dropdown End */}
                            <div className='up-wrapper'>
                                <p>Upload the front of your CNIC</p>
                                <div className="cnic-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="cnic-upload"
                                        onChange={handleFileChange}
                                        key={fileName || ''} // reset input on reupload
                                    />
                                    {uploadState === 'idle' && (
                                        <label htmlFor="cnic-upload" className="upload-label">Upload CNIC</label>
                                    )}
                                    {uploadState === 'success' && (
                                        <div className="upload-label-row">
                                            <label htmlFor="cnic-upload" className="upload-label success">Uploaded! {fileName}</label>
                                            <label htmlFor="cnic-upload" className="upload-label reupload" onClick={handleReupload}>Re-upload</label>
                                        </div>
                                    )}
                                    {uploadState === 'reupload' && (
                                        <label htmlFor="cnic-upload" className="upload-label">Upload CNIC</label>
                                    )}
                                </div>
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
    )
}

export default Form