import React from 'react';
import HeroSection from '../components/landing/hero-section';
import FeaturesSection from '../components/landing/features-section';
import FeatureShowcase from '../components/landing/feature-showcase';
import ContactSection from '../components/landing/contact-section';
import TestimonialsSection from '../components/landing/testimonials-section';
import StatsSection from '../components/landing/stats-section';
import FinalCta from '../components/landing/final-cta';
import Footer from '../components/landing/footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <FeatureShowcase />
      <StatsSection />
      <TestimonialsSection />
      <ContactSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
