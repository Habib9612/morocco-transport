"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const testimonials = [
    {
      quote:
        "MarocTransit has transformed our logistics operations. We've cut delivery times by 30% and reduced costs significantly. The real-time tracking and analytics have been game-changers for our business.",
      author: "Sarah Johnson",
      title: "Operations Director",
      company: "Global Logistics Inc.",
      image: "/images/testimonial-1.png",
      rating: 5,
    },
    {
      quote:
        "The route optimization feature alone has saved us thousands in fuel costs each month. The AI-powered routing suggestions are incredibly accurate and have helped us improve our delivery efficiency by over 40%.",
      author: "Michael Chen",
      title: "Fleet Manager",
      company: "Express Delivery Co.",
      image: "/images/testimonial-2.png",
      rating: 5,
    },
    {
      quote:
        "As a small business owner, I was hesitant about investing in fleet management software, but MarocTransit has paid for itself many times over. The interface is intuitive, and the customer support team is always responsive.",
      author: "David Rodriguez",
      title: "Owner",
      company: "Rodriguez Shipping",
      image: "/images/testimonial-3.png",
      rating: 4,
    },
    {
      quote:
        "We've tried several logistics platforms, but none compare to MarocTransit. The comprehensive analytics and reporting features give us insights we never had before, helping us make data-driven decisions.",
      author: "Emily Watkins",
      title: "Logistics Coordinator",
      company: "Transcontinental Freight",
      image: "/images/testimonial-4.png",
      rating: 5,
    },
  ]

  const next = () => {
    setDirection(1)
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <section className="py-16 sm:py-24 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-xl text-gray-500">Join thousands of satisfied shippers and carriers</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent z-0"></div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="hidden md:flex space-x-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > current ? 1 : -1)
                        setCurrent(index)
                      }}
                      className={`w-3 h-3 rounded-full ${index === current ? "bg-blue-600" : "bg-gray-300"}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative h-[320px] md:h-[240px] overflow-hidden">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonials[current].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <blockquote className="text-xl text-gray-800 italic mb-8">
                          &quot;{testimonials[current].quote}&quot;
                        </blockquote>
                      </div>

                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4 border-2 border-blue-100">
                          <AvatarImage src={testimonials[current].image} alt={testimonials[current].author} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {testimonials[current].author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-gray-900">{testimonials[current].author}</div>
                          <div className="text-sm text-gray-500">
                            {testimonials[current].title}, {testimonials[current].company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full opacity-50" />
          <div className="hidden md:block absolute -top-6 -right-6 w-32 h-32 bg-green-100 rounded-full opacity-50" />
        </div>
      </div>
    </section>
  )
}
