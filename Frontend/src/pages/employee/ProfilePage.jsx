import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Briefcase, Calendar, GraduationCap } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function ProfilePage({ onBack }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [evaluationScores, setEvaluationScores] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchEvaluationScores();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/users/me');
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...user });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/users/${user.id}`, formData);
      setUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...user });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await axios.put(`/users/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  const fetchEvaluationScores = async () => {
    try {
      const response = await axios.get('/evaluations/my-scores');
      setEvaluationScores(response.data);
    } catch (error) {
      console.error('Error fetching evaluation scores:', error);
    }
  };

  const getBucketName = (score) => {
    if (score === null) return 'Not Evaluated';
    if (score >= 0 && score <= 30) return '0-30 (Needs Improvement)';
    if (score >= 31 && score <= 50) return '31-50 (Below Average)';
    if (score >= 51 && score <= 70) return '51-70 (Average)';
    if (score >= 71 && score <= 100) return '71-100 (Excellent)';
    return 'N/A';
  };

  const getBucketColor = (score) => {
    if (score === null) return 'bg-gray-100 text-gray-800';
    if (score >= 0 && score <= 30) return 'bg-red-100 text-red-800';
    if (score >= 31 && score <= 50) return 'bg-orange-100 text-orange-800';
    if (score >= 51 && score <= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 71 && score <= 100) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'job', label: 'Job', icon: Briefcase },
    { id: 'timeoff', label: 'Time Off', icon: Calendar },
    { id: 'training', label: 'Training', icon: GraduationCap }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editing ? formData.name || '' : user.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                  readOnly={!editing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={editing ? formData.email || '' : user.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                  readOnly={!editing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birthday</label>
                <input 
                  type="date" 
                  value={editing ? formatDateForInput(formData.birthday) : formatDateForInput(user.birthday)} 
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                  readOnly={!editing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" placeholder="Not provided" className="w-full p-2 border border-slate-300 rounded-lg" readOnly />
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Password</h4>
              {!showPasswordForm ? (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg" 
                      required 
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Update Password
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      case 'job':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input 
                  type="text" 
                  value={editing ? formData.job_position || '' : user.job_position || ''} 
                  onChange={(e) => handleInputChange('job_position', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                  readOnly={!editing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Hired</label>
                <input 
                  type="date" 
                  value={editing ? formatDateForInput(formData.date_hired) : formatDateForInput(user.date_hired)} 
                  onChange={(e) => handleInputChange('date_hired', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                  readOnly={!editing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input type="text" placeholder="Finance" className="w-full p-2 border border-slate-300 rounded-lg" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Manager</label>
                <input type="text" placeholder="Jane Smith" className="w-full p-2 border border-slate-300 rounded-lg" readOnly />
              </div>
            </div>
          </div>
        );
      case 'timeoff':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Time Off Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Available Days</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Used Days</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
            </div>
          </div>
        );
      case 'training':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Evaluation Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluationScores.map(evaluation => (
                <div key={evaluation.name} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{evaluation.name}</h4>
                    <span className="text-xl font-bold">
                      {evaluation.score !== null ? evaluation.score : 'N/A'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBucketColor(evaluation.score)}`}>
                    {getBucketName(evaluation.score)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Training & Courses</h4>
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium">React Basics</h4>
                  <p className="text-sm text-slate-500 mb-2">Progress: 75%</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium">Financial Reporting</h4>
                  <p className="text-sm text-slate-500 mb-2">Progress: 30%</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Error loading profile data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-slate-500">View and manage your information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(activeTab === 'personal' || activeTab === 'job') && (
              editing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Edit Profile
                </button>
              )
            )}
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;