import * as React from "react";
import mail from "@assets/form/mail.svg";
import insta from "@assets/form/instagram.svg";
import name from "@assets/form/name.svg";
import nic from "@assets/form/nic.svg";
import phone from "@assets/form/phone.svg";
import "./couple.scss";
import { useRegistrationContext } from "../RegistrationContext";
import { useRef } from "react";
import { gsap } from "gsap";

const Couple = () => {
  const {
    state,
    dispatch,
    handleAttendeeChange,
    handleCNICChange,
    handleReferralChange,
  } = useRegistrationContext();

  const formRef = useRef<HTMLDivElement>(null);

  // Show loading state if data is still being fetched
  if (state.isLoading) {
    return (
      <div className="c-container">
        <div className="c-wrapper">
          <div className="l-content">
            <div className="heading">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange =
    (attendeeIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleAttendeeChange(attendeeIndex, "cnic_front", e.target.files[0]);
      }
    };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Validate form data for both attendees before proceeding
    const errors: { [key: string]: string } = {};

    // Validate attendee 0
    const attendee0 = state.attendees[0];
    if (!attendee0?.first_name) errors.first_name_0 = "First name is required";
    if (!attendee0?.last_name) errors.last_name_0 = "Last name is required";
    if (!attendee0?.email) errors.email_0 = "Email is required";
    if (!attendee0?.cnic_number)
      errors.cnic_number_0 = "CNIC number is required";
    if (!attendee0?.whatsapp_number)
      errors.whatsapp_number_0 = "WhatsApp number is required";
    if (!attendee0?.gender) errors.gender_0 = "Gender is required";
    if (!attendee0?.cnic_front)
      errors.cnic_front_0 = "CNIC front image is required";

    // Validate attendee 1
    const attendee1 = state.attendees[1];
    if (!attendee1?.first_name) errors.first_name_1 = "First name is required";
    if (!attendee1?.last_name) errors.last_name_1 = "Last name is required";
    if (!attendee1?.email) errors.email_1 = "Email is required";
    if (!attendee1?.cnic_number)
      errors.cnic_number_1 = "CNIC number is required";
    if (!attendee1?.whatsapp_number)
      errors.whatsapp_number_1 = "WhatsApp number is required";
    if (!attendee1?.gender) errors.gender_1 = "Gender is required";
    if (!attendee1?.cnic_front)
      errors.cnic_front_1 = "CNIC front image is required";

    // Update errors in context
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    // Clear any existing errors
    dispatch({ type: "SET_ERRORS", errors: {} });

    // Proceed to next step (Primary)
    gsap.to(formRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        dispatch({ type: "SET_STEP_NUMBER", stepNumber: 3 });
      },
    });
  };

  const renderAttendeeForm = (attendeeIndex: number, attendeeTitle: string) => {
    const attendee = state.attendees[attendeeIndex] || {
      first_name: "",
      last_name: "",
      cnic_number: "",
      gender: 0,
      instagram_url: "",
      cnic_front: "",
      email: "",
      whatsapp_number: "",
    };

    return (
      <div className="form-wrapper">
        <div className="form">
          <div className="form-header">
            <h3>{attendeeTitle}</h3>
            <p>
            Fill in all required fields correctly, incomplete or inaccurate forms may be rejected.
            </p>
          </div>
          <div className="field-wrapper">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="First Name (As Per ID)*"
                value={attendee.first_name}
                onChange={(e) =>
                  handleAttendeeChange(
                    attendeeIndex,
                    "first_name",
                    e.target.value
                  )
                }
              />
              <img src={name} alt="" />
              {state.errors[`first_name_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`first_name_${attendeeIndex}`]}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Last Name (As Per ID)*"
                value={attendee.last_name}
                onChange={(e) =>
                  handleAttendeeChange(
                    attendeeIndex,
                    "last_name",
                    e.target.value
                  )
                }
              />
              <img src={name} alt="" />
              {state.errors[`last_name_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`last_name_${attendeeIndex}`]}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Valid Email*"
                value={attendee.email}
                onChange={(e) =>
                  handleAttendeeChange(attendeeIndex, "email", e.target.value)
                }
              />
              <img src={mail} alt="" />
              {state.errors[`email_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`email_${attendeeIndex}`]}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="CNIC / Passport / ID Number*"
                value={attendee.cnic_number}
                onChange={(e) =>
                  handleCNICChange(attendeeIndex, e.target.value)
                }
                maxLength={15}
              />
              <img src={nic} alt="" />
              {state.errors[`cnic_number_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`cnic_number_${attendeeIndex}`]}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="WhatsApp Number*"
                value={attendee.whatsapp_number}
                onChange={(e) =>
                  handleAttendeeChange(
                    attendeeIndex,
                    "whatsapp_number",
                    e.target.value
                  )
                }
              />
              <img src={phone} alt="" />
              {state.errors[`whatsapp_number_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`whatsapp_number_${attendeeIndex}`]}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Instagram URL (Optional)"
                value={attendee.instagram_url || ""}
                onChange={(e) =>
                  handleAttendeeChange(
                    attendeeIndex,
                    "instagram_url",
                    e.target.value
                  )
                }
              />
              <img src={insta} alt="" />
            </div>
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder='Referral (Optional)' 
                value={state.referralText || ''}
                onChange={(e) => handleReferralChange(e.target.value)}
                maxLength={255}
              />
              <img src={name} alt="" />
            </div>
          </div>
          {/* Gender Dropdown Start */}
          <div className="input-wrapper">
            <select
              className="gender-select"
              value={attendee.gender || ""}
              onChange={(e) =>
                handleAttendeeChange(
                  attendeeIndex,
                  "gender",
                  Number(e.target.value)
                )
              }
              required
            >
              <option value="" disabled>
                Select gender (important*)
              </option>
              {state.genders && state.genders.length > 0 ? (
                state.genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading genders...
                </option>
              )}
            </select>
            {state.errors[`gender_${attendeeIndex}`] && (
              <span className="error-text">
                {state.errors[`gender_${attendeeIndex}`]}
              </span>
            )}
          </div>
          {/* Gender Dropdown End */}
          <div className="up-wrapper">
            <p>Upload the front of your CNIC</p>
            <div className="cnic-upload">
              <input
                type="file"
                accept="image/*"
                id={`cnic-upload-${attendeeIndex}`}
                onChange={handleFileChange(attendeeIndex)}
                required
              />
              <label
                htmlFor={`cnic-upload-${attendeeIndex}`}
                className="upload-label"
              >
                {attendee.cnic_front instanceof File
                  ? `Uploaded! ${attendee.cnic_front.name}`
                  : "Upload CNIC"}
              </label>
              {state.errors[`cnic_front_${attendeeIndex}`] && (
                <span className="error-text">
                  {state.errors[`cnic_front_${attendeeIndex}`]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="c-container" ref={formRef}>
      <div className="c-wrapper">
        <div className="l-content">
          <div className="heading">
            <h2>Please Enter your Details</h2>
          </div>
          <div className="desc">
            <p>
              <span>Required:</span>

              <span>{"– First & Last Name (as per ID)"}</span>

              <span>– Valid Email</span>
              <span>– CNIC / Passport / ID Number</span>
              <span>– WhatsApp Number</span>
              <span>– Gender</span>
              <span>– Upload a clear image of your ID</span>
              <span className="space"></span>
              <span>Optional but Recommended:</span>
              <span>
                – Reference: Know someone from the Disc Jam crew, or an artist?
                Drop their name, it boosts your approval chances.
              </span>
              <span>
                – Instagram URL: Not mandatory but sharing your profile also
                helps with verification and increases your chances of getting
                approved.
              </span>
              <span className="space"></span>
              <span>
                Once submitted, we’ll reach out via email or WhatsApp after
                verification.
              </span>
            </p>
          </div>
        </div>
        <div className="r-content">
          <form onSubmit={handleContinue}>
            <div className="c-form-wrapper">
              {renderAttendeeForm(0, "ATTENDEE - 1")}
              {renderAttendeeForm(1, "ATTENDEE - 2")}
            </div>
            {state.error && <div className="error-message">{state.error}</div>}
            {state.success && (
              <div className="success-message">{state.success}</div>
            )}
            <div className="submit">
              <button
                type="submit"
                className="submit-button"
                disabled={state.isSubmitting}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Couple;
