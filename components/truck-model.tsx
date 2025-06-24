"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text } from "@react-three/drei"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { Truck } from "lucide-react"
import * as THREE from "three"
// import type { RootState } from '@react-three/fiber';
// import type { OrbitControls as OrbitControlsType } from '@react-three/drei';

// Enhanced truck model with more details
// function TruckModel3D({ position = [0, 0, 0], rotation = [0, 0, 0], color = "#4f46e5" }) {
//   const truckRef = useRef()
//   useFrame((state: RootState) => {
//     if (truckRef.current) {
//       // Gentle floating animation
//     }
//   });
//   return null;
// }

function MovingTruck({ startPosition, endPosition, speed = 0.5, color = "#4f46e5" }: { startPosition: [number, number, number]; endPosition: [number, number, number]; speed?: number; color?: string }) {
  const truckRef = useRef<THREE.Group>(null!)
  const [progress, setProgress] = useState(0)

  useFrame(() => {
    if (truckRef.current) {
      const newProgress = (progress + speed * 0.005) % 1
      setProgress(newProgress)

      const x = startPosition[0] + (endPosition[0] - startPosition[0]) * newProgress
      const z = startPosition[2] + (endPosition[2] - startPosition[2]) * newProgress

      truckRef.current.position.x = x
      truckRef.current.position.z = z

      const angle = Math.atan2(endPosition[0] - startPosition[0], endPosition[2] - startPosition[2])
      truckRef.current.rotation.y = angle
    }
  })

  return (
    <group ref={truckRef} position={startPosition} scale={0.8}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.3, -1]} castShadow>
        <boxGeometry args={[0.8, 1.2, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.4, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.4, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.4, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0.75, 0.6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#FFCC33" emissive="#FFCC33" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function AIMatchingVisualization() {
  const [matchingComplete, setMatchingComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMatchingComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <group>
      <mesh position={[-3, 0, -3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <Text position={[-3, 0.5, -3]} fontSize={0.3} color="#ffffff">
        Origin
      </Text>
      <mesh position={[3, 0, 3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <Text position={[3, 0.5, 3]} fontSize={0.3} color="#ffffff">
        Destination
      </Text>
      {!matchingComplete ? (
        <>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 2, 0]} fontSize={0.4} color="#8b5cf6">
            AI Matching...
          </Text>
          {[-2, -1, 0, 1, 2].map((x, i) => (
            <mesh key={i} position={[x, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.05, 6]} />
              <meshStandardMaterial color="#8b5cf6" transparent opacity={0.5} />
            </mesh>
          ))}
          {[-2, -1, 0, 1, 2].map((z, i) => (
            <mesh key={i} position={[0, 0.05, z]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[0.05, 6]} />
              <meshStandardMaterial color="#8b5cf6" transparent opacity={0.5} />
            </mesh>
          ))}
        </>
      ) : (
        <>
          <MovingTruck startPosition={[-3, 0, -3]} endPosition={[3, 0, 3]} speed={0.3} color="#3b82f6" />
          <MovingTruck startPosition={[-4, 0, -2]} endPosition={[4, 0, 2]} speed={0.4} color="#8b5cf6" />
          <MovingTruck startPosition={[-2, 0, -4]} endPosition={[2, 0, 4]} speed={0.5} color="#10b981" />
          <Text position={[0, 2, 0]} fontSize={0.4} color="#8b5cf6">
            Carriers Matched!
          </Text>
        </>
      )}
    </group>
  )
}

export function TruckModel3D() {
  return <div>3D Truck Model Unavailable</div>;
}

export default function TruckModel({ mode = "showcase" }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full relative">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Truck className="h-12 w-12 text-blue-500 animate-pulse mb-4" />
          <p className="text-slate-400">Loading 3D visualization...</p>
        </div>
      ) : (
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={40} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={null}>
            {mode === "showcase" && <TruckModel3D />}
            {mode === "matching" && <AIMatchingVisualization />}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
          <gridHelper args={[20, 20, "#4f46e5", "#1f2937"]} position={[0, -0.5, 0]} />
        </Canvas>
      )}
      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
        <h3 className="text-white font-medium mb-1">
          {mode === "showcase" ? "AI-Powered Fleet Management" : "Real-time Carrier Matching"}
        </h3>
        <p className="text-slate-300 text-sm">
          {mode === "showcase"
            ? "Monitor your entire fleet with 3D visualization and AI-powered optimization"
            : "Our AI algorithm matches the perfect carriers for your shipment in real-time"}
        </p>
      </div>
      {!isLoading && mode === "showcase" && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-slate-800/80 p-3 rounded-lg text-white text-xs w-48 border border-slate-700">
              <h4 className="font-bold mb-1">Engine Diagnostics</h4>
              <p className="text-slate-300">All systems nominal. AI predictive maintenance scheduled.</p>
            </div>
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-slate-800/80 p-3 rounded-lg text-white text-xs w-48 border border-slate-700">
              <h4 className="font-bold mb-1">Cargo Monitoring</h4>
              <p className="text-slate-300">Temperature stable at 4°C. Humidity at 55%.</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
