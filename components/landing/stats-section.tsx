"use client"

import { motion } from "framer-motion"
import { Truck, Users, Globe, Package } from "lucide-react"

export default function StatsSection() {
  const stats = [
    {
      icon: <Truck className="h-8 w-8 text-orange-500" />,
      value: "30k+",
      label: "Vehicles in our fleet",
    },
    {
      icon: <Package className="h-8 w-8 text-orange-500" />,
      value: "1M+",
      label: "Packages delivered",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      value: "500k+",
      label: "Satisfied customers",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      value: "150+",
      label: "Countries served",
    },
  ]

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
