import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  CardGiftcard as FreeIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const PaymentApprovals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch pending requests
      const pendingRes = await axios.get(`${API_BASE_URL}/payment-approvals/pending`, { headers });
      setPendingRequests(pendingRes.data.data || []);

      // Fetch stats
      const statsRes = await axios.get(`${API_BASE_URL}/payment-approvals/stats`, { headers });
      setStats(statsRes.data.data || {});

      setError(null);
    } catch (err) {
      console.error('Error fetching approval requests:', err);
      setError(err.response?.data?.error || 'Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setDialogOpen(true);
    setAdminNotes('');
    setRejectionReason('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setAdminNotes('');
    setRejectionReason('');
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_BASE_URL}/payment-approvals/${selectedRequest.id}/approve`,
        { admin_notes: adminNotes },
        { headers }
      );

      // Refresh data
      await fetchData();
      handleCloseDialog();
      
      // Show success message
      alert('Payment approved successfully!');
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_BASE_URL}/payment-approvals/${selectedRequest.id}/reject`,
        {
          rejection_reason: rejectionReason,
          admin_notes: adminNotes
        },
        { headers }
      );

      // Refresh data
      await fetchData();
      handleCloseDialog();
      
      // Show success message
      alert('Payment rejected');
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentTypeIcon = (type) => {
    return type === 'cash' ? <MoneyIcon fontSize="small" /> : <FreeIcon fontSize="small" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Approvals
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4">
                  {stats.pending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Approved
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.approved || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Rejected
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.rejected || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total
                </Typography>
                <Typography variant="h4">
                  {stats.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Pending Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Approval Requests
          </Typography>

          {pendingRequests.length === 0 ? (
            <Alert severity="info">No pending approval requests</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Trader</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {request.requester?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.requester?.email || ''}
                          </Typography>
                          <br />
                          <Chip 
                            label={request.requester?.role || 'N/A'} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {request.trader?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.trader?.email || ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {formatAmount(request.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getPaymentTypeIcon(request.payment_type)}
                          label={request.payment_type.toUpperCase()}
                          color={request.payment_type === 'cash' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(request.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleOpenDialog(request, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => handleOpenDialog(request, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Payment' : 'Reject Payment'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Requester:</strong> {selectedRequest.requester?.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Trader:</strong> {selectedRequest.trader?.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Amount:</strong> {formatAmount(selectedRequest.amount)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Payment Type:</strong> {selectedRequest.payment_type.toUpperCase()}
              </Typography>

              {actionType === 'reject' && (
                <TextField
                  fullWidth
                  label="Rejection Reason *"
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mt: 2 }}
                  required
                />
              )}

              <TextField
                fullWidth
                label="Admin Notes (Optional)"
                multiline
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={actionType === 'approve' ? handleApprove : handleReject}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            disabled={processing || (actionType === 'reject' && !rejectionReason.trim())}
          >
            {processing ? <CircularProgress size={24} /> : actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentApprovals;

