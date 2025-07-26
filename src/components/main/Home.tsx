import MainCta from "@components/buttons/maincta/MainCta"
import PreScreen from "./prescreen/PreScreen"
import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap'
import Type from "./ticket-type/Type";
import { RegistrationProvider, useRegistrationContext } from "./RegistrationContext";
import Form from "./form/Form";
import Couple from "./couple/Couple";
import Primary from "./primary/Primary";
import Terms from "./t&c/Terms";
import Success from "./success/Success";
import Failure from "./Failure/Failure";

const SESSION_KEY = 'prescreenHidden';

const RegistrationScreens = () => {
  const { state, handleSubmit, dispatch } = useRegistrationContext();
  const screenRef = useRef<HTMLDivElement>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Animate in on mount
  useGSAP(() => {
    if (screenRef.current) {
      gsap.fromTo(screenRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power4.in' });
    }
  }, [state.step]);

  // Handle form submission from Terms component
  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await handleSubmit(e);
      
      // Debug: Log the state after submission
      console.log('After handleSubmit:');
      console.log('state.error:', state.error);
      console.log('state.errors:', state.errors);
      console.log('state.success:', state.success);
      
      // Check if submission was successful by checking for errors
      if (!state.error && Object.keys(state.errors).length === 0) {
        console.log('Submission successful - navigating to success');
        setIsSuccess(true);
        // Only navigate to success step on actual success
        const nextStep = state.ticketType === 'single' ? 4 : 5;
        dispatch({ type: 'SET_STEP_NUMBER', stepNumber: nextStep });
      } else {
        console.log('Submission failed - staying on Terms to show errors');
        setIsSuccess(false);
      }
    } catch (error) {
      console.log('Exception caught - staying on Terms to show errors');
      // Don't navigate - stay on Terms to show errors
      setIsSuccess(false);
    }
  };

  // Add retry functionality for server errors
  const handleRetry = () => {
    // Reset success state and go back to Terms
    // setIsSuccess(null);
    // const termsStep = state.ticketType === 'single' ? 3 : 4;
    // dispatch({ type: 'SET_STEP_NUMBER', stepNumber: termsStep });
  };

  let ScreenComponent: React.ReactElement | null = null;
  switch (state.step) {
    case 1:
      ScreenComponent = <Type />;
      break;
    case 2:
      ScreenComponent = state.ticketType === 'single' ? <Form /> : <Couple />;
      break;
    case 3:
      ScreenComponent = state.ticketType === 'single' ? <Terms onSubmit={handleFormSubmission} /> : <Primary />;
      break;
    case 4:
      ScreenComponent = state.ticketType === 'single' ? <Success isSuccess={isSuccess === true} onRetry={handleRetry} /> : <Failure isSuccess={isSuccess === false} />;
      break;
    case 5:
      ScreenComponent = <Success isSuccess={isSuccess === true} onRetry={handleRetry} />;
      break;
    default:
      ScreenComponent = <Type />;
  }

  return (
    <div ref={screenRef} style={{ width: '100%' }}>
      {ScreenComponent}
    </div>
  );
};

const BackArrow = () => {
  const { state, dispatch } = useRegistrationContext();
  if (state.step <= 1) return null;
  const handleBack = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP_NUMBER', stepNumber: state.step - 1 });
    }
  };
  return (
    <button
      onClick={handleBack}
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        zIndex: 1000,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Go back"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8L12 16L20 24" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

const Home = () => {
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (clicked && !hidden) {
      gsap.to(ctaRef.current, {
        rotate: -90,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(ctaRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setHidden(true);
          }});
        },
      });
      gsap.fromTo(
        '.webgl',
        { opacity: 0 },
        { opacity: 1, duration: 5, ease: 'power2.inOut' }
      );
    } 
  }, [clicked, hidden]);

  useEffect(() => {
    if (ctaRef.current) {
      ctaRef.current.style.pointerEvents = clicked ? 'none' : 'auto';
    }
  }, [clicked]);

  const clicker = () => {
    setClicked((prev) => !prev)
  }

  return (
    <RegistrationProvider>
      <div className="main-container">
        {/* Only show BackArrow during registration flow, not on PreScreen */}
        {hidden && <BackArrow />}
        {/* PreScreen logic: show until hidden is true */}
        {!hidden && (
          <div className="cta-container" ref={ctaRef}>
            <MainCta onClick={clicker} />
          </div>
        )}
        {!hidden && <PreScreen clicked={clicked} />}
        {/* Registration flow only after PreScreen is hidden */}
        {hidden && <RegistrationScreens />}
      </div>
    </RegistrationProvider>
  )
}

export default Home