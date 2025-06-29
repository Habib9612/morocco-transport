'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Clock, Shield, Star, Users, ArrowRight, Phone, Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Modern Fleet",
      description: "State-of-the-art vehicles equipped with GPS tracking and safety features"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "On-Time Service",
      description: "Punctual departures and arrivals with real-time tracking updates"
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-600" />,
      title: "Wide Coverage",
      description: "Extensive network covering all major cities and remote areas in Morocco"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Safe & Secure",
      description: "Professional drivers and comprehensive insurance for peace of mind"
    }
  ]

  const stats = [
    { number: "50+", label: "Cities Connected" },
    { number: "1000+", label: "Daily Trips" },
    { number: "99.8%", label: "On-Time Rate" },
    { number: "500K+", label: "Happy Customers" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MarocTransit</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book Now
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Services</Link>
              <Link href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">About</Link>
              <Link href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</Link>
              <div className="flex space-x-2 px-3 py-2">
                <Button variant="outline" size="sm" className="flex-1">Login</Button>
                <Button size="sm" className="flex-1">Book Now</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Morocco's Leading Transport Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transport Solutions for
              <span className="text-blue-600 block">Modern Morocco</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting cities, delivering dreams. Experience reliable, efficient, and modern transport services across Morocco with real-time tracking and professional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Book Your Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MarocTransit?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional transport services with modern technology and professional care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Travel?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your journey today and experience the best transport service in Morocco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: +212 5XX-XXXX
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">Excellent Service!</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    "MarocTransit provided exceptional service. The bus was comfortable, on time, and the staff was very professional."
                  </CardDescription>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Ahmed Hassan</div>
                      <div className="text-sm text-gray-500">Business Traveler</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">MarocTransit</span>
              </div>
              <p className="text-gray-400">
                Morocco's leading transport service connecting cities and delivering excellence.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">City Transport</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Airport Shuttle</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cargo Services</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Charter Bus</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +212 5XX-XXXX</li>
                <li>📧 info@maroctransit.ma</li>
                <li>📍 Casablanca, Morocco</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MarocTransit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}