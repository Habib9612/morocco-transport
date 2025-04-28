"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Truck, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full filter blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Logistics Operations?
            </h2>
            <p className="text-xl text-blue-100 mb-12">Join the digital revolution in Moroccan logistics today</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                <Link href="/signup?type=shipper">
                  <Truck className="mr-2 h-5 w-5" />
                  Sign Up as Shipper
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700/20" asChild>
                <Link href="/signup?type=carrier">
                  <Users className="mr-2 h-5 w-5" />
                  Sign Up as Carrier
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <Link href="/enterprise" className="inline-flex items-center text-white hover:text-blue-100">
                Learn more about our enterprise solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
