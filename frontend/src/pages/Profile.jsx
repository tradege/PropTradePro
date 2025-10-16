import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import {
  User, Mail, Phone, Lock, Shield, CheckCircle,
  AlertCircle, QrCode, Key
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Personal Info
  const [personalData, setPersonalData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState(false);
  const [personalError, setPersonalError] = useState(null);

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // 2FA
  const [twoFactorQR, setTwoFactorQR] = useState(null);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState(null);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingPersonal(true);
    setPersonalError(null);
    setPersonalSuccess(false);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(personalData);
      setPersonalSuccess(true);
    } catch (err) {
      setPersonalError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Passwords do not match');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordSuccess(true);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    setTwoFactorError(null);

    try {
      const response = await authAPI.enable2FA();
      setTwoFactorQR(response.data.qr_code);
    } catch (err) {
      setTwoFactorError(err.response?.data?.error || 'Failed to enable 2FA');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await authAPI.verify2FA(twoFactorToken);
      updateUser({ two_factor_enabled: true });
      setTwoFactorQR(null);
      setTwoFactorToken('');
    } catch (err) {
      setTwoFactorError(err.response?.data?.error || 'Invalid 2FA token');
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      await authAPI.disable2FA();
      updateUser({ two_factor_enabled: false });
    } catch (err) {
      setTwoFactorError(err.response?.data?.error || 'Failed to disable 2FA');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'personal'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'security'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Security
              </button>
            </nav>
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="p-6">
              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={personalData.first_name}
                      onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={personalData.last_name}
                      onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email}
                      className="input pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={personalData.phone}
                      onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>

                {personalSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">Profile updated successfully!</p>
                  </div>
                )}

                {personalError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{personalError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUpdatingPersonal}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {isUpdatingPersonal ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-8">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="input"
                      required
                      minLength="8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  {passwordSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-800">Password changed successfully!</p>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{passwordError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {isUpdatingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Two-Factor Authentication
                </h3>

                {user?.two_factor_enabled ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">2FA is enabled</p>
                        <p className="text-sm text-green-800 mt-1">
                          Your account is protected with two-factor authentication
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDisable2FA}
                      className="btn btn-secondary"
                    >
                      Disable 2FA
                    </button>
                  </div>
                ) : twoFactorQR ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                      <img src={twoFactorQR} alt="2FA QR Code" className="w-48 h-48" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit code to verify
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={twoFactorToken}
                          onChange={(e) => setTwoFactorToken(e.target.value)}
                          placeholder="000000"
                          maxLength="6"
                          className="input text-center text-xl tracking-widest"
                        />
                        <button
                          onClick={handleVerify2FA}
                          disabled={twoFactorToken.length !== 6}
                          className="btn btn-primary disabled:opacity-50"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                    {twoFactorError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{twoFactorError}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button
                      onClick={handleEnable2FA}
                      disabled={isEnabling2FA}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {isEnabling2FA ? 'Setting up...' : 'Enable 2FA'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

