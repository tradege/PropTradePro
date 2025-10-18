import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NewHomePage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('two_phase');
  const navigate = useNavigate();

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

  const handleGetStarted = (programId) => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to register with program ID
      navigate(`/register?program=${programId}`);
    } else {
      // Redirect to checkout
      navigate(`/checkout/${programId}`);
    }
  };

  const filteredPrograms = programs.filter(p => p.type === selectedTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PropTradePro
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link to="/programs" className="text-gray-300 hover:text-white transition">Programs</Link>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white transition">How It Works</Link>
                <Link to="/about" className="text-gray-300 hover:text-white transition">About</Link>
                <Link to="/support" className="text-gray-300 hover:text-white transition">Support</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition"
              >
                Get Funded
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">YOUR TRUSTED TRADING PARTNER</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Trade with </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Capital</span>
            <br />
            <span className="text-white">Keep the </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Profits</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of traders worldwide and become a funded trader with the most flexible and trader-friendly prop firm.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
            >
              Start Trading Now
            </Link>
            <Link 
              to="/programs" 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white font-bold text-lg hover:bg-white/20 transition"
            >
              Explore Programs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$10M+</div>
              <div className="text-gray-400">Capital Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">5,000+</div>
              <div className="text-gray-400">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">90%</div>
              <div className="text-gray-400">Profit Split</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Promotions */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Active Promotions</h3>
                <span className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm font-semibold">LIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">20% OFF All Programs</div>
                    <div className="text-gray-400 text-sm">Code: WELCOME20</div>
                  </div>
                  <div className="text-blue-400 font-bold">-20%</div>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Latest Updates</h3>
                <span className="px-3 py-1 bg-purple-500 rounded-full text-white text-sm font-semibold">NEW</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-white font-semibold mb-1">New Dashboard Launched</div>
                  <div className="text-gray-400 text-sm">Advanced analytics and performance tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Challenge</h2>
            <p className="text-xl text-gray-400">Select the program that fits your trading style and goals</p>
          </div>

          {/* Program Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('one_phase')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedTab === 'one_phase'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                One Phase
              </button>
              <button
                onClick={() => setSelectedTab('two_phase')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedTab === 'two_phase'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Two Phase
              </button>
              <button
                onClick={() => setSelectedTab('instant')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedTab === 'instant'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Instant Funding
              </button>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center text-gray-400">Loading programs...</div>
            ) : filteredPrograms.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400">No programs available for this category</div>
            ) : (
              filteredPrograms.map((program) => (
                <div 
                  key={program.id}
                  className="bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{program.name}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                      {program.type === 'one_phase' ? '1 Phase' : program.type === 'two_phase' ? '2 Phase' : 'Instant'}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-6">{program.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Size</span>
                      <span className="text-white font-semibold">${program.account_size.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Target</span>
                      <span className="text-green-400 font-semibold">{program.profit_target}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Daily Loss</span>
                      <span className="text-red-400 font-semibold">{program.max_daily_loss}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Split</span>
                      <span className="text-blue-400 font-semibold">{program.profit_split}%</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-bold text-white">${program.price}</span>
                        <span className="text-gray-400 ml-2">one-time</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGetStarted(program.id)}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition"
                  >
                    Get Started
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose PropTradePro?</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed as a funded trader</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Up to $400K Capital', desc: 'Start with capital up to $400,000' },
              { icon: '⚡', title: 'Fast Payouts', desc: 'Request payouts anytime, receive within 24h' },
              { icon: '📈', title: 'Up to 90% Split', desc: 'Keep up to 90% of your profits' },
              { icon: '🤖', title: 'EAs Allowed', desc: 'Use expert advisors and bots' },
              { icon: '🌍', title: 'Trade Anywhere', desc: 'Access from any device, anywhere' },
              { icon: '📊', title: 'Advanced Dashboard', desc: 'Real-time analytics and insights' },
              { icon: '🔒', title: 'Secure & Reliable', desc: 'Your funds are safe with us' },
              { icon: '🎯', title: 'No Consistency Rules', desc: 'Trade your way without restrictions' },
              { icon: '📱', title: 'MT4/MT5 Support', desc: 'Use your favorite platform' },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to become a funded trader</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Choose Your Program</h3>
              <p className="text-gray-400 mb-6">
                Select the challenge that matches your trading style and experience level. Customize it to fit your needs.
              </p>
              <Link to="/programs" className="text-blue-400 hover:text-blue-300 font-semibold">
                View Programs →
              </Link>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pass the Challenge</h3>
              <p className="text-gray-400 mb-6">
                Trade with discipline, meet the profit targets while staying within risk parameters. We're here to support you.
              </p>
              <Link to="/how-it-works" className="text-purple-400 hover:text-purple-300 font-semibold">
                Learn More →
              </Link>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Paid</h3>
              <p className="text-gray-400 mb-6">
                Start earning real money. Request payouts anytime and receive your profits within 24 hours. Scale up to $4M.
              </p>
              <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold">
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful traders and get funded today
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">PropTradePro</h3>
              <p className="text-gray-400">
                Professional prop trading platform for ambitious traders.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Programs</h4>
              <ul className="space-y-2">
                <li><Link to="/programs" className="text-gray-400 hover:text-white">All Programs</Link></li>
                <li><Link to="/programs/starter" className="text-gray-400 hover:text-white">Starter Challenge</Link></li>
                <li><Link to="/programs/professional" className="text-gray-400 hover:text-white">Professional</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/risk" className="text-gray-400 hover:text-white">Risk Disclosure</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 PropTradePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

