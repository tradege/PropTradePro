import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard, Users, TrendingUp, DollarSign,
  FileText, Settings, LogOut, Menu, X, Home, Shield
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { name: 'Users', href: '/admin/users', icon: Users, color: 'from-purple-500 to-pink-500' },
    { name: 'Programs', href: '/admin/programs', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    { name: 'KYC Approval', href: '/admin/kyc', icon: FileText, color: 'from-indigo-500 to-purple-500' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'super_admin': return '👑';
      case 'operator': return '🛡️';
      case 'agent': return '📈';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'super_admin': return 'from-purple-500 to-pink-500';
      case 'operator': return 'from-blue-500 to-cyan-500';
      case 'agent': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Top Navigation */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">PT</span>
                </div>
                <span className="text-xl font-bold text-white hidden sm:block">
                  PropTradePro <span className="text-blue-400">Admin</span>
                </span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors hidden sm:flex"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center text-lg`}>
                    {getRoleIcon(user?.role)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 bg-gray-800/30 border-r border-gray-700 h-[calc(100vh-4rem)] sticky top-16 backdrop-blur-sm">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={`${active ? '' : 'group-hover:scale-110 transition-transform'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">System Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
              <nav className="p-4 space-y-2 mt-16">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

