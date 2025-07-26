import './prescreen.scss'
import  logo from '@assets/prescreen/logo.svg'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap'

const PreScreen = ({ clicked }: { clicked: boolean }) => {
    const preRef = useRef(null)
    const lRef = useRef(null)
    const rRef = useRef(null)

    useGSAP(() => {
        if (clicked) {
            gsap.to(lRef.current, {
                duration:'1',
                x: '-100%',
                ease:'power4.in'
            });
            gsap.to(rRef.current, {
                duration:'1',
                x: '100%',
                ease:'power4.in'
            });
        }
    }, [clicked]);

    return (
        <div className="pre-container" ref={preRef}>
            <div className="pre-wrapper">
                <div className="left" ref={lRef}>
                    <div className="top">
                        <h1> SIGN U</h1>
                    </div>
                </div>
                <div className="right" ref={rRef}>
                    <img src={logo} alt="" />
                    <div className="top">
                        <h1>P NOW</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreScreen