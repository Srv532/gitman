"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function AnimatedShape() {
  const groupRef = useRef<THREE.Group>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.05
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        {/* Core sphere */}
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshStandardMaterial
            color="#0d1117"
            roughness={0.1}
            metalness={0.9}
            envMapIntensity={1}
          />
        </mesh>

        {/* Outer wireframe icosahedron */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshBasicMaterial color="#39d353" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Inner wireframe icosahedron */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.7, 0]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-50 mix-blend-screen hidden md:block"
      style={{ width: 380, height: 380 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} color="#39d353" intensity={3} />
        <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={1.5} />
        <AnimatedShape />
      </Canvas>
    </div>
  )
}
