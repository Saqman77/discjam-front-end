import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls, Stars } from '@react-three/drei'
import { Mesh } from 'three'

export default function Experience() {
  const sphereRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      <mesh ref={sphereRef} position={[0, 0, -2]}>
        <sphereGeometry args={[4, 12, 12]} />
        <meshBasicMaterial color="#4EFC00" wireframe />
      </mesh>

      <OrbitControls />
    </>
  )
}
