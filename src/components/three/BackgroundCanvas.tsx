import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import Experience from './Experience'

export default function BackgroundCanvas() {
  return (
    <Canvas
      className="webgl"
      gl={{ toneMapping: THREE.NoToneMapping }}
      camera={{ position: [0, 0, 0], fov: 75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <group rotation={[0.1, 0, Math.PI / -5]}> {/* Rotate camera's parent group */}
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </group>
    </Canvas>
  )
}