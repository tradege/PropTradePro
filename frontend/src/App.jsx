import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Notification from './components/Notification';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Public Pages
import HomePage from './pages/NewHomePage';
import Programs from './pages/NewPrograms';
import ProgramDetails from './pages/ProgramDetails';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RiskDisclosure from './pages/RiskDisclosure';

// Shared Pages
import Dashboard from './pages/Dashboard';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import ChallengeDetails from './pages/ChallengeDetails';

// Admin Pages
import AdminLayout from './components/mui/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard_mui';
import UserManagement from './pages/admin/UserManagement_mui';
import ProgramsManagement from './pages/admin/ProgramsManagement_mui';
import PaymentsManagement from './pages/admin/PaymentsManagement_mui';
import KYCApproval from './pages/admin/KYCApproval_mui';
import Settings from './pages/admin/Settings_mui';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import TradersManagement from './pages/agent/TradersManagement';
import Commissions from './pages/agent/Commissions';
import Reports from './pages/agent/Reports';

// Trader Pages
import TraderDashboard from './pages/user/UserDashboard_mui';
import TradingHistory from './pages/trader/TradingHistory';
import Withdrawals from './pages/trader/Withdrawals';
import Documents from './pages/trader/Documents';

// Guards
import RoleGuard from './components/guards/RoleGuard';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Notification />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/risk-disclosure" element={<RiskDisclosure />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Shared Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kyc"
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges/:id"
          element={
            <ProtectedRoute>
              <ChallengeDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <ProgramsManagement />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <PaymentsManagement />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kyc"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <KYCApproval />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Agent Routes */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['agent']}>
                <AgentDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/traders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['agent']}>
                <TradersManagement />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/commissions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['agent']}>
                <Commissions />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/reports"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['agent']}>
                <Reports />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Trader Routes */}
        <Route
          path="/trader"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['trader']}>
                <TraderDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trader/history"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['trader']}>
                <TradingHistory />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trader/withdrawals"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['trader']}>
                <Withdrawals />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trader/documents"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['trader']}>
                <Documents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a href="/" className="btn btn-primary">
                  Go to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

