"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Apple, Play, Smartphone, Bell, MapPin, Clock } from "lucide-react"

export default function MobileAppPromotion() {
  const features = [
    {
      icon: <Smartphone className="h-5 w-5 text-blue-600" />,
      text: "Manage shipments on the go from anywhere",
    },
    {
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      text: "Real-time notifications for status updates",
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-600" />,
      text: "Track shipments with live GPS updates",
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      text: "Quick access to all delivery information",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden" id="mobile-app">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="lg:max-w-md"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Take MarocTransit With You Everywhere</h2>
            <p className="text-xl text-gray-500 mb-8">
              Manage your shipments on the go with our powerful mobile apps. Available for iOS and Android devices.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 p-1 rounded-full bg-blue-50">{feature.icon}</div>
                  <p className="ml-4 text-gray-600">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black">
                <Apple className="h-5 w-5" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </Button>

              <Button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black">
                <Play className="h-5 w-5" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Image
                src="/images/qr-code.png"
                alt="QR Code"
                width={96}
                height={96}
                className="rounded-lg border border-gray-200"
              />
              <div className="text-sm text-gray-600">
                <p className="font-medium">Scan to download</p>
                <p>Point your camera at the QR code to download our mobile app</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 lg:mt-0 relative"
          >
            <div className="relative mx-auto max-w-[320px]">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-blue-100 to-green-100 opacity-50 blur-xl"></div>
              </div>

              <div className="relative">
                <Image
                  src="/images/mobile-app.png"
                  alt="MarocTransit Mobile App"
                  width={300}
                  height={600}
                  className="relative z-10 rounded-3xl shadow-2xl"
                />

                <div className="absolute top-0 -right-4 rotate-6 z-0">
                  <Image
                    src="/images/mobile-app.png"
                    alt="MarocTransit Mobile App"
                    width={300}
                    height={600}
                    className="opacity-75 rounded-3xl shadow-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
