import { Box, Typography, Grid, Chip } from '@mui/material';
import { VerifiedUser, Schedule, Cancel, CheckCircle } from '@mui/icons-material';
import StatsCard from '../../components/mui/StatsCard';
import DataTable from '../../components/mui/DataTable';

const kycStats = [
  { title: 'Pending KYC', value: '34', subtitle: 'Requires review', icon: Schedule, color: 'warning' },
  { title: 'Approved', value: '892', subtitle: 'Verified users', icon: CheckCircle, color: 'success' },
  { title: 'Rejected', value: '45', subtitle: 'Failed verification', icon: Cancel, color: 'error' },
  { title: 'Verification Rate', value: '95%', subtitle: 'Success rate', icon: VerifiedUser, color: 'info' },
];

const kyc = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'pending', submittedAt: '2024-03-15', documentType: 'Passport' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'approved', submittedAt: '2024-03-14', documentType: 'Driver License' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', submittedAt: '2024-03-13', documentType: 'National ID' },
];

const statusColors = {
  pending: { bg: '#f59e0b20', color: '#f59e0b' },
  approved: { bg: '#10b98120', color: '#10b981' },
  rejected: { bg: '#ef444420', color: '#ef4444' },
};

const columns = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'documentType', label: 'Document', minWidth: 120 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value) => (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        size="small"
        sx={{ backgroundColor: statusColors[value].bg, color: statusColors[value].color, fontWeight: 600 }}
      />
    ),
  },
  { id: 'submittedAt', label: 'Submitted', minWidth: 120 },
];

export default function KYCApproval() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>KYC Approval</Typography>
        <Typography variant="body1" color="text.secondary">Review and approve user verification documents</Typography>
      </Box>
      <Grid container spacing={3} mb={4}>
        {kycStats.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}><StatsCard {...stat} /></Grid>
        ))}
      </Grid>
    </Box>
  );
}
