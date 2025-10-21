import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import UserLayout from '../../components/mui/UserLayout';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_code: '',
    date_of_birth: '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load profile data
      const profileResponse = await api.get('/profile');
      const userData = profileResponse.data.user;
      
      // Load statistics
      const statsResponse = await api.get('/users/dashboard');
      const statsData = statsResponse.data.statistics;
      
      // Update form data
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country_code: userData.country_code || '',
        date_of_birth: userData.date_of_birth || '',
      });
      
      // Update stats
      setStats(statsData);
      
      // Update user in auth store
      setUser(userData);
      
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError(error.response?.data?.error || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await api.put('/profile', formData);
      
      // Update user in auth store
      setUser(response.data.user);
      
      setSuccess(true);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        country_code: user.country_code || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  const displayStats = [
    { 
      label: 'Total Challenges', 
      value: stats?.total_challenges || 0, 
      color: '#667eea' 
    },
    { 
      label: 'Success Rate', 
      value: `${stats?.success_rate || 0}%`, 
      color: '#43e97b' 
    },
    { 
      label: 'Total Profit', 
      value: `$${(stats?.total_profit || 0).toLocaleString()}`, 
      color: '#4facfe' 
    },
    { 
      label: 'Member Since', 
      value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', 
      color: '#f093fb' 
    },
  ];

  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Profile Header Card */}
        <Card sx={{ mb: 3, bgcolor: '#1a1f2e', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={user?.avatar_url}
                sx={{
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  mr: 3,
                }}
              >
                {formData.first_name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {formData.first_name} {formData.last_name}
                </Typography>
                <Chip
                  label={user?.role || 'Guest'}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                disabled={isSaving}
                sx={{
                  background: isEditing ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderColor: isEditing ? '#667eea' : 'transparent',
                  color: 'white',
                  '&:hover': {
                    background: isEditing ? 'rgba(102, 126, 234, 0.1)' : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={2}>
              {displayStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: stat.color, fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card sx={{ bgcolor: '#1a1f2e', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
              Personal Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: '#4facfe' }} />,
                  }}
                  helperText={isEditing ? "Changing email will require re-verification" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: '#43e97b' }} />,
                  }}
                  placeholder="+1234567890"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country Code"
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: '#f093fb' }} />,
                  }}
                  placeholder="US"
                  helperText="2-letter ISO country code"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: '#667eea' }} />,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {isEditing && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isSaving}
                      sx={{ borderColor: '#667eea', color: '#667eea' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card sx={{ mt: 3, bgcolor: '#1a1f2e', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
              Account Status
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Alert 
                  severity={user?.is_verified ? "success" : "warning"} 
                  sx={{ bgcolor: user?.is_verified ? 'rgba(67, 233, 123, 0.1)' : 'rgba(250, 112, 154, 0.1)' }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.is_verified ? 'Email Verified ✓' : 'Email Not Verified'}
                  </Typography>
                  <Typography variant="caption">
                    {user?.is_verified ? 'Your email has been verified' : 'Please verify your email address'}
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Alert 
                  severity={user?.kyc_status === 'approved' ? "success" : user?.kyc_status === 'pending' ? "info" : "warning"} 
                  sx={{ 
                    bgcolor: user?.kyc_status === 'approved' 
                      ? 'rgba(67, 233, 123, 0.1)' 
                      : user?.kyc_status === 'pending' 
                      ? 'rgba(79, 172, 254, 0.1)' 
                      : 'rgba(250, 112, 154, 0.1)' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    KYC {user?.kyc_status === 'approved' ? 'Approved ✓' : user?.kyc_status === 'pending' ? 'Pending Review' : 'Not Submitted'}
                  </Typography>
                  <Typography variant="caption">
                    {user?.kyc_status === 'approved' 
                      ? 'Your identity has been verified' 
                      : user?.kyc_status === 'pending' 
                      ? 'Your documents are being reviewed' 
                      : 'Complete your verification to unlock all features'}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Success Snackbar */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          message="Profile updated successfully!"
        />
      </Box>
    </UserLayout>
  );
}

