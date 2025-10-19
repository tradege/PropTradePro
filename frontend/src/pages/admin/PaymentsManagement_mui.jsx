import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import StatsCard from '../../components/mui/StatsCard';
import DataTable from '../../components/mui/DataTable';

const paymentStats = [
  {
    title: 'Total Revenue',
    value: '$284,750',
    subtitle: '+12.5% this month',
    icon: AttachMoney,
    color: 'success',
    trend: '+12.5%',
  },
  {
    title: 'Pending Payouts',
    value: '$45,230',
    subtitle: '23 requests',
    icon: Schedule,
    color: 'warning',
  },
  {
    title: 'Completed Payouts',
    value: '$189,420',
    subtitle: 'This month',
    icon: CheckCircle,
    color: 'info',
  },
  {
    title: 'Average Payout',
    value: '$2,340',
    subtitle: 'Per trader',
    icon: TrendingUp,
    color: 'primary',
  },
];

const payments = [
  {
    id: 1,
    traderName: 'John Doe',
    email: 'john@example.com',
    amount: 5000,
    type: 'payout',
    status: 'completed',
    method: 'bank_transfer',
    date: '2024-03-15',
    transactionId: 'TXN-001234',
  },
  {
    id: 2,
    traderName: 'Jane Smith',
    email: 'jane@example.com',
    amount: 299,
    type: 'purchase',
    status: 'completed',
    method: 'credit_card',
    date: '2024-03-14',
    transactionId: 'TXN-001235',
  },
  {
    id: 3,
    traderName: 'Bob Johnson',
    email: 'bob@example.com',
    amount: 3500,
    type: 'payout',
    status: 'pending',
    method: 'paypal',
    date: '2024-03-13',
    transactionId: 'TXN-001236',
  },
  {
    id: 4,
    traderName: 'Alice Williams',
    email: 'alice@example.com',
    amount: 499,
    type: 'purchase',
    status: 'completed',
    method: 'credit_card',
    date: '2024-03-12',
    transactionId: 'TXN-001237',
  },
  {
    id: 5,
    traderName: 'Charlie Brown',
    email: 'charlie@example.com',
    amount: 2800,
    type: 'payout',
    status: 'failed',
    method: 'bank_transfer',
    date: '2024-03-11',
    transactionId: 'TXN-001238',
  },
];

const statusColors = {
  completed: { bg: '#10b98120', color: '#10b981' },
  pending: { bg: '#f59e0b20', color: '#f59e0b' },
  failed: { bg: '#ef444420', color: '#ef4444' },
  processing: { bg: '#3b82f620', color: '#3b82f6' },
};

const typeColors = {
  payout: { bg: '#10b98120', color: '#10b981' },
  purchase: { bg: '#3b82f620', color: '#3b82f6' },
  refund: { bg: '#f59e0b20', color: '#f59e0b' },
};

const columns = [
  { id: 'traderName', label: 'Trader', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 120,
    format: (value) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        ${value.toLocaleString()}
      </Typography>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    minWidth: 100,
    format: (value) => (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        size="small"
        sx={{
          backgroundColor: typeColors[value].bg,
          color: typeColors[value].color,
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value) => (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        size="small"
        sx={{
          backgroundColor: statusColors[value].bg,
          color: statusColors[value].color,
          fontWeight: 600,
        }}
      />
    ),
  },
  { id: 'method', label: 'Method', minWidth: 120 },
  { id: 'date', label: 'Date', minWidth: 120 },
  { id: 'transactionId', label: 'Transaction ID', minWidth: 150 },
];

export default function PaymentsManagement() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleView = (payment) => {
    console.log('View payment:', payment);
  };

  const handleApprove = (payment) => {
    console.log('Approve payment:', payment);
  };

  const handleReject = (payment) => {
    console.log('Reject payment:', payment);
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
    if (filterType !== 'all' && payment.type !== filterType) return false;
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Payments Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all payments and payouts
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {paymentStats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Status"
          select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="processing">Processing</MenuItem>
        </TextField>
        <TextField
          label="Type"
          select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="payout">Payout</MenuItem>
          <MenuItem value="purchase">Purchase</MenuItem>
          <MenuItem value="refund">Refund</MenuItem>
        </TextField>
      </Box>

      {/* Payments Table */}
      <DataTable
        columns={columns}
        rows={filteredPayments}
        onView={handleView}
        actions={(row) => {
          if (row.status === 'pending') {
            return [
              {
                label: 'Approve',
                onClick: () => handleApprove(row),
                color: 'success',
              },
              {
                label: 'Reject',
                onClick: () => handleReject(row),
                color: 'error',
              },
            ];
          }
          return [];
        }}
      />
    </Box>
  );
}

