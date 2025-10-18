import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { programsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import {
  TrendingUp,
  DollarSign,
  Target,
  Award,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadChallenges();
  }, []);
  const loadChallenges = async () => {
    try {
      const response = await programsAPI.getMyChallenges();
      setChallenges(response.data.challenges || []);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
  const getStatusColor = (status) => {
        return 'bg-green-100 text-green-800';
        return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Here's your trading overview</p>
            </div>
            <Link to="/programs" className="btn btn-primary">
              Browse Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Challenges</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {challenges.filter((c) => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                <p className="text-sm text-gray-600">Total Profit</p>
                  ${challenges.reduce((sum, c) => sum + (c.total_profit || 0), 0).toLocaleString()}
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
                <p className="text-sm text-gray-600">Success Rate</p>
                  {challenges.length > 0
                    ? Math.round(
                        (challenges.filter((c) => c.status === 'passed').length / challenges.length) * 100
                      )
                    : 0}
                  %
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
                <p className="text-sm text-gray-600">Funded Accounts</p>
                  {challenges.filter((c) => c.status === 'funded').length}
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
        {/* Challenges List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Challenges</h2>
            {challenges.length > 0 && (
              <Link to="/challenges" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            )}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading challenges...</p>
          ) : challenges.length === 0 ? (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
              <p className="text-gray-600 mb-6">Start your trading journey by purchasing a challenge</p>
              <Link to="/programs" className="btn btn-primary inline-flex items-center">
                Browse Programs
                <ArrowRight className="w-4 h-4 ml-2" />
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(challenge.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">Challenge #{challenge.id}</h3>
                        <p className="text-sm text-gray-600">Program: {challenge.program?.name || 'N/A'}</p>
                      </div>
                    </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="font-medium text-gray-900">
                          ${(challenge.current_balance || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-medium text-gray-900">{challenge.progress || 0}%</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                        {challenge.status}
                      </span>
                      <Link
                        to={`/challenges/${challenge.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </Link>
                  </div>
                </div>
              ))}
          )}
        {/* KYC Alert */}
        {user && user.kyc_status !== 'approved' && (
          <div className="mt-6 card bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900">Complete KYC Verification</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  To withdraw profits and access all features, please complete your KYC verification.
                <Link to="/kyc" className="inline-block mt-3 text-sm font-medium text-yellow-900 hover:text-yellow-800">
                  Complete Verification →
                </Link>
        )}
    </div>
  );
}
