"use client"

import MainNavbar from "@/components/main-navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorksSection from "@/components/how-it-works-section"
import TestimonialsSection from "@/components/testimonials-section"
import ValueProposition from "@/components/value-proposition"
import MobileAppPromotion from "@/components/mobile-app-promotion"
import TruckModel from "@/components/truck-model"
import FinalCTA from "@/components/final-cta"
import MainFooter from "@/components/main-footer"
import { useTranslation } from "@/lib/translation-context"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-1">
        <HeroSection />

        {/* 3D Truck Model Showcase */}
        <section className="py-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">AI-Powered Fleet Management</h2>
              <p className="mt-4 text-xl text-gray-400">Experience our cutting-edge 3D visualization technology</p>
            </div>
            <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <TruckModel mode="showcase" />
            </div>
          </div>
        </section>

        <FeaturesSection />
        <ValueProposition />
        <HowItWorksSection />
        <TestimonialsSection />
        <MobileAppPromotion />
        <FinalCTA />
      </main>
      <MainFooter />
    </div>
  )
}
