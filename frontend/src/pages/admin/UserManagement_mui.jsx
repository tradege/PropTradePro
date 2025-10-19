import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  SupervisorAccount,
  Group,
  Person,
} from '@mui/icons-material';
import StatsCard from '../../components/mui/StatsCard';
import DataTable from '../../components/mui/DataTable';

// Mock data
const userStats = [
  {
    title: 'Super Admins',
    value: '3',
    subtitle: 'Full access',
    icon: SupervisorAccount,
    color: 'primary',
  },
  {
    title: 'Operators',
    value: '12',
    subtitle: 'Platform managers',
    icon: Group,
    color: 'info',
  },
  {
    title: 'Agents',
    value: '156',
    subtitle: 'Active agents',
    icon: PersonAdd,
    color: 'success',
  },
  {
    title: 'Players',
    value: '1,076',
    subtitle: 'Registered traders',
    icon: Person,
    color: 'warning',
  },
];

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'super_admin',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2 hours ago',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'operator',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '1 day ago',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'agent',
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '3 days ago',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'player',
    status: 'pending',
    createdAt: '2024-03-25',
    lastLogin: 'Never',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'player',
    status: 'suspended',
    createdAt: '2024-02-05',
    lastLogin: '1 week ago',
  },
];

const roleColors = {
  super_admin: { bg: '#f093fb20', color: '#f093fb' },
  operator: { bg: '#4facfe20', color: '#4facfe' },
  agent: { bg: '#43e97b20', color: '#43e97b' },
  player: { bg: '#94a3b820', color: '#94a3b8' },
};

const roleLabels = {
  super_admin: 'Super Admin',
  operator: 'Operator',
  agent: 'Agent',
  player: 'Player',
};

const statusColors = {
  active: { bg: '#10b98120', color: '#10b981' },
  pending: { bg: '#f59e0b20', color: '#f59e0b' },
  suspended: { bg: '#ef444420', color: '#ef4444' },
};

const columns = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  {
    id: 'role',
    label: 'Role',
    minWidth: 120,
    format: (value) => (
      <Chip
        label={roleLabels[value]}
        size="small"
        sx={{
          backgroundColor: roleColors[value].bg,
          color: roleColors[value].color,
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
  { id: 'lastLogin', label: 'Last Login', minWidth: 120 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

export default function UserManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'player',
    status: 'active',
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'player',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    console.log('Save user:', formData);
    handleCloseDialog();
  };

  const handleView = (user) => {
    console.log('View user:', user);
  };

  const handleEdit = (user) => {
    handleOpenDialog(user);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Delete user:', user);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, roles, and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {userStats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Users Table */}
      <DataTable
        columns={columns}
        rows={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectable
      />

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Role"
              select
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="super_admin">Super Admin</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="player">Player</MenuItem>
            </TextField>
            <TextField
              label="Status"
              select
              fullWidth
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {selectedUser ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

