import * as React from 'react';
import mail from '@assets/form/mail.svg'
import insta from '@assets/form/instagram.svg'
import name from '@assets/form/name.svg'
import nic from '@assets/form/nic.svg'
import phone from '@assets/form/phone.svg'
import './form.scss'
import { useRegistrationContext } from '../RegistrationContext'
import { useRef } from 'react'
import { gsap } from 'gsap'

const Form = () => {
    const { 
        state, 
        dispatch,
        handleAttendeeChange, 
        handleCNICChange, 
        handleReferralChange
    } = useRegistrationContext();
    
    const formRef = useRef<HTMLDivElement>(null);
    const attendee = state.attendees[0] || {
        first_name: '',
        last_name: '',
        cnic_number: '',
        gender: 0,
        instagram_url: '',
        cnic_front: '',
        email: '',
        whatsapp_number: ''
    };

    // Show loading state if data is still being fetched
    if (state.isLoading) {
        return (
            <div className="f-container">
                <div className="f-wrapper">
                    <div className="l-content">
                        <div className="heading">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleAttendeeChange(0, 'cnic_front', e.target.files[0]);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;
        
        // Validate form data before proceeding
        const errors: { [key: string]: string } = {};
        
        if (!attendee.first_name) errors.first_name_0 = 'First name is required';
        if (!attendee.last_name) errors.last_name_0 = 'Last name is required';
        if (!attendee.email) errors.email_0 = 'Email is required';
        if (!attendee.cnic_number) errors.cnic_number_0 = 'CNIC number is required';
        if (!attendee.whatsapp_number) errors.whatsapp_number_0 = 'WhatsApp number is required';
        if (!attendee.gender) errors.gender_0 = 'Gender is required';
        if (!attendee.cnic_front) errors.cnic_front_0 = 'CNIC front image is required';
        
        // Update errors in context
        if (Object.keys(errors).length > 0) {
            dispatch({ type: 'SET_ERRORS', errors });
            return;
        }
        
        // Clear any existing errors
        dispatch({ type: 'SET_ERRORS', errors: {} });
        
        // Proceed to next step (Terms)
        gsap.to(formRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                dispatch({ type: 'SET_STEP_NUMBER', stepNumber: 3 });
            }
        });
    };

    return (
        <div className="f-container" ref={formRef}>
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
                            <span>If you are registering for a couple's ticket, you must enter together.</span>
                            <span>Forms with incomplete information will not be entertained.</span>
                            <span>Once you've filled out & submitted the form with your correct email & contact information, please wait and you'll hear back from us via email.</span>
                        </p>
                    </div>
                </div>
                <div className="r-content">
                    <form onSubmit={onSubmit}>
                        <div className="form-wrapper">
                            <div className="form">
                                <div className="form-header">
                                    <h3>DISC JAM 2025</h3>
                                    <p>Fill down this form and press submit! we will get back to you right after you're verified!</p>
                                </div>
                                <div className="field-wrapper">
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder='First name (important*)' 
                                            value={attendee.first_name}
                                            onChange={(e) => handleAttendeeChange(0, 'first_name', e.target.value)}
                                            required
                                        />
                                        <img src={name} alt="" />
                                        {state.errors.first_name_0 && <span className="error-text">{state.errors.first_name_0}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder='Last name (important*)' 
                                            value={attendee.last_name}
                                            onChange={(e) => handleAttendeeChange(0, 'last_name', e.target.value)}
                                            required
                                        />
                                        <img src={name} alt="" />
                                        {state.errors.last_name_0 && <span className="error-text">{state.errors.last_name_0}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input 
                                            type="email" 
                                            placeholder='valid email (important*)' 
                                            value={attendee.email}
                                            onChange={(e) => handleAttendeeChange(0, 'email', e.target.value)}
                                            required
                                        />
                                        <img src={mail} alt="" />
                                        {state.errors.email_0 && <span className="error-text">{state.errors.email_0}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder='CNIC-number (important*)' 
                                            value={attendee.cnic_number}
                                            onChange={(e) => handleCNICChange(0, e.target.value)}
                                            maxLength={15}
                                            required
                                        />
                                        <img src={nic} alt="" />
                                        {state.errors.cnic_number_0 && <span className="error-text">{state.errors.cnic_number_0}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder='whatsapp phone (important*)' 
                                            value={attendee.whatsapp_number}
                                            onChange={(e) => handleAttendeeChange(0, 'whatsapp_number', e.target.value)}
                                            required
                                        />
                                        <img src={phone} alt="" />
                                        {state.errors.whatsapp_number_0 && <span className="error-text">{state.errors.whatsapp_number_0}</span>}
                                    </div>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder='instagram url (important*)' 
                                            value={attendee.instagram_url || ''}
                                            onChange={(e) => handleAttendeeChange(0, 'instagram_url', e.target.value)}
                                        />
                                        <img src={insta} alt="" />
                                    </div>
                                    <div className="input-wrapper">
                                        <select 
                                            className="reference-select" 
                                            value={state.selectedReferral || ''} 
                                            onChange={(e) => handleReferralChange(e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">No Referral</option>
                                            {state.referrals && state.referrals.length > 0 ? (
                                                state.referrals.map(r => (
                                                    <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Loading referrals...</option>
                                            )}
                                        </select>
                                        <img src={name} alt="" />
                                    </div>
                                </div>
                                {/* Gender Dropdown Start */}
                                <div className="input-wrapper">
                                    <select 
                                        className="gender-select" 
                                        value={attendee.gender || ''} 
                                        onChange={(e) => handleAttendeeChange(0, 'gender', Number(e.target.value))}
                                        required
                                    >
                                        <option value="" disabled>Select gender (important*)</option>
                                        {state.genders && state.genders.length > 0 ? (
                                            state.genders.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>Loading genders...</option>
                                        )}
                                    </select>
                                    {state.errors.gender_0 && <span className="error-text">{state.errors.gender_0}</span>}
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
                                            required
                                        />
                                        <label htmlFor="cnic-upload" className="upload-label">
                                            {attendee.cnic_front instanceof File ? `Uploaded! ${attendee.cnic_front.name}` : 'Upload CNIC'}
                                        </label>
                                        {state.errors.cnic_front_0 && <span className="error-text">{state.errors.cnic_front_0}</span>}
                                    </div>
                                </div>
                                {state.error && (
                                    <div className="error-message">
                                        {state.error}
                                    </div>
                                )}
                                {state.success && (
                                    <div className="success-message">
                                        {state.success}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="submit">
                            <button type="submit" className='submit-button' disabled={state.isSubmitting}>
                                Continue to Terms
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Form