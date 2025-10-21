import React from 'react';
import { FileText } from 'lucide-react';
import Layout from '../components/layout/Layout';

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Service</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Last Updated: January 1, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using MarketEdgePros's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-300">
              These Terms of Service constitute a legally binding agreement between you and MarketEdgePros. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
            <p className="text-gray-300 mb-4">
              MarketEdgePros provides proprietary trading evaluation services and funded trading accounts to qualified traders. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Trading challenge programs with various account sizes</li>
              <li>Funded trading accounts for successful traders</li>
              <li>Trading platform access (MetaTrader 5)</li>
              <li>Performance tracking and analytics</li>
              <li>Educational resources and support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility</h2>
            <p className="text-gray-300 mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be a resident of a restricted jurisdiction</li>
              <li>Provide accurate and complete registration information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Account Registration</h2>
            <p className="text-gray-300 mb-4">
              When creating an account, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide truthful, accurate, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your login credentials confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Trading Rules</h2>
            <p className="text-gray-300 mb-4">
              All traders must adhere to the following rules:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Maximum daily drawdown limits must be respected</li>
              <li>Maximum total drawdown limits must not be exceeded</li>
              <li>Minimum trading days requirements must be met</li>
              <li>Prohibited trading strategies are not allowed</li>
              <li>All trades must be executed in good faith</li>
              <li>Account manipulation or exploitation is strictly forbidden</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Fees and Payments</h2>
            <p className="text-gray-300 mb-4">
              Challenge fees are non-refundable once trading begins. Funded traders receive profit splits as outlined in their specific program. All fees are clearly disclosed before purchase.
            </p>
            <p className="text-gray-300">
              Withdrawal requests are processed within 1-3 business days. MarketEdgePros reserves the right to verify trades and account activity before processing withdrawals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300">
              All content, trademarks, and data on this platform, including but not limited to software, databases, text, graphics, icons, and hyperlinks, are the property of or licensed to MarketEdgePros and are protected by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              MarketEdgePros shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Trading involves substantial risk, and you acknowledge that you may lose money.
            </p>
            <p className="text-gray-300">
              We do not guarantee profits or success. Past performance does not indicate future results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <p className="text-gray-300">
              We reserve the right to suspend or terminate your account at any time for violation of these terms, suspicious activity, or at our sole discretion. Upon termination, your right to use our services will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
            <p className="text-gray-300">
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which MarketEdgePros is registered, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
            <p className="text-gray-300">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              Email: legal@marketedgepros.com<br />
              Address: 123 Trading Street, Financial District, New York, NY 10004
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a href="/privacy-policy" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
            <p className="text-gray-300">Learn how we protect your data</p>
          </a>
          <a href="/risk-disclosure" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Risk Disclosure</h3>
            <p className="text-gray-300">Understand the risks of trading</p>
          </a>
        </div>
      </div>
    </div>
    </Layout>
  );
}

