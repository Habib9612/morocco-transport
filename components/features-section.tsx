"use client"

import { motion } from "framer-motion"
import { Brain, Route, Activity, Zap, Clock, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithm connects shippers with the perfect carriers based on location, vehicle type, and delivery requirements.",
    },
    {
      icon: <Route className="h-8 w-8 text-blue-500" />,
      title: "Route Optimization",
      description:
        "AI-optimized routes reduce fuel consumption and delivery times by analyzing traffic, weather, and historical data.",
    },
    {
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      title: "Real-time Monitoring",
      description:
        "Track your fleet in real-time with our advanced GPS tracking system. Monitor vehicle performance, driver behavior, and delivery status.",
    },
    {
      icon: <LineChart className="h-8 w-8 text-blue-500" />,
      title: "Predictive Analytics",
      description:
        "Make data-driven decisions with our predictive maintenance alerts, demand forecasting, and performance trends analysis.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Predictive Maintenance",
      description:
        "AI predicts when your vehicles need maintenance before breakdowns occur, reducing downtime and extending fleet lifespan.",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Fuel Optimization",
      description:
        "Reduce fuel costs by up to 30% with our AI-powered solutions that optimize routes, monitor driving behavior, and track fuel consumption.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16 sm:py-24 bg-[#0f172a]" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">AI-Powered Logistics Solutions</h2>
          <p className="mt-4 text-xl text-gray-400">Transform your fleet management with advanced technology</p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-[#1e293b] rounded-lg p-6 border border-gray-800 transition-all duration-300 hover:border-blue-500"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              <Link
                href="#"
                className="inline-flex items-center mt-4 text-blue-500 hover:text-blue-400 text-sm font-medium"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Explore All AI Solutions
          </Button>
        </div>
      </div>
    </section>
  )
}
