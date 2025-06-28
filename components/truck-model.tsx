"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text, Float } from "@react-three/drei"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { Truck } from "lucide-react"

// Enhanced truck model with more details
function TruckModel3D({ position = [0, 0, 0], rotation = [0, 0, 0], color = "#4f46e5" }) {
  const truckRef = useRef()
  const { viewport } = useThree()

  useFrame((state) => {
    if (truckRef.current) {
      // Gentle floating animation
      truckRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
      // Slow rotation
      truckRef.current.rotation.y = rotation[1] + state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={truckRef} position={position} rotation={rotation} scale={1.5}>
        {/* Truck Cab */}
        <mesh position={[1.5, 0.75, 0]} castShadow>
          <boxGeometry args={[1.2, 1, 2]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Truck Body */}
        <mesh position={[-0.5, 0, 0]} castShadow>
          <boxGeometry args={[4, 1.5, 2]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Windshield */}
        <mesh position={[1.5, 1, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Wheels */}
        <Wheel position={[-1.5, -0.75, 1]} />
        <Wheel position={[-1.5, -0.75, -1]} />
        <Wheel position={[1.5, -0.75, 1]} />
        <Wheel position={[1.5, -0.75, -1]} />
        <Wheel position={[0, -0.75, 1]} />
        <Wheel position={[0, -0.75, -1]} />

        {/* Headlights */}
        <mesh position={[2.1, 0.75, 0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#FFCC33" emissive="#FFCC33" emissiveIntensity={1} />
        </mesh>
        <mesh position={[2.1, 0.75, -0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#FFCC33" emissive="#FFCC33" emissiveIntensity={1} />
        </mesh>

        {/* AI Indicator */}
        <mesh position={[-2, 1, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
        </mesh>

        {/* Roof lights */}
        <mesh position={[1.5, 1.5, 0]}>
          <boxGeometry args={[0.6, 0.1, 1.2]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Emergency lights */}
        <EmergencyLight position={[1.5, 1.55, 0.4]} color="#ff0000" />
        <EmergencyLight position={[1.5, 1.55, -0.4]} color="#0000ff" />

        {/* Logo on the side */}
        <mesh position={[-0.5, 0.8, 1.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  )
}

function EmergencyLight({ position, color }) {
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Blinking effect
      const intensity = Math.sin(clock.getElapsedTime() * 5) > 0 ? 1 : 0.2
      lightRef.current.material.emissiveIntensity = intensity
    }
  })

  return (
    <mesh ref={lightRef} position={position}>
      <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  )
}

function Wheel({ position }) {
  const wheelRef = useRef()

  useFrame(({ clock }) => {
    if (wheelRef.current) {
      // Rotate the wheels
      wheelRef.current.rotation.x = clock.getElapsedTime() * 2
    }
  })

  return (
    <mesh ref={wheelRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
      <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function MovingTruck({ startPosition, endPosition, speed = 0.5, color = "#4f46e5" }) {
  const truckRef = useRef()
  const [progress, setProgress] = useState(0)

  useFrame((state) => {
    if (truckRef.current) {
      // Calculate new progress
      const newProgress = (progress + speed * 0.005) % 1
      setProgress(newProgress)

      // Interpolate position
      const x = startPosition[0] + (endPosition[0] - startPosition[0]) * newProgress
      const z = startPosition[2] + (endPosition[2] - startPosition[2]) * newProgress

      truckRef.current.position.x = x
      truckRef.current.position.z = z

      // Calculate rotation to face direction of travel
      const angle = Math.atan2(endPosition[0] - startPosition[0], endPosition[2] - startPosition[2])
      truckRef.current.rotation.y = angle
    }
  })

  return (
    <group ref={truckRef} position={startPosition} scale={0.8}>
      {/* Truck Cab */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Truck Body */}
      <mesh position={[0, 0.3, -1]} castShadow>
        <boxGeometry args={[0.8, 1.2, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Wheels */}
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

      {/* Headlights */}
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
      {/* Origin point */}
      <mesh position={[-3, 0, -3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <Text position={[-3, 0.5, -3]} fontSize={0.3} color="#ffffff">
        Origin
      </Text>

      {/* Destination point */}
      <mesh position={[3, 0, 3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <Text position={[3, 0.5, 3]} fontSize={0.3} color="#ffffff">
        Destination
      </Text>

      {/* AI Matching visualization */}
      {!matchingComplete ? (
        <>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
          </mesh>
          <Text position={[0, 2, 0]} fontSize={0.4} color="#8b5cf6">
            AI Matching...
          </Text>

          {/* Scanning lines */}
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
          {/* Show matched trucks */}
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

export default function TruckModel({ mode = "showcase" }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
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
            {mode === "showcase" && <TruckModel3D position={[0, 0, 0]} rotation={[0, 0, 0]} />}
            {mode === "matching" && <AIMatchingVisualization />}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />

          {/* Grid floor */}
          <gridHelper args={[20, 20, "#4f46e5", "#1f2937"]} position={[0, -0.5, 0]} />
        </Canvas>
      )}

      {/* Overlay information */}
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

      {/* Interactive hotspots */}
      {!isLoading && mode === "showcase" && (
        <>
          <motion.div
            className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-white text-xs font-bold">1</span>
            <div className="absolute -right-40 top-0 bg-slate-900 p-3 rounded-lg border border-slate-700 w-36 hidden group-hover:block">
              <p className="text-white text-xs">GPS Tracking System</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          >
            <span className="text-white text-xs font-bold">2</span>
            <div className="absolute -left-40 top-0 bg-slate-900 p-3 rounded-lg border border-slate-700 w-36 hidden group-hover:block">
              <p className="text-white text-xs">AI Optimization</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
