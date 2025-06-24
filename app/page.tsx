"use client";

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Navigation */}
      <nav className="bg-white shadow-lg border-b border-indigo-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                🚛 MarocTransit
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Morocco&apos;s Premier <span className="text-yellow-300">Transport Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              AI-powered logistics solutions connecting carriers and shippers across Morocco
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Get Started
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-gray-700 font-semibold">Cost Reduction</div>
              <p className="text-sm text-gray-600 mt-2">Save on transportation costs with optimized routes</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">24%</div>
              <div className="text-gray-700 font-semibold">Fuel Savings</div>
              <p className="text-sm text-gray-600 mt-2">Intelligent routing reduces fuel consumption</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl shadow-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">45%</div>
              <div className="text-gray-700 font-semibold">Increased Efficiency</div>
              <p className="text-sm text-gray-600 mt-2">Streamlined operations and real-time tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Match Form */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Find Your Perfect Carrier Match</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                <input 
                  type="text" 
                  placeholder="Enter origin city..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Enter destination city..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                🔍 Find Carriers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Advanced Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-md border border-orange-200">
              <div className="text-2xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Predictive Maintenance</h3>
              <p className="text-gray-600">AI-powered maintenance scheduling to prevent breakdowns</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl shadow-md border border-teal-200">
              <div className="text-2xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Route Optimization</h3>
              <p className="text-gray-600">Smart algorithms for efficient delivery routes</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl shadow-md border border-pink-200">
              <div className="text-2xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Monitoring</h3>
              <p className="text-gray-600">Live tracking and status updates for all shipments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}