import { Grid, Typography, Box, Paper, LinearProgress } from '@mui/material';
import {
  People,
  AttachMoney,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';
import StatsCard from '../../components/mui/StatsCard';
import DataTable from '../../components/mui/DataTable';

// Mock data
const statsData = [
  {
    title: 'Total Users',
    value: '1,247',
    subtitle: '892 active',
    icon: People,
    color: 'primary',
    trend: 'up',
    trendValue: '+12.5%',
  },
  {
    title: 'Total Revenue',
    value: '$284,750',
    subtitle: '+12.5% this month',
    icon: AttachMoney,
    color: 'success',
    trend: 'up',
    trendValue: '+12.5%',
  },
  {
    title: 'Active Challenges',
    value: '456',
    subtitle: '189 completed',
    icon: TrendingUp,
    color: 'info',
    trend: 'up',
    trendValue: '+8.2%',
  },
  {
    title: 'Pending KYC',
    value: '34',
    subtitle: 'Requires review',
    icon: Assignment,
    color: 'warning',
  },
];

const recentUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Player',
    status: 'Active',
    joined: '2 hours ago',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Agent',
    status: 'Pending',
    joined: '5 hours ago',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Player',
    status: 'Active',
    joined: '1 day ago',
  },
];

const recentPayments = [
  {
    id: 1,
    user: 'John Doe',
    program: 'Two Phase $100K',
    amount: '$299',
    status: 'Completed',
    date: '1 hour ago',
  },
  {
    id: 2,
    user: 'Jane Smith',
    program: 'Instant Funding $200K',
    amount: '$499',
    status: 'Completed',
    date: '3 hours ago',
  },
  {
    id: 3,
    user: 'Bob Johnson',
    program: 'One Phase $50K',
    amount: '$199',
    status: 'Pending',
    date: '5 hours ago',
  },
];

const userColumns = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 100,
    format: (value) => (
      <Box
        component="span"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: value === 'Active' ? '#10b98120' : '#f59e0b20',
          color: value === 'Active' ? '#10b981' : '#f59e0b',
        }}
      >
        {value}
      </Box>
    ),
  },
  { id: 'joined', label: 'Joined', minWidth: 120 },
];

const paymentColumns = [
  { id: 'user', label: 'User', minWidth: 150 },
  { id: 'program', label: 'Program', minWidth: 200 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 100,
    format: (value) => (
      <Box
        component="span"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: value === 'Completed' ? '#10b98120' : '#f59e0b20',
          color: value === 'Completed' ? '#10b981' : '#f59e0b',
        }}
      >
        {value}
      </Box>
    ),
  },
  { id: 'date', label: 'Date', minWidth: 120 },
];

export default function AdminDashboard() {
  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of platform metrics and activity
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Challenge Progress */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Completed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                189
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'success.dark',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'success.main',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              75% success rate
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Failed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                67
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={25}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'error.dark',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'error.main',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              25% failure rate
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Funded
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                122
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'warning.dark',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'warning.main',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              65% funded accounts
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <DataTable
            title="Recent Users"
            columns={userColumns}
            rows={recentUsers}
            onView={(row) => console.log('View', row)}
            onEdit={(row) => console.log('Edit', row)}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <DataTable
            title="Recent Payments"
            columns={paymentColumns}
            rows={recentPayments}
            onView={(row) => console.log('View', row)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

