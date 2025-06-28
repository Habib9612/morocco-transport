"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function LogisticsShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              We are <span className="text-orange-500">#1 Logistics</span> WORLDWIDE
            </h2>
            <p className="text-gray-400 mb-6">
              Welcome to #1 Logistics Worldwide, your trusted partner in delivering excellence in global logistics
              solutions. With an unwavering commitment to reliability, efficiency, and customer satisfaction, we have
              earned our position as a leading logistics provider on a global scale.
            </p>
            <p className="text-gray-400 mb-8">
              Our extensive network spans across continents, allowing us to offer seamless transportation and supply
              chain solutions tailored to meet the unique needs of businesses of all sizes.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Learn More About Us</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Logistics truck"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Shipping containers"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Warehouse operations"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Logistics worker"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
