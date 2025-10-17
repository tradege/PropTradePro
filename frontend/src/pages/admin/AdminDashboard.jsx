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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of platform metrics and activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +12.5% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Challenges</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeChallenges}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {stats.completedChallenges} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending KYC */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending KYC</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingKYC}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Requires review
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedChallenges}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.completedChallenges / (stats.completedChallenges + stats.failedChallenges + stats.activeChallenges)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Failed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.failedChallenges}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${(stats.failedChallenges / (stats.completedChallenges + stats.failedChallenges + stats.activeChallenges)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Funded</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.fundedAccounts}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${(stats.fundedAccounts / stats.completedChallenges) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
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
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
              <Link to="/admin/payments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.user}</p>
                      <p className="text-sm text-gray-600">{payment.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${payment.amount}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">View and edit users</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/programs" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Programs</p>
                <p className="text-sm text-gray-600">Create and edit programs</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/kyc" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">KYC Approval</p>
                <p className="text-sm text-gray-600">{stats.pendingKYC} pending</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/payments" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Payments</p>
                <p className="text-sm text-gray-600">Monitor transactions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

