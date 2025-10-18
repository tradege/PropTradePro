import React from 'react';
import Layout from '../components/layout/Layout';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RiskDisclosure() {
  return (
    <Layout>
      <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Disclosure</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Important information about the risks of trading
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">Important Warning</h3>
              <p className="text-gray-300">
                Trading foreign exchange, contracts for difference (CFDs), and other leveraged products carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">General Risk Warning</h2>
            <p className="text-gray-300 mb-4">
              Trading in financial markets involves substantial risk of loss and is not suitable for every investor. The high degree of leverage that is often obtainable in trading can work against you as well as for you. The use of leverage can lead to large losses as well as gains.
            </p>
            <p className="text-gray-300">
              Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. You should only trade with money you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Specific Risks</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">1. Market Risk</h3>
            <p className="text-gray-300 mb-4">
              Financial markets are volatile and can move rapidly against your position. Prices can be affected by numerous factors including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Economic data releases and indicators</li>
              <li>Political events and policy changes</li>
              <li>Natural disasters and global events</li>
              <li>Market sentiment and speculation</li>
              <li>Liquidity conditions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2. Leverage Risk</h3>
            <p className="text-gray-300 mb-4">
              Leverage amplifies both potential profits and potential losses. A small market movement can result in proportionally larger movements in your account balance. You could lose more than your initial investment.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3. Volatility Risk</h3>
            <p className="text-gray-300 mb-4">
              Markets can experience periods of extreme volatility, especially during major news events or market disruptions. This can lead to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Rapid price movements</li>
              <li>Widened spreads</li>
              <li>Slippage on orders</li>
              <li>Difficulty closing positions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4. Liquidity Risk</h3>
            <p className="text-gray-300 mb-4">
              During periods of low liquidity, you may not be able to close positions at desired prices. This can occur during:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Market opening and closing times</li>
              <li>Major news announcements</li>
              <li>Weekends and holidays</li>
              <li>Market disruptions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5. Technology Risk</h3>
            <p className="text-gray-300 mb-4">
              Technical issues can affect your ability to trade, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Internet connectivity problems</li>
              <li>Platform malfunctions</li>
              <li>Server outages</li>
              <li>Cyber security threats</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6. Counterparty Risk</h3>
            <p className="text-gray-300">
              There is a risk that the counterparty to your trades may default on their obligations. While we work with reputable liquidity providers, this risk cannot be completely eliminated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">PropTradePro Specific Risks</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Challenge Evaluation</h3>
            <p className="text-gray-300 mb-4">
              There is no guarantee that you will pass the challenge evaluation. Most traders do not pass on their first attempt. Challenge fees are non-refundable once trading begins.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Funded Account Rules</h3>
            <p className="text-gray-300 mb-4">
              Violation of trading rules can result in immediate termination of your funded account. Rules include but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Daily and total drawdown limits</li>
              <li>Prohibited trading strategies</li>
              <li>Minimum trading days</li>
              <li>Position sizing requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Profit Withdrawals</h3>
            <p className="text-gray-300">
              While we strive to process withdrawals promptly, there may be delays due to verification processes, compliance requirements, or technical issues. Withdrawals are subject to our terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">No Guarantee of Profits</h2>
            <p className="text-gray-300 mb-4">
              Past performance is not indicative of future results. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown in any marketing materials or testimonials.
            </p>
            <p className="text-gray-300">
              Success in trading requires skill, discipline, and proper risk management. There is no guarantee that you will make money or become a profitable trader.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Educational Purpose</h2>
            <p className="text-gray-300">
              Information provided by PropTradePro is for educational purposes only and should not be considered as financial advice. You should seek independent financial advice before making any trading decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Regulatory Status</h2>
            <p className="text-gray-300">
              PropTradePro is a proprietary trading firm and not a regulated financial institution. We do not provide investment advice or manage client funds. All trading is conducted on demo accounts during evaluation and on our proprietary capital for funded traders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Acknowledgment</h2>
            <p className="text-gray-300 mb-4">
              By using PropTradePro's services, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You have read and understood this Risk Disclosure</li>
              <li>You understand the risks involved in trading</li>
              <li>You accept full responsibility for your trading decisions</li>
              <li>You are trading with money you can afford to lose</li>
              <li>You will not hold PropTradePro liable for any losses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Questions</h2>
            <p className="text-gray-300">
              If you have any questions about the risks of trading or our services, please contact us at:
            </p>
            <p className="text-gray-300 mt-4">
              Email: support@proptradepro.com<br />
              Address: 123 Trading Street, Financial District, New York, NY 10004
            </p>
          </section>
        </div>

        {/* Final Warning */}
        <div className="mt-12 bg-orange-500/20 border-2 border-orange-500/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-400 mb-3">Final Reminder</h3>
          <p className="text-gray-300">
            Trading is not suitable for everyone. Only trade with money you can afford to lose. If you are unsure about trading, seek independent financial advice. PropTradePro is not responsible for any losses you may incur.
          </p>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a href="/terms-of-service" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
            <p className="text-gray-300">Read our terms and conditions</p>
          </a>
          <a href="/privacy-policy" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
            <p className="text-gray-300">Learn how we protect your data</p>
          </a>
        </div>
      </div>
    </div>
  );
}

