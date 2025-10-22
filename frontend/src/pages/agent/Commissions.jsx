import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Calendar } from 'lucide-react';
import AgentLayout from '../../components/agent/AgentLayout';
import api from '../../services/api';

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/agent/commissions');
      setCommissions(response.data.commissions || []);
      calculateStats(response.data.commissions || []);
    } catch (error) {
      console.error('Error loading commissions:', error);
      setCommissions([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (commissionsData) => {
    const stats = {
      totalEarned: 0,
      pendingCommissions: 0,
      paidCommissions: 0,
      thisMonth: 0,
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    commissionsData.forEach((commission) => {
      const commissionDate = new Date(commission.date);
      
      if (commission.status === 'paid') {
        stats.totalEarned += commission.amount;
        stats.paidCommissions += commission.amount;
      } else if (commission.status === 'pending') {
        stats.pendingCommissions += commission.amount;
      }

      if (commissionDate.getMonth() === currentMonth && commissionDate.getFullYear() === currentYear) {
        stats.thisMonth += commission.amount;
      }
    });

    setStats(stats);
  };

  const exportCommissions = () => {
    const headers = ['Date', 'Trader', 'Type', 'Program', 'Amount', 'Rate', 'Status', 'Payout Date'];
    const rows = filteredCommissions.map((commission) => [
      new Date(commission.date).toLocaleDateString(),
      commission.trader.name,
      commission.type,
      commission.program,
      commission.amount,
      `${commission.rate}%`,
      commission.status,
      commission.payout_date ? new Date(commission.payout_date).toLocaleDateString() : 'Pending',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredCommissions = commissions.filter((commission) => {
    if (filterPeriod === 'all') return true;
    
    const commissionDate = new Date(commission.date);
    const now = new Date();
    
    if (filterPeriod === 'this_month') {
      return commissionDate.getMonth() === now.getMonth() && 
             commissionDate.getFullYear() === now.getFullYear();
    } else if (filterPeriod === 'last_month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return commissionDate.getMonth() === lastMonth.getMonth() && 
             commissionDate.getFullYear() === lastMonth.getFullYear();
    } else if (filterPeriod === 'this_year') {
      return commissionDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'enrollment':
        return 'bg-blue-100 text-blue-800';
      case 'profit_share':
        return 'bg-green-100 text-green-800';
      case 'renewal':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AgentLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading commissions...</p>
          </div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
                <p className="text-gray-600 mt-2">Track your earnings and payouts</p>
              </div>
              <button
                onClick={exportCommissions}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.totalEarned.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.thisMonth.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.pendingCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid Out</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.paidCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="input"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>

          {/* Commissions Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trader
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payout Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(commission.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.trader.name}</div>
                        <div className="text-sm text-gray-500">{commission.trader.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(commission.type)}`}>
                          {commission.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {commission.program}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commission.rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ${commission.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                          {commission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commission.payout_date 
                          ? new Date(commission.payout_date).toLocaleDateString()
                          : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCommissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No commissions found</p>
              </div>
            )}
          </div>

          {/* Commission Types Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Enrollment Commission</h3>
              </div>
              <p className="text-sm text-gray-600">
                Earn commission when a trader enrolls in a program through your referral link.
              </p>
              <p className="text-lg font-bold text-blue-600 mt-2">30% Rate</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Profit Share Commission</h3>
              </div>
              <p className="text-sm text-gray-600">
                Earn commission from the profits generated by your traders on funded accounts.
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">10% Rate</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Renewal Commission</h3>
              </div>
              <p className="text-sm text-gray-600">
                Earn commission when your traders renew their challenge or upgrade their account.
              </p>
              <p className="text-lg font-bold text-purple-600 mt-2">20% Rate</p>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}

