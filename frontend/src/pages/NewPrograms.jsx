import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';

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
    { value: '200000', label: '$200,000' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Trading Programs</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect challenge that matches your trading style and experience level
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Program Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Program Type</label>
              <div className="grid grid-cols-2 gap-3">
                {programTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedType === type.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-slate-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-white font-semibold mb-1">{type.label}</div>
                    <div className="text-gray-400 text-sm">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Size Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Account Size</label>
              <div className="grid grid-cols-2 gap-3">
                {accountSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedSize === size.value
                        ? 'border-purple-500 bg-purple-500/10 text-white font-semibold'
                        : 'border-gray-700 bg-slate-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{filteredPrograms.length}</span> program{filteredPrograms.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-xl mb-4">No programs match your filters</p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedSize('all');
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
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
                      <span className="text-gray-400">Max Loss</span>
                      <span className="text-orange-400 font-semibold">{program.max_loss}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Split</span>
                      <span className="text-blue-400 font-semibold">{program.profit_split}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Trading Days</span>
                      <span className="text-purple-400 font-semibold">{program.min_trading_days}</span>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Funded?</h2>
          <p className="text-xl text-blue-100 mb-8">Start your trading journey today with PropTradePro</p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>
      </section>
    </Layout>
  );
}
