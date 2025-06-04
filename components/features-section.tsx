"use client"

import { motion } from "framer-motion"
import { Brain, Truck, MapPin, BarChart, Shield, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Intelligent algorithms match shippers with the best carriers based on route, capacity, and performance.",
    color: "text-purple-500"
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Track your shipments in real-time with GPS precision and automated status updates.",
    color: "text-blue-500"
  },
  {
    icon: Truck,
    title: "Fleet Management",
    description: "Comprehensive fleet management tools with maintenance scheduling and performance analytics.",
    color: "text-green-500"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Detailed insights into your logistics operations with predictive analytics and reporting.",
    color: "text-orange-500"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Enterprise-grade security with encrypted communications and secure payment processing.",
    color: "text-red-500"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support with AI-powered assistance and human backup.",
    color: "text-cyan-500"
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for Modern Logistics
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to streamline your logistics operations and grow your business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
