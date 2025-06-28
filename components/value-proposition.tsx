"use client"

import { motion } from "framer-motion"
import { Brain, Route, Shield, LineChart, BatteryCharging, Truck } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ValueProposition() {
  const benefits = [
    {
      icon: <Brain className="h-12 w-12 text-blue-600" />,
      title: "AI-Powered Freight Matching",
      description:
        "Our sophisticated algorithm connects you with the perfect carriers based on location, vehicle type, and delivery requirements. Reduce waiting time and find the ideal match instantly.",
      learnMore:
        "The matching algorithm considers over 20 factors including historical performance, route optimization, and real-time availability to ensure the most compatible carrier for your needs.",
    },
    {
      icon: <Route className="h-12 w-12 text-blue-600" />,
      title: "Predictive Route Optimization",
      description:
        "Our AI analyzes traffic patterns, weather conditions, and historical data to create optimal routes that reduce fuel consumption and delivery times by up to 30%.",
      learnMore:
        "The proprietary route optimization system processes over 100 million data points daily to generate routes that avoid traffic congestion, construction zones, and areas with poor road conditions, saving both time and fuel.",
    },
    {
      icon: <LineChart className="h-12 w-12 text-blue-600" />,
      title: "Predictive Maintenance",
      description:
        "Our AI predicts when your vehicles need maintenance before breakdowns occur, reducing downtime and extending fleet lifespan by detecting issues early.",
      learnMore:
        "The predictive maintenance system analyzes engine data, driving patterns, and maintenance history to identify potential issues up to three weeks before traditional methods, reducing unplanned downtime by 78%.",
    },
    {
      icon: <BatteryCharging className="h-12 w-12 text-blue-600" />,
      title: "Fuel Efficiency Optimization",
      description:
        "AI-driven insights help reduce fuel costs by 24% through optimized routes, driving behavior analysis, and vehicle performance monitoring.",
      learnMore:
        "The fuel efficiency module combines real-time vehicle data with driver behavior metrics to provide customized strategies for reducing fuel consumption, with most clients seeing ROI within the first three months.",
    },
    {
      icon: <Truck className="h-12 w-12 text-blue-600" />,
      title: "Fleet Utilization Analytics",
      description:
        "Maximize your fleet&apos;s productivity with AI analytics that identify underutilized vehicles and optimize assignment to increase capacity utilization by 35%.",
      learnMore:
        "The fleet analytics platform aggregates operational data to identify usage patterns, allowing fleet managers to make data-driven decisions about vehicle distribution, acquisition, and retirement.",
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Secure Data Management",
      description:
        "Our platform ensures all your fleet and shipment data is protected with bank-grade encryption and comprehensive access controls.",
      learnMore:
        "All data is encrypted both in transit and at rest using AES-256 encryption, with role-based access controls and multi-factor authentication to ensure only authorized personnel can access sensitive information.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16 sm:py-24 bg-white" id="benefits">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Choose MarocTransit AI?</h2>
          <p className="mt-4 text-xl text-gray-500">
            Our AI-powered platform offers innovative solutions to transform your logistics operations
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={item}>
              <BenefitCard {...benefit} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BenefitCard({ icon, title, description, learnMore }: { icon: React.ReactNode; title: string; description: string; learnMore: string }) {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-gray-200">
      <CardHeader className="pb-2">
        <div className="p-3 w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <details className="w-full">
          <summary className="text-blue-600 cursor-pointer font-medium hover:text-blue-800 flex items-center text-sm">
            Learn more
          </summary>
          <p className="mt-2 text-sm text-gray-500">{learnMore}</p>
        </details>
      </CardFooter>
    </Card>
  )
}
