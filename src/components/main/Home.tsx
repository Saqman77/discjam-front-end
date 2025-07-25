import MainCta from "@components/buttons/maincta/MainCta"
import PreScreen from "./prescreen/PreScreen"
import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap'
import Type from "./ticket-type/Type";
import { RegistrationProvider } from "./RegistrationContext";
import Form from "./form/Form";
import Couple from "./couple/Couple";
import Primary from "./primary/primary";

const SESSION_KEY = 'prescreenHidden';

const Home = () => {
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [showType, setShowType] = useState(false); // NEW
  const ctaRef = useRef<HTMLDivElement>(null)
  const typeRef = useRef<HTMLDivElement>(null); // NEW

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

  // Animate Type in after hidden becomes true (i.e., after cta+prescreen done)
  useGSAP(() => {
    if (hidden) {
      setShowType(true); // Mount Type
      // Animate in after a tick to ensure it's mounted
      setTimeout(() => {
        if (typeRef.current) {
          gsap.fromTo(typeRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
        }
      }, 0);
    }
  }, [hidden]);

  // Set pointer-events based on clicked
  useEffect(() => {
    if (ctaRef.current) {
      ctaRef.current.style.pointerEvents = clicked ? 'none' : 'auto';
    }
  }, [clicked]);

  const clicker = () => {
    console.log('clicked')
    setClicked((prev) => !prev)
  }

  return (
    <RegistrationProvider>
      <div className="main-container">
        {!hidden && (
          <div className="cta-container" ref={ctaRef}>
            <MainCta onClick={clicker} />
          </div>
        )}
        {!hidden && <PreScreen clicked={clicked} />}
        {showType && (
          <div ref={typeRef} style={{ opacity: 0 }}>
            {/* <Type /> */}
            {/* <Couple/> */}
            <Primary/>
          </div>
        )}
      </div>
    </RegistrationProvider>
  )
}

export default Home