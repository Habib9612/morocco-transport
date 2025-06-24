"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote:
      "FleetSync has transformed our logistics operations. We've cut delivery times by 30% and reduced costs significantly. The real-time tracking and analytics have been game-changers for our business.",
    author: "Sarah Johnson",
    title: "Operations Director",
    company: "Global Logistics Inc.",
    image: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  {
    quote:
      "The route optimization feature alone has saved us thousands in fuel costs each month. The AI-powered routing suggestions are incredibly accurate and have helped us improve our delivery efficiency by over 40%.",
    author: "Michael Chen",
    title: "Fleet Manager",
    company: "Express Delivery Co.",
    image: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  {
    quote:
      "As a small business owner, I was hesitant about investing in fleet management software, but FleetSync has paid for itself many times over. The interface is intuitive, and the customer support team is always responsive.",
    author: "David Rodriguez",
    title: "Owner",
    company: "Rodriguez Shipping",
    image: "/placeholder.svg?height=64&width=64",
    rating: 4,
  },
  {
    quote:
      "We've tried several logistics platforms, but none compare to FleetSync. The comprehensive analytics and reporting features give us insights we never had before, helping us make data-driven decisions.",
    author: "Emily Watkins",
    title: "Logistics Coordinator",
    company: "Transcontinental Freight",
    image: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((current + 1) % testimonials.length)
  }, [current])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }, [current])

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 8000)
    return () => clearInterval(interval)
  }, [current, next])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl bg-slate-800/30 rounded-2xl p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-indigo-600/10 to-transparent" />

        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="rounded-full border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex space-x-1">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1)
                  setCurrent(index)
                }}
                className={`w-2 h-2 rounded-full ${index === current ? "bg-indigo-500" : "bg-slate-600"}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="rounded-full border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative h-[300px] overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              <div>
                <div className="flex mb-4">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-slate-600" />
                  ))}
                </div>

                <blockquote className="text-xl text-white italic mb-8">&quot;{testimonials[current].quote}&quot;</blockquote>
              </div>

              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4 border-2 border-indigo-500">
                  <AvatarImage src={testimonials[current].image} alt={testimonials[current].author} />
                  <AvatarFallback className="bg-indigo-600">
                    {testimonials[current].author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-white">{testimonials[current].author}</div>
                  <div className="text-sm text-slate-400">
                    {testimonials[current].title}, {testimonials[current].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/20 rounded-full filter blur-3xl" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-600/20 rounded-full filter blur-3xl" />
    </div>
  )
}
