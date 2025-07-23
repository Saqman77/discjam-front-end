import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { OrbitControls, Line } from '@react-three/drei'
import { Group, Vector3 } from 'three'

export default function Experience() {
  const groupRef = useRef<Group>(null)
  const radius = 5
  const segments = 100

  // Vertical (longitude) lines
  const verticalLines = useMemo(() => {
    const count = 16
    const lines = []

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2
      const points: Vector3[] = []

      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        points.push(new Vector3(x, y, z))
      }

      lines.push(points)
    }

    return lines
  }, [])

  // Horizontal (latitude) lines
  const horizontalLines = useMemo(() => {
    const levels = 8
    const lines = []

    for (let i = 1; i <= levels; i++) {
      const phi = (i / (levels + 1)) * Math.PI
      const y = radius * Math.cos(phi)
      const ringRadius = radius * Math.sin(phi)

      const points: Vector3[] = []
      const ringSegments = 100
      for (let j = 0; j <= ringSegments; j++) {
        const theta = (j / ringSegments) * Math.PI * 2
        const x = ringRadius * Math.cos(theta)
        const z = ringRadius * Math.sin(theta)
        points.push(new Vector3(x, y, z))
      }

      lines.push(points)
    }

    return lines
  }, [])

  // Rotate the whole group slowly
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1 // adjust speed as needed
    }
  })

  return (
    <>
      <group ref={groupRef} position={[-1.5, -0.5, 1]}>
        {/* Vertical Lines */}
        {verticalLines.map((points, i) => (
          <Line
            key={`v-${i}`}
            points={points}
            color="#4EFC00"
            lineWidth={3}
          />
        ))}

        {/* Horizontal Lines */}
        {horizontalLines.map((points, i) => (
          <Line
            key={`h-${i}`}
            points={points}
            color="#4EFC00"
            lineWidth={3}
          />
        ))}
      </group>

      {/* <OrbitControls /> */}
    </>
  )
}
