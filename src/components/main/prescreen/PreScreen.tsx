import './prescreen.scss'
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
        <div className="p-container" ref={preRef}>
            <div className="p-wrapper">
                <div className="left" ref={lRef}>
                    <div className="top"></div>
                </div>
                <div className="right" ref={rRef}>
                    <div className="top"></div>
                </div>
            </div>
        </div>
    )
}

export default PreScreen