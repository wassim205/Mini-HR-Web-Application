import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ArrowLeft } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function TimeOffPage({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  // Fetch user's time off requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/timeoff/my-requests');
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/timeoff', formData);
      setFormData({ start_date: '', end_date: '', reason: '' });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Time Off Requests</h1>
            <p className="text-slate-500">Manage your leave requests</p>
          </div>
        </header>

        {/* New Request Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create Time Off Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="Vacation, sick leave, personal..."
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Submit Request
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Your Requests
            </h3>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No time off requests yet</p>
            ) : (
              <div className="space-y-4">
                {requests.map(request => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {formatDate(request.start_date)} to {formatDate(request.end_date)}
                        </p>
                        <p className="text-sm text-slate-500">{request.reason || 'No reason provided'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    {request.admin_note && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                        <strong>Admin Note:</strong> {request.admin_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeOffPage;