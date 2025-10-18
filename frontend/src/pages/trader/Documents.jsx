import { useEffect, useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import TraderLayout from '../../components/trader/TraderLayout';
import api from '../../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState(null);

  const documentTypes = [
    {
      type: 'id_proof',
      label: 'ID Proof',
      description: 'Government-issued ID (Passport, Driver\'s License, National ID)',
      required: true,
    },
    {
      type: 'address_proof',
      label: 'Address Proof',
      description: 'Utility bill, bank statement (not older than 3 months)',
      required: true,
    },
    {
      type: 'selfie',
      label: 'Selfie with ID',
      description: 'Clear photo of yourself holding your ID',
      required: true,
    },
    {
      type: 'bank_statement',
      label: 'Bank Statement',
      description: 'Recent bank statement for withdrawal verification',
      required: false,
    },
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/trader/documents');
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
      // Mock data for development
      setDocuments([
        {
          id: 1,
          type: 'id_proof',
          filename: 'passport.pdf',
          status: 'approved',
          uploaded_date: '2024-10-10T10:30:00Z',
          reviewed_date: '2024-10-11T14:20:00Z',
          notes: 'Document verified successfully',
        },
        {
          id: 2,
          type: 'address_proof',
          filename: 'utility_bill.pdf',
          status: 'pending',
          uploaded_date: '2024-10-15T09:15:00Z',
          reviewed_date: null,
          notes: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid file (JPG, PNG, or PDF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingType(type);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      await api.post('/trader/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      loadDocuments();
      alert('Document uploaded successfully');
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingType(null);
    }
  };

  const getDocumentStatus = (type) => {
    const doc = documents.find(d => d.type === type);
    return doc ? doc.status : 'not_uploaded';
  };

  const getDocumentInfo = (type) => {
    return documents.find(d => d.type === type);
  };

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const verificationStatus = {
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    total: documentTypes.filter(dt => dt.required).length,
  };

  const isFullyVerified = verificationStatus.approved === verificationStatus.total;

  if (isLoading) {
    return (
      <TraderLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading documents...</p>
          </div>
        </div>
      </TraderLayout>
    );
  }

  return (
    <TraderLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Documents & Verification</h1>
            <p className="text-gray-600 mt-2">Upload your documents for account verification</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Verification Status */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Verification Status</h2>
              {isFullyVerified && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Fully Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Required Documents</p>
                <p className="text-2xl font-bold text-gray-900">{verificationStatus.total}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{verificationStatus.approved}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{verificationStatus.pending}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{verificationStatus.rejected}</p>
              </div>
            </div>

            {!isFullyVerified && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Action Required</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Please upload all required documents to complete your account verification. 
                      This is necessary for withdrawals and funded account access.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTypes.map((docType) => {
              const status = getDocumentStatus(docType.type);
              const docInfo = getDocumentInfo(docType.type);

              return (
                <div key={docType.type} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {docType.label}
                          {docType.required && (
                            <span className="text-red-600 ml-1">*</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                      </div>
                    </div>
                  </div>

                  {docInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{docInfo.filename}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Uploaded: {new Date(docInfo.uploaded_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(docInfo.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(docInfo.status)}`}>
                            {docInfo.status}
                          </span>
                        </div>
                      </div>

                      {docInfo.notes && (
                        <div className={`p-3 rounded-lg ${
                          docInfo.status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <p className={`text-sm ${docInfo.status === 'rejected' ? 'text-red-800' : 'text-blue-800'}`}>
                            <strong>Note:</strong> {docInfo.notes}
                          </p>
                        </div>
                      )}

                      {docInfo.status === 'rejected' && (
                        <label className="btn btn-primary w-full cursor-pointer">
                          <Upload className="w-5 h-5 mr-2" />
                          Re-upload Document
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(docType.type, e)}
                            className="hidden"
                            disabled={uploadingType === docType.type}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <label className="btn btn-primary w-full cursor-pointer">
                      {uploadingType === docType.type ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Document
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(docType.type, e)}
                        className="hidden"
                        disabled={uploadingType === docType.type}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guidelines */}
          <div className="mt-8 card bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Document Upload Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Documents must be clear, legible, and in color</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>All four corners of the document must be visible</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Accepted formats: JPG, PNG, PDF (max 5MB)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Address proof must not be older than 3 months</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Selfie with ID: Hold your ID next to your face, ensure both are clearly visible</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Review typically takes 1-3 business days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </TraderLayout>
  );
}

