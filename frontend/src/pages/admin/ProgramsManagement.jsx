import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import api from '../../services/api';

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'two_phase',
    account_size: '',
    price: '',
    profit_target_phase1: '',
    profit_target_phase2: '',
    max_daily_loss: '',
    max_total_loss: '',
    min_trading_days: '',
    profit_split: '',
    is_active: true,
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/programs');
      setPrograms(response.data.programs || []);
    } catch (error) {
      console.error('Failed to load programs:', error);
      // Mock data for development
      setPrograms([
        {
          id: 1,
          name: 'Two Phase $100K',
          type: 'two_phase',
          account_size: 100000,
          price: 499,
          profit_target_phase1: 8,
          profit_target_phase2: 5,
          max_daily_loss: 5,
          max_total_loss: 10,
          min_trading_days: 5,
          profit_split: 80,
          is_active: true,
          enrollments: 234,
        },
        {
          id: 2,
          name: 'One Phase $50K',
          type: 'one_phase',
          account_size: 50000,
          price: 299,
          profit_target_phase1: 10,
          max_daily_loss: 5,
          max_total_loss: 10,
          min_trading_days: 3,
          profit_split: 75,
          is_active: true,
          enrollments: 189,
        },
        {
          id: 3,
          name: 'Instant Funding $200K',
          type: 'instant',
          account_size: 200000,
          price: 999,
          max_daily_loss: 3,
          max_total_loss: 6,
          profit_split: 90,
          is_active: true,
          enrollments: 67,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await api.put(`/programs/${editingProgram.id}`, formData);
      } else {
        await api.post('/programs', formData);
      }
      loadPrograms();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save program:', error);
      alert('Failed to save program. Please try again.');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description || '',
      type: program.type,
      account_size: program.account_size,
      price: program.price,
      profit_target_phase1: program.profit_target_phase1,
      profit_target_phase2: program.profit_target_phase2 || '',
      max_daily_loss: program.max_daily_loss,
      max_total_loss: program.max_total_loss,
      min_trading_days: program.min_trading_days,
      profit_split: program.profit_split,
      is_active: program.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      await api.delete(`/programs/${id}`);
      loadPrograms();
    } catch (error) {
      console.error('Failed to delete program:', error);
      alert('Failed to delete program. Please try again.');
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      type: 'two_phase',
      account_size: '',
      price: '',
      profit_target_phase1: '',
      profit_target_phase2: '',
      max_daily_loss: '',
      max_total_loss: '',
      min_trading_days: '',
      profit_split: '',
      is_active: true,
    });
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || program.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
              <p className="text-gray-600 mt-2">Create and manage trading programs</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Program
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="two_phase">Two Phase</option>
                <option value="one_phase">One Phase</option>
                <option value="instant">Instant Funding</option>
              </select>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {program.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Size</span>
                  <span className="font-semibold text-gray-900">
                    ${program.account_size.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">${program.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit Split</span>
                  <span className="font-semibold text-gray-900">{program.profit_split}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Daily Loss</span>
                  <span className="font-semibold text-gray-900">{program.max_daily_loss}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Enrollments</span>
                  <span className="font-semibold text-gray-900">{program.enrollments || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    program.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No programs found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., Two Phase $100K"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input w-full"
                    rows="3"
                    placeholder="Program description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input w-full"
                  >
                    <option value="two_phase">Two Phase</option>
                    <option value="one_phase">One Phase</option>
                    <option value="instant">Instant Funding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Size ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.account_size}
                    onChange={(e) => setFormData({ ...formData, account_size: e.target.value })}
                    className="input w-full"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input w-full"
                    placeholder="499"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit Split (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.profit_split}
                    onChange={(e) => setFormData({ ...formData, profit_split: e.target.value })}
                    className="input w-full"
                    placeholder="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit Target Phase 1 (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.profit_target_phase1}
                    onChange={(e) => setFormData({ ...formData, profit_target_phase1: e.target.value })}
                    className="input w-full"
                    placeholder="8"
                  />
                </div>

                {formData.type === 'two_phase' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profit Target Phase 2 (%)
                    </label>
                    <input
                      type="number"
                      value={formData.profit_target_phase2}
                      onChange={(e) => setFormData({ ...formData, profit_target_phase2: e.target.value })}
                      className="input w-full"
                      placeholder="5"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Daily Loss (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.max_daily_loss}
                    onChange={(e) => setFormData({ ...formData, max_daily_loss: e.target.value })}
                    className="input w-full"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Total Loss (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.max_total_loss}
                    onChange={(e) => setFormData({ ...formData, max_total_loss: e.target.value })}
                    className="input w-full"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Trading Days *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.min_trading_days}
                    onChange={(e) => setFormData({ ...formData, min_trading_days: e.target.value })}
                    className="input w-full"
                    placeholder="5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

