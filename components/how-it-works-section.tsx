"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

export default function HowItWorksSection({ steps }: { steps: { title: string; description: string; image: string }[] }) {
  const [activeTab, setActiveTab] = useState("shippers")

  const shipperSteps = [
    {
      number: "1",
      title: "Create Your Shipment Request",
      description:
        "Enter origin, destination, cargo details, and special requirements through our intuitive interface. Set your timeframe and budget preferences.",
      image: "/images/create-shipment.png",
    },
    {
      number: "2",
      title: "Get Matched with Verified Carriers",
      description:
        "Our AI algorithm instantly finds and suggests the best carriers based on your requirements, proximity, and performance history.",
      image: "/images/carrier-matching.png",
    },
    {
      number: "3",
      title: "Track Your Shipment in Real-Time",
      description:
        "Monitor your cargo&apos;s journey from pickup to delivery with GPS precision. Receive automated updates at every milestone.",
      image: "/images/shipment-tracking.png",
    },
    {
      number: "4",
      title: "Confirm Delivery and Release Payment",
      description:
        "Verify successful delivery through our app and release payment from escrow to the carrier with one click.",
      image: "/images/payment-confirmation.png",
    },
  ]

  const carrierSteps = [
    {
      number: "1",
      title: "Register Your Vehicles and Drivers",
      description:
        "Create detailed profiles of your fleet including vehicle types, capacities, and service areas. Upload all necessary documentation for verification.",
      image: "/images/register-vehicles.png",
    },
    {
      number: "2",
      title: "Browse and Accept Available Loads",
      description:
        "Receive notifications for matching shipments in your area or browse the load board to find ideal cargo that maximizes your revenue.",
      image: "/images/browse-loads.png",
    },
    {
      number: "3",
      title: "Navigate and Update Status",
      description:
        "Use our in-app navigation optimized for commercial vehicles. Update shipment status with a single tap at each milestone.",
      image: "/images/navigation.png",
    },
    {
      number: "4",
      title: "Receive Secure Payment",
      description:
        "Upon delivery confirmation, payment is automatically released from escrow to your account – no more 60-day waiting periods.",
      image: "/images/secure-payment.png",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How MarocTransit Works</h2>
          <p className="mt-4 text-xl text-gray-500">A simple process designed for efficiency and transparency</p>
        </div>

        <Tabs
          defaultValue="shippers"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="shippers" className="text-base py-3">
                For Shippers
              </TabsTrigger>
              <TabsTrigger value="carriers" className="text-base py-3">
                For Carriers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shippers">
            <ProcessSteps steps={shipperSteps} />
          </TabsContent>

          <TabsContent value="carriers">
            <ProcessSteps steps={carrierSteps} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function ProcessSteps({ steps }) {
  return (
    <div className="space-y-12 md:space-y-16">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
        >
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
              <Image
                src={step.image || "/placeholder.svg?height=300&width=500"}
                alt={step.title}
                width={500}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-4 flex items-center text-blue-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">{index === steps.length - 1 ? "Complete" : "Next Step"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
