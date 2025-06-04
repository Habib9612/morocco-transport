"use client";

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-400">🚛 MarocTransit</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Services</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Shippers with Carriers 
              <span className="text-blue-400"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionary transport platform transforming Morocco's logistics industry with AI-powered solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold">
                Get Started
              </button>
              <button className="bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">30%</div>
              <div className="text-xl font-semibold mb-2">Cost Reduction</div>
              <div className="text-gray-400">Average savings for our clients</div>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">24%</div>
              <div className="text-xl font-semibold mb-2">Fuel Savings</div>
              <div className="text-gray-400">Through optimized routes</div>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="text-4xl font-bold text-purple-400 mb-2">45%</div>
              <div className="text-xl font-semibold mb-2">Increased Efficiency</div>
              <div className="text-gray-400">Faster delivery times</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-400">Cutting-edge features that revolutionize transport logistics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Predictive Maintenance</h3>
              <p className="text-gray-400">AI-powered maintenance scheduling prevents breakdowns and reduces costs</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Route Optimization</h3>
              <p className="text-gray-400">Smart algorithms find the most efficient routes saving time and fuel</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Monitoring</h3>
              <p className="text-gray-400">Track your shipments and fleet performance in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Carrier Matching Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Carrier Matching</h2>
            <p className="text-xl text-gray-400">Find the perfect carrier for your shipment instantly</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origin</label>
                <input 
                  type="text" 
                  placeholder="Enter pickup location"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Enter delivery location"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold">
                Find Carriers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-4">🚛 MarocTransit</div>
            <p className="text-gray-400 mb-4">Revolutionizing Morocco's transport industry</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500">© 2025 MarocTransit. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
