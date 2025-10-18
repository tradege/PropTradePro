import React from 'react';
import Layout from '../components/layout/Layout';
import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Policy</span>
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300">
              PropTradePro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Date of birth and country of residence</li>
              <li>Payment information and billing address</li>
              <li>Government-issued ID for verification (KYC)</li>
              <li>Trading account information and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-300 mb-4">
              When you use our services, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Trading activity and performance data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send notifications</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Respond to your comments and questions</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate about promotions and new features</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-300 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
            </ul>
            <p className="text-gray-300 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-300 mt-4">
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Objection:</strong> Object to processing of your information</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, please contact us at privacy@proptradepro.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You can control cookies through your browser settings, but disabling them may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-gray-300">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              Email: privacy@proptradepro.com<br />
              Address: 123 Trading Street, Financial District, New York, NY 10004
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a href="/terms-of-service" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
            <p className="text-gray-300">Read our terms and conditions</p>
          </a>
          <a href="/risk-disclosure" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Risk Disclosure</h3>
            <p className="text-gray-300">Understand the risks of trading</p>
          </a>
        </div>
      </div>
    </div>
  );
}

