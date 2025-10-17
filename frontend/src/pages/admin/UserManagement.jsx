import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search, Filter, Edit, Trash2, Ban, CheckCircle,
  Mail, Phone, Calendar, Shield
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setUsers([
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          status: 'active',
          kyc_status: 'approved',
          role: 'user',
          created_at: '2025-01-15',
          last_login: '2 hours ago',
          total_spent: 599,
          challenges: 2,
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '+1 234 567 8901',
          status: 'active',
          kyc_status: 'pending',
          role: 'user',
          created_at: '2025-01-14',
          last_login: '1 day ago',
          total_spent: 299,
          challenges: 1,
        },
        {
          id: 3,
          first_name: 'Bob',
          last_name: 'Johnson',
          email: 'bob@example.com',
          phone: '+1 234 567 8902',
          status: 'inactive',
          kyc_status: 'rejected',
          role: 'user',
          created_at: '2025-01-10',
          last_login: '5 days ago',
          total_spent: 0,
          challenges: 0,
        },
      ]);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKYCColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all platform users</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KYC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {user.first_name[0]}{user.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        {user.role === 'admin' && (
                          <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                            <Shield className="w-3 h-3" />
                            Admin
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getKYCColor(user.kyc_status)}`}>
                          {user.kyc_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Joined {user.created_at}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Last login: {user.last_login}
                        </div>
                        <div className="text-xs font-medium text-gray-700 mt-1">
                          ${user.total_spent} spent • {user.challenges} challenges
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Deactivate"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Activate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="card">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Pending KYC</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {users.filter(u => u.kyc_status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              ${users.reduce((sum, u) => sum + u.total_spent, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

