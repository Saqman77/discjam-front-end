import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Experience from './Experience'
import { Environment } from '@react-three/drei'

export default function BackgroundCanvas() {
  return (
    <Canvas
      className="webgl"
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <Experience />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  )
}