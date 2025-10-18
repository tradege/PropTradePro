import React from 'react';
import { UserPlus, Target, TrendingUp, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Sign Up & Choose Your Challenge',
      description: 'Create your account and select a challenge that matches your trading style and capital goals.',
      details: [
        'Choose from One-Phase, Two-Phase, or Instant Funding',
        'Select your preferred account size ($10K - $200K)',
        'Review the trading objectives and rules',
        'Complete your registration and payment'
      ],
      color: 'blue'
    },
    {
      number: 2,
      icon: Target,
      title: 'Pass Your Evaluation',
      description: 'Demonstrate your trading skills by meeting the profit targets while following risk management rules.',
      details: [
        'Trade on a demo account with real market conditions',
        'Meet the profit target (typically 8-10%)',
        'Stay within daily and overall drawdown limits',
        'Trade for minimum required days',
        'No prohibited trading strategies'
      ],
      color: 'purple'
    },
    {
      number: 3,
      icon: CheckCircle,
      title: 'Get Funded',
      description: 'Once you pass, receive your funded account and start trading with our capital.',
      details: [
        'Receive your funded account within 24 hours',
        'Get access to live MT5 trading account',
        'Start trading with real capital',
        'Keep up to 90% of your profits',
        'Scale your account based on performance'
      ],
      color: 'green'
    },
    {
      number: 4,
      icon: DollarSign,
      title: 'Withdraw Your Profits',
      description: 'Request withdrawals anytime and receive your profits quickly and securely.',
      details: [
        'Request withdrawals on-demand',
        'Receive profits within 1-3 business days',
        'Multiple payment methods available',
        'No minimum withdrawal amount',
        'Keep trading and earning continuously'
      ],
      color: 'yellow'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      gradient: 'from-blue-600 to-blue-400'
    },
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      gradient: 'from-purple-600 to-purple-400'
    },
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      gradient: 'from-green-600 to-green-400'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      gradient: 'from-yellow-600 to-yellow-400'
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Works</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Four simple steps to become a funded trader and start earning with our capital.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorClasses[step.color];
            
            return (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-12 top-32 w-0.5 h-32 bg-gradient-to-b from-white/20 to-transparent"></div>
                )}
                
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left Side - Icon and Title */}
                  <div className={`flex gap-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className={`flex-shrink-0 w-24 h-24 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <Icon className={`w-12 h-12 ${colors.text}`} />
                    </div>
                    <div>
                      <div className={`inline-block px-4 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-semibold mb-3`}>
                        Step {step.number}
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">{step.title}</h2>
                      <p className="text-gray-300 text-lg">{step.description}</p>
                    </div>
                  </div>

                  {/* Right Side - Details */}
                  <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <ul className="space-y-4">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Typical Timeline</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">Day 1</div>
              <div className="text-gray-300">Sign up and start trading</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">1-4 Weeks</div>
              <div className="text-gray-300">Complete your challenge</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">24 Hours</div>
              <div className="text-gray-300">Get your funded account</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">Ongoing</div>
              <div className="text-gray-300">Trade and withdraw profits</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Common Questions</h2>
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">What happens if I fail the challenge?</h3>
            <p className="text-gray-300">
              You can retry as many times as you want. Many successful traders pass on their second or third attempt. We also offer discounted retry options.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Is there a time limit for the challenge?</h3>
            <p className="text-gray-300">
              No! Take as long as you need. We believe in quality over speed. Focus on consistent, disciplined trading.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Can I trade any instrument?</h3>
            <p className="text-gray-300">
              Yes! Trade Forex, indices, commodities, and cryptocurrencies. All major instruments are available on our MT5 platform.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/faq" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-2">
            View All FAQs <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of traders who are already earning with PropTradePro.
          </p>
          <a
            href="/programs"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Choose Your Challenge
          </a>
        </div>
      </div>
    </div>
    </Layout>
  );
}

