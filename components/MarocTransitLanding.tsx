'use client';

import React, { useState } from 'react';
import {
  Package,
  Truck,
  Clock,
  TrendingUp,
  MapPin,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  Award,
  ArrowRight,
  Star,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

const MarocTransitLanding = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFindCarriers = () => {
    console.log('Finding carriers from', origin, 'to', destination);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MaroccoTransit
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Contact</a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 font-medium">
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Services</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">About</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Contact</a>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-left mt-2">
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🚚</span>
              Revolutionary Transport Platform
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect Shippers with
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Carriers Instantly
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform Morocco's logistics industry with our AI-powered platform. 
              Optimize routes, reduce costs, and connect with verified carriers in real-time.
            </p>

            {/* Enhanced Carrier Matching Form */}
            <div className="max-w-4xl mx-auto mb-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  Find Your Perfect Carrier Match
                </h2>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Origin</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Casablanca"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Rabat"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleFindCarriers}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    Find Carriers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">30%</div>
                <div className="text-gray-600 font-medium">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">24%</div>
                <div className="text-gray-600 font-medium">Fuel Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">45%</div>
                <div className="text-gray-600 font-medium">Increased Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-gray-600 font-medium">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Advanced Technology
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Powered by <span className="text-blue-600">AI Innovation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge features that revolutionize transport logistics with intelligent automation and real-time optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Route Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart algorithms find the most efficient routes, saving time and fuel costs while ensuring timely deliveries.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Monitoring</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your shipments and fleet performance in real-time with comprehensive analytics and notifications.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Maintenance</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered maintenance scheduling prevents breakdowns and extends vehicle lifetime with smart predictions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Carrier Network</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with verified carriers across Morocco through our extensive network of trusted partners.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive insights and reporting tools to optimize your logistics operations and track performance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get matched with available carriers instantly using our AI-powered recommendation engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of companies already using MaroccoTransit to optimize their transport operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 text-lg rounded-lg transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">MaroccoTransit</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing Morocco's transport industry with AI-powered logistics solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Carriers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Route Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 MaroccoTransit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarocTransitLanding;