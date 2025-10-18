import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NewPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
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
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate(`/register?program=${programId}`);
    } else {
      navigate(`/checkout/${programId}`);
    }
  };

  const filteredPrograms = programs.filter(program => {
    if (selectedType !== 'all' && program.type !== selectedType) return false;
    if (selectedSize !== 'all') {
      const size = parseInt(selectedSize);
      if (program.account_size !== size) return false;
    }
    return true;
  });

  const programTypes = [
    { value: 'all', label: 'All Programs', desc: 'View all available programs' },
    { value: 'one_phase', label: 'One Phase', desc: 'Fast track to funding' },
    { value: 'two_phase', label: 'Two Phase', desc: 'Standard evaluation' },
    { value: 'instant', label: 'Instant Funding', desc: 'Start trading immediately' },
  ];

  const accountSizes = [
    { value: 'all', label: 'All Sizes' },
    { value: '5000', label: '$5,000' },
    { value: '10000', label: '$10,000' },
    { value: '25000', label: '$25,000' },
    { value: '50000', label: '$50,000' },
    { value: '100000', label: '$100,000' },
  ];

  return (
    <Layout>
      <div>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PropTradePro
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link to="/programs" className="text-white font-semibold">Programs</Link>
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
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Programs</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the challenge that fits your trading style, experience level, and goals. All programs include our industry-leading features and support.
          </p>
        </div>
      </section>

      {/* Program Type Selector */}
      <section className="py-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-4">
            {programTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-6 rounded-xl border-2 transition text-left ${
                  selectedType === type.value
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50'
                }`}
              >
                <h3 className="text-lg font-bold text-white mb-2">{type.label}</h3>
                <p className="text-sm text-gray-400">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Account Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {accountSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-gray-400">
              Showing <span className="text-white font-semibold">{filteredPrograms.length}</span> programs
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4">Loading programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-xl">No programs found matching your criteria</p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedSize('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <div 
                  key={program.id}
                  className="bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-500/50 transition transform hover:scale-105"
                >
                  {/* Program Header */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm font-semibold">
                        {program.type === 'one_phase' ? '1 Phase' : program.type === 'two_phase' ? '2 Phase' : 'Instant'}
                      </span>
                      {program.is_popular && (
                        <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{program.name}</h3>
                    <p className="text-gray-300">{program.description}</p>
                  </div>

                  {/* Program Details */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">💰</span>
                          <span className="text-gray-400">Account Size</span>
                        </div>
                        <span className="text-white font-bold text-lg">${program.account_size.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🎯</span>
                          <span className="text-gray-400">Profit Target</span>
                        </div>
                        <span className="text-green-400 font-bold text-lg">{program.profit_target}%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">⚠️</span>
                          <span className="text-gray-400">Max Daily Loss</span>
                        </div>
                        <span className="text-red-400 font-bold text-lg">{program.max_daily_loss}%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">📊</span>
                          <span className="text-gray-400">Max Drawdown</span>
                        </div>
                        <span className="text-orange-400 font-bold text-lg">{program.max_drawdown}%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">💵</span>
                          <span className="text-gray-400">Profit Split</span>
                        </div>
                        <span className="text-blue-400 font-bold text-lg">{program.profit_split}%</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Unlimited trading days
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          EAs & bots allowed
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Hold over weekend
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Trade through news
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          MT4/MT5 platforms
                        </li>
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="border-t border-slate-700 pt-6">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-white">${program.price}</span>
                          <span className="text-gray-400 ml-2">one-time</span>
                        </div>
                        {program.original_price && program.original_price > program.price && (
                          <span className="text-gray-500 line-through">${program.original_price}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleGetStarted(program.id)}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
                      >
                        Get Started
                      </button>

                      <Link
                        to={`/programs/${program.id}`}
                        className="block text-center mt-3 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Full Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Compare Programs</h2>
            <p className="text-xl text-gray-400">Find the perfect match for your trading style</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-slate-900 rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">One Phase</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Two Phase</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Instant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr>
                  <td className="px-6 py-4 text-gray-300">Evaluation Steps</td>
                  <td className="px-6 py-4 text-center text-white">1 Step</td>
                  <td className="px-6 py-4 text-center text-white">2 Steps</td>
                  <td className="px-6 py-4 text-center text-white">None</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Time to Get Funded</td>
                  <td className="px-6 py-4 text-center text-white">7-14 days</td>
                  <td className="px-6 py-4 text-center text-white">14-30 days</td>
                  <td className="px-6 py-4 text-center text-green-400 font-semibold">Instant</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Max Account Size</td>
                  <td className="px-6 py-4 text-center text-white">$100K</td>
                  <td className="px-6 py-4 text-center text-white">$400K</td>
                  <td className="px-6 py-4 text-center text-white">$50K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Profit Split</td>
                  <td className="px-6 py-4 text-center text-white">Up to 85%</td>
                  <td className="px-6 py-4 text-center text-white">Up to 90%</td>
                  <td className="px-6 py-4 text-center text-white">Up to 80%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Best For</td>
                  <td className="px-6 py-4 text-center text-gray-400 text-sm">Fast traders</td>
                  <td className="px-6 py-4 text-center text-gray-400 text-sm">Serious traders</td>
                  <td className="px-6 py-4 text-center text-gray-400 text-sm">Experienced traders</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What happens after I purchase a program?',
                a: 'You\'ll receive instant access to your trading account credentials via email. You can start trading immediately on MT4/MT5 platforms.'
              },
              {
                q: 'Can I upgrade my account later?',
                a: 'Yes! Once you pass your current challenge, you can scale up to larger account sizes with better profit splits.'
              },
              {
                q: 'Are there any monthly fees?',
                a: 'No! All our programs are one-time payments. There are no hidden fees or monthly subscriptions.'
              },
              {
                q: 'What if I fail the challenge?',
                a: 'You can retry the challenge with a discount, or choose a different program that better fits your trading style.'
              },
            ].map((faq, index) => (
              <details key={index} className="bg-slate-800 rounded-lg p-6 group">
                <summary className="cursor-pointer text-white font-semibold flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Funded?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose your program and start your journey to becoming a funded trader
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
                <li><Link to="/programs?type=one_phase" className="text-gray-400 hover:text-white">One Phase</Link></li>
                <li><Link to="/programs?type=two_phase" className="text-gray-400 hover:text-white">Two Phase</Link></li>
                <li><Link to="/programs?type=instant" className="text-gray-400 hover:text-white">Instant Funding</Link></li>
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

