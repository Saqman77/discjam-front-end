import MainCta from "@components/buttons/maincta/MainCta"
import PreScreen from "./prescreen/PreScreen"
import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap'

const Home = () => {
  const [clicked, setClicked] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (clicked) {
      gsap.to(ctaRef.current, {
        rotate: -90,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(ctaRef.current, { opacity: 0, duration: 0.5 });
        },
      });
      gsap.fromTo(
        '.webgl',
        { opacity: 0 },
        { opacity: 1, duration: 5, ease: 'power2.inOut' }
      );
    } 
  }, [clicked]);

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
    <div className="main-container">
      <div className="cta-container" ref={ctaRef}>
        <MainCta onClick={clicker} />
      </div>
      <PreScreen clicked={clicked} />
    </div>
  )
}

export default Home