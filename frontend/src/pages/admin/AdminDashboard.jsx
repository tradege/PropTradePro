import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, DollarSign, TrendingUp, AlertCircle,
  CheckCircle, Clock, XCircle, Award
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    totalRevenue: 0,
    activeChallenges: 0,
    completedChallenges: 0,
    failedChallenges: 0,
    fundedAccounts: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        pendingKYC: 34,
        totalRevenue: 284750,
        activeChallenges: 456,
        completedChallenges: 189,
        failedChallenges: 67,
        fundedAccounts: 122,
      });

      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', created: '2 hours ago' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', created: '5 hours ago' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', created: '1 day ago' },
      ]);

      setRecentPayments([
        { id: 1, user: 'John Doe', amount: 299, program: 'Two Phase $100K', status: 'completed', date: '1 hour ago' },
        { id: 2, user: 'Jane Smith', amount: 499, program: 'Instant Funding $200K', status: 'completed', date: '3 hours ago' },
        { id: 3, user: 'Bob Johnson', amount: 199, program: 'One Phase $50K', status: 'pending', date: '5 hours ago' },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Overview of platform metrics and activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-2">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-400 mt-2">
                  +12.5% this month
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Challenges</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeChallenges}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {stats.completedChallenges} completed
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Pending KYC */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending KYC</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.pendingKYC}</p>
                <p className="text-xs text-yellow-400 mt-2">
                  Requires review
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">Completed</span>
            </div>
            <p className="text-4xl font-bold text-white mb-3">{stats.completedChallenges}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full shadow-lg" 
                style={{ width: `${(stats.completedChallenges / (stats.completedChallenges + stats.failedChallenges + stats.activeChallenges)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">Failed</span>
            </div>
            <p className="text-4xl font-bold text-white mb-3">{stats.failedChallenges}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-red-500 to-rose-500 h-2.5 rounded-full shadow-lg" 
                style={{ width: `${(stats.failedChallenges / (stats.completedChallenges + stats.failedChallenges + stats.activeChallenges)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">Funded</span>
            </div>
            <p className="text-4xl font-bold text-white mb-3">{stats.fundedAccounts}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2.5 rounded-full shadow-lg" 
                style={{ width: `${(stats.fundedAccounts / stats.completedChallenges) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Users */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Users</h2>
              <Link 
                to="/admin/users" 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{user.created}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Payments</h2>
              <Link 
                to="/admin/payments" 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{payment.user}</p>
                      <p className="text-sm text-gray-400">{payment.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${payment.amount}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {payment.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/admin/users" 
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Manage Users</p>
                <p className="text-sm text-gray-400">View and edit users</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/programs" 
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Manage Programs</p>
                <p className="text-sm text-gray-400">Create and edit programs</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/kyc" 
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">KYC Approval</p>
                <p className="text-sm text-gray-400">{stats.pendingKYC} pending</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/payments" 
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Payments</p>
                <p className="text-sm text-gray-400">Monitor transactions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

