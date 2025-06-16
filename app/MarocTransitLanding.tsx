import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, MapPin, Clock, Shield, Star, Users, CheckCircle } from 'lucide-react';

const MarocTransitLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">MarocTransit</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-blue-600">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Revolutionize Your
            <span className="text-blue-600"> Transport Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect drivers with load opportunities across Morocco. Our AI-powered platform matches the right loads with the right drivers, optimizing routes and maximizing profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/demo" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Drivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Loads Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MarocTransit?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to solve the unique challenges of transport logistics in Morocco
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Smart Route Optimization</h3>
              <p className="text-gray-600">
                AI-powered route planning that considers traffic, road conditions, and optimal delivery windows to save time and fuel.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your shipments in real-time with GPS monitoring, delivery confirmations, and instant notifications.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Guaranteed secure payments with multiple payment options and insurance coverage for every shipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Carriers Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">For Carriers</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of drivers earning more with optimized routes and guaranteed loads
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Find Loads Instantly</h3>
                    <p className="opacity-90">Access thousands of verified loads with our AI-powered matching system</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Maximize Earnings</h3>
                    <p className="opacity-90">Optimized routes and reduced empty miles mean more profit per trip</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Flexible Schedule</h3>
                    <p className="opacity-90">Choose loads that fit your schedule and preferred routes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Average Monthly Earnings</h3>
              <div className="text-4xl font-bold mb-4">25,000 MAD</div>
              <p className="opacity-90 mb-6">Based on active drivers completing 15+ loads per month</p>
              <Link 
                href="/signup" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 inline-block"
              >
                Start Driving Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Fleet Managers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Fleet Managers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline operations and maximize fleet efficiency with our comprehensive management tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Driver Management</h3>
              <p className="text-gray-600">
                Manage your entire fleet from one dashboard. Track performance, assign loads, and optimize schedules.
              </p>
            </div>
            
            <div className="text-center">
              <Star className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
              <p className="text-gray-600">
                Detailed analytics and reporting to identify opportunities and track KPIs across your entire operation.
              </p>
            </div>
            
            <div className="text-center">
              <Truck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Vehicle Tracking</h3>
              <p className="text-gray-600">
                Real-time vehicle tracking, maintenance scheduling, and fuel optimization tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of transport logistics in Morocco. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Get Started Free
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">MarocTransit</span>
              </div>
              <p className="text-gray-300">
                Connecting Morocco through intelligent transport solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/news" className="hover:text-white">News</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white">System Status</Link></li>
                <li><Link href="/legal" className="hover:text-white">Legal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 MarocTransit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarocTransitLanding;