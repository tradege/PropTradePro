import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  CheckCircle, XCircle, Eye, Download, AlertCircle,
  FileText, User, Home, Image
} from 'lucide-react';

export default function KYCApproval() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setSubmissions([
        {
          id: 1,
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
          status: 'pending',
          document_type: 'passport',
          document_number: 'AB123456',
          address: '123 Main St, New York, NY 10001',
          submitted_at: '2025-01-16 10:30',
          documents: {
            document_front: '/uploads/kyc/doc1_front.jpg',
            document_back: '/uploads/kyc/doc1_back.jpg',
            proof_of_address: '/uploads/kyc/doc1_address.pdf',
            selfie: '/uploads/kyc/doc1_selfie.jpg',
          },
        },
        {
          id: 2,
          user: {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          status: 'pending',
          document_type: 'drivers_license',
          document_number: 'DL987654',
          address: '456 Oak Ave, Los Angeles, CA 90001',
          submitted_at: '2025-01-16 09:15',
          documents: {
            document_front: '/uploads/kyc/doc2_front.jpg',
            document_back: '/uploads/kyc/doc2_back.jpg',
            proof_of_address: '/uploads/kyc/doc2_address.jpg',
            selfie: '/uploads/kyc/doc2_selfie.jpg',
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to load KYC submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    if (!confirm('Are you sure you want to approve this KYC submission?')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubmissions(submissions.map(s => 
        s.id === submissionId ? { ...s, status: 'approved' } : s
      ));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to approve KYC:', error);
    }
  };

  const handleReject = async (submissionId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubmissions(submissions.map(s => 
        s.id === submissionId ? { ...s, status: 'rejected', rejection_reason: reason } : s
      ));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve user identity verification</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {submissions.filter(s => s.status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {submissions.filter(s => s.status === 'approved').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {submissions.filter(s => s.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending ({submissions.filter(s => s.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Approved ({submissions.filter(s => s.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rejected ({submissions.filter(s => s.status === 'rejected').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({submissions.length})
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="card text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="text-gray-600 mt-4">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="card text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No {filter} submissions</p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`card cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id
                      ? 'ring-2 ring-primary-500'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{submission.user.name}</h3>
                        <p className="text-sm text-gray-600">{submission.user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="capitalize">{submission.document_type.replace('_', ' ')}</span>
                      <span className="text-gray-400">•</span>
                      <span>{submission.document_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home className="w-4 h-4" />
                      <span className="truncate">{submission.address}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Submitted: {submission.submitted_at}
                    </div>
                  </div>

                  {submission.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(submission.id);
                        }}
                        className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(submission.id);
                        }}
                        className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            {selectedSubmission ? (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Document Review</h2>

                {/* User Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedSubmission.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedSubmission.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Type:</span>
                      <span className="font-medium capitalize">
                        {selectedSubmission.document_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Number:</span>
                      <span className="font-medium">{selectedSubmission.document_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right">{selectedSubmission.address}</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Uploaded Documents</h3>
                  
                  {Object.entries(selectedSubmission.documents).map(([key, url]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-primary-600 hover:text-primary-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                        <p className="text-sm text-gray-500 ml-2">Preview not available</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {selectedSubmission.status === 'pending' && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve KYC
                    </button>
                    <button
                      onClick={() => handleReject(selectedSubmission.id)}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject KYC
                    </button>
                  </div>
                )}

                {selectedSubmission.status === 'rejected' && selectedSubmission.rejection_reason && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                    <p className="text-sm text-red-800 mt-1">{selectedSubmission.rejection_reason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a submission to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

