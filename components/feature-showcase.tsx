"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, BarChart3, MapPin, Clock, Shield, Users, Smartphone, Zap } from "lucide-react"
import Image from 'next/image'

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Fleet Management",
    description:
      "Manage your entire fleet from a single dashboard. Track vehicles, monitor maintenance, and optimize utilization.",
    color: "bg-indigo-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.44-7fzgjPC6CLxJ0vfouKtRzxIXO8a8gn.png",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Real-time Tracking",
    description:
      "Know where your vehicles are at all times with GPS tracking. Get accurate ETAs and route information.",
    color: "bg-cyan-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.16.38.png-hGKnflEtBbguYNcCPGGmMoFGctzRMZ.jpeg",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Advanced Analytics",
    description:
      "Gain insights into your operations with comprehensive analytics. Identify trends and optimize for efficiency.",
    color: "bg-purple-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.16.45-5NBsG7lQb9ItGlWQ7rOFZVvqwuQu9Z.png",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Route Optimization",
    description: "Save time and fuel with AI-powered route optimization. Reduce costs and improve delivery times.",
    color: "bg-blue-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.30.png-2JeHRbyATd1LUaFTaHVi22Fcz6xW7M.jpeg",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Safety & Compliance",
    description:
      "Ensure driver safety and regulatory compliance. Monitor driving behavior and maintain electronic logs.",
    color: "bg-emerald-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.24.png-55qB8eDsMQBi5ThXbwdjONnAScSpxh.jpeg",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Access",
    description: "Access your dashboard on the go with our mobile app. Stay connected with your fleet from anywhere.",
    color: "bg-amber-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.13.png-BHbcNprML76TSRp6gfTBWem9orE79I.jpeg",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Driver Management",
    description:
      "Manage driver profiles, assignments, and performance. Streamline communication and improve efficiency.",
    color: "bg-rose-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.13.png-eykSwa7FH5jSG6zh4uwtUef5Ybt43k.jpeg",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Workflow Automation",
    description: "Automate routine tasks and processes. Reduce manual work and focus on growing your business.",
    color: "bg-fuchsia-600",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.16.50-prBQiXih3O9p2wgm5VzPvHKYP8DF1A.png",
  },
]

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-6">
        {features.slice(0, 4).map((feature, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
              activeFeature === index
                ? "border-indigo-500 bg-slate-800/50"
                : "border-slate-700 bg-slate-800/20 hover:bg-slate-800/30"
            }`}
            onClick={() => setActiveFeature(index)}
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="lg:col-span-1 order-first lg:order-none">
        <div className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden border border-slate-700">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10" />
            <Image
              src={features[activeFeature].image || "/placeholder.svg"}
              alt={features[activeFeature].title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div
                className={`w-12 h-12 ${features[activeFeature].color} rounded-lg flex items-center justify-center mb-4`}
              >
                {features[activeFeature].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{features[activeFeature].title}</h3>
              <p className="text-slate-300">{features[activeFeature].description}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        {features.slice(4, 8).map((feature, index) => (
          <motion.div
            key={index + 4}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
              activeFeature === index + 4
                ? "border-indigo-500 bg-slate-800/50"
                : "border-slate-700 bg-slate-800/20 hover:bg-slate-800/30"
            }`}
            onClick={() => setActiveFeature(index + 4)}
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index + 4) * 0.1 }}
          >
            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
