import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default function HomePage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPrograms();
  }, []);
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/programs/`);
      setPrograms(response.data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Trade with <span className="text-blue-400">Confidence</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of traders who trust PropTradePro to fund their trading careers. 
              Get access to capital, keep up to 90% of profits, and trade with confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Start Trading
              </Link>
                to="/programs"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                View Programs
            </div>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">$10M+</div>
              <div className="text-gray-400">Capital Deployed</div>
              <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
              <div className="text-gray-400">Active Traders</div>
              <div className="text-4xl font-bold text-blue-400 mb-2">90%</div>
              <div className="text-gray-400">Profit Split</div>
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
      {/* Programs Section */}
      <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Challenge</h2>
            <p className="text-xl text-gray-400">Select the program that fits your trading style</p>
          {loading ? (
            <div className="text-center text-gray-400">Loading programs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">{program.name}</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {program.type === 'one_phase' ? '1 Phase' : '2 Phase'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-6">{program.description}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Size</span>
                      <span className="text-white font-semibold">
                        ${program.account_size.toLocaleString()}
                      </span>
                    </div>
                      <span className="text-gray-400">Profit Target</span>
                      <span className="text-green-400 font-semibold">{program.profit_target}%</span>
                      <span className="text-gray-400">Max Daily Loss</span>
                      <span className="text-red-400 font-semibold">{program.max_daily_loss}%</span>
                      <span className="text-gray-400">Profit Split</span>
                      <span className="text-blue-400 font-semibold">{program.profit_split}%</span>
                  <div className="border-t border-gray-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-white">${program.price}</span>
                      <span className="text-gray-400">one-time</span>
                    <Link
                      to={`/programs/${program.id}`}
                      className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-all"
                    >
                      Get Started
                    </Link>
                </div>
              ))}
          )}
      {/* Features Section */}
      <div className="bg-gray-800/50 py-20">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose PropTradePro?</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed as a trader</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Funded Accounts</h3>
              <p className="text-gray-400">
                Get access to trading capital up to $100,000 and keep up to 90% of your profits.
              </p>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              <h3 className="text-xl font-bold text-white mb-2">Risk Management</h3>
                Clear rules and risk parameters to help you trade with confidence and discipline.
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              <h3 className="text-xl font-bold text-white mb-2">Fast Payouts</h3>
                Request payouts anytime and receive your profits within 24 hours.
      {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of successful traders and get funded today.
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Create Free Account
          </Link>
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <h3 className="text-white font-bold text-lg mb-4">PropTradePro</h3>
              <p className="text-gray-400 text-sm">
                Professional prop trading platform for ambitious traders.
              <h4 className="text-white font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/programs" className="hover:text-white">All Programs</Link></li>
                <li><Link to="/programs" className="hover:text-white">Starter Challenge</Link></li>
                <li><Link to="/programs" className="hover:text-white">Professional</Link></li>
              </ul>
              <h4 className="text-white font-semibold mb-4">Company</h4>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/risk" className="hover:text-white">Risk Disclosure</Link></li>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} PropTradePro. All rights reserved.</p>
      </footer>
    </div>
  );
}
