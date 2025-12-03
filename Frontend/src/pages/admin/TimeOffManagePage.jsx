import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, ArrowLeft, MessageSquare } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function TimeOffManagePage({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  // Fetch all time off requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/timeoff/all');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update request status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/timeoff/${id}/status`, {
        status,
        admin_note: adminNote
      });
      setSelectedRequest(null);
      setAdminNote('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Time Off Management</h1>
            <p className="text-slate-500">Review and approve employee requests</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                Pending Requests ({pendingRequests.length})
              </h3>
            </div>
            <div className="p-6">
              {pendingRequests.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{request.user_name}</p>
                          <p className="text-sm text-slate-600">
                            {formatDate(request.start_date)} to {formatDate(request.end_date)}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {request.reason || 'No reason provided'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest({...request, action: 'approve'})}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedRequest({...request, action: 'reject'})}
                          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Processed Requests */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                Recent Decisions
              </h3>
            </div>
            <div className="p-6">
              {processedRequests.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No processed requests</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {processedRequests.slice(0, 10).map(request => (
                    <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{request.user_name}</p>
                          <p className="text-sm text-slate-600">
                            {formatDate(request.start_date)} to {formatDate(request.end_date)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      {request.admin_note && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                          <strong>Note:</strong> {request.admin_note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decision Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedRequest.action === 'approve' ? 'Approve Request' : 'Reject Request'}
              </h3>
              <div className="mb-4 p-3 bg-slate-50 rounded">
                <p className="font-medium">{selectedRequest.user_name}</p>
                <p className="text-sm text-slate-600">
                  {formatDate(selectedRequest.start_date)} to {formatDate(selectedRequest.end_date)}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedRequest.reason || 'No reason provided'}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Admin Note (Optional)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="Add a note for the employee..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(selectedRequest.id, selectedRequest.action === 'approve' ? 'approved' : 'rejected')}
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedRequest.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {selectedRequest.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminNote('');
                  }}
                  className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeOffManagePage;