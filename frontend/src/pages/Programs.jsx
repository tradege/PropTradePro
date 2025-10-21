import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { Check, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      setPrograms(response.data.programs || []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getProgramIcon = (type) => {
    switch (type) {
      case 'instant_funding':
        return <Zap className="w-6 h-6" />;
      case 'one_phase':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getProgramColor = (type) => {
    switch (type) {
      case 'instant_funding':
        return 'from-yellow-500 to-orange-600';
      case 'one_phase':
        return 'from-green-500 to-emerald-600';
      case 'two_phase':
        return 'from-blue-500 to-indigo-600';
      case 'three_phase':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Trading Challenge
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Select the program that fits your trading style and start your journey to becoming a funded trader
            </p>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className={`bg-gradient-to-br ${getProgramColor(program.type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      {getProgramIcon(program.type)}
                    </div>
                    {program.is_popular && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                  <p className="text-white/90 text-sm">{program.description || 'Professional trading challenge'}</p>
                </div>

                {/* Pricing */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">${program.price}</span>
                    <span className="text-gray-600">one-time</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Account Size: <span className="font-medium text-gray-900">${program.account_size.toLocaleString()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Profit Target: {program.profit_target}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Max Daily Loss: {program.max_daily_loss}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Max Total Loss: {program.max_total_loss}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Profit Split: {program.profit_split}%</span>
                  </div>
                  {program.min_trading_days && (
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Min Trading Days: {program.min_trading_days}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate(`/programs/${program.id}`)}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Proven Track Record</h3>
            <p className="text-gray-600">
              Join thousands of successful traders who have achieved their funding goals
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Transparent</h3>
            <p className="text-gray-600">
              All trades are monitored in real-time with complete transparency
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Payouts</h3>
            <p className="text-gray-600">
              Get your profits paid out quickly with our streamlined process
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

