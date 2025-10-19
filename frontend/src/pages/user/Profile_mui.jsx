import { useState } from 'react';
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

export default function Profile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    bio: 'Professional trader with 5+ years of experience in forex and crypto markets.',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: API call to update profile
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Challenges', value: '12', color: '#667eea' },
    { label: 'Success Rate', value: '75%', color: '#43e97b' },
    { label: 'Total Profit', value: '$45,230', color: '#4facfe' },
    { label: 'Member Since', value: 'Jan 2024', color: '#f093fb' },
  ];

  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
          My Profile
        </Typography>

        {/* Profile Header Card */}
        <Card sx={{ mb: 3, bgcolor: '#1a1f2e', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  mr: 3,
                }}
              >
                {formData.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {formData.name}
                </Typography>
                <Chip
                  label={user?.role || 'Trader'}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={() => setIsEditing(!isEditing)}
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
              {stats.map((stat, index) => (
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
                  label="Full Name"
                  name="name"
                  value={formData.name}
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: '#f093fb' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                />
              </Grid>

              {isEditing && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      sx={{ borderColor: '#667eea', color: '#667eea' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      }}
                    >
                      Save Changes
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
                <Alert severity="success" sx={{ bgcolor: 'rgba(67, 233, 123, 0.1)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Email Verified ✓
                  </Typography>
                  <Typography variant="caption">
                    Your email has been verified
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Alert severity="warning" sx={{ bgcolor: 'rgba(250, 112, 154, 0.1)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    KYC Pending
                  </Typography>
                  <Typography variant="caption">
                    Complete your verification to unlock all features
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </UserLayout>
  );
}

