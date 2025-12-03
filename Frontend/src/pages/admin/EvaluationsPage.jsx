import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart2, Users } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function EvaluationsPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('assign');
  const [evaluations, setEvaluations] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState('');
  const [score, setScore] = useState('');

  useEffect(() => {
    fetchEvaluations();
    fetchUsers();
    fetchReport();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get('/evaluations');
      setEvaluations(response.data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.filter(u => u.role === 'employee'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get('/evaluations/report');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleAssignScore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/evaluations/assign-score', {
        user_id: selectedUser,
        evaluation_id: selectedEvaluation,
        score: parseInt(score)
      });
      setSelectedUser('');
      setSelectedEvaluation('');
      setScore('');
      fetchReport();
      alert('Score assigned successfully');
    } catch (error) {
      console.error('Error assigning score:', error);
      alert('Failed to assign score');
    }
  };

  const getBucketName = (score) => {
    if (score >= 0 && score <= 30) return '0-30';
    if (score >= 31 && score <= 50) return '31-50';
    if (score >= 51 && score <= 70) return '51-70';
    if (score >= 71 && score <= 100) return '71-100';
    return 'N/A';
  };

  const getBucketColor = (bucketName) => {
    switch (bucketName) {
      case '0-30': return 'bg-red-100 text-red-800';
      case '31-50': return 'bg-orange-100 text-orange-800';
      case '51-70': return 'bg-yellow-100 text-yellow-800';
      case '71-100': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Evaluations & Scores</h1>
            <p className="text-slate-500">Manage employee evaluations and view reports</p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('assign')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'assign'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  Assign Scores
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'report'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Score Report
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === 'assign' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Assign Score to Employee</h3>
                  <form onSubmit={handleAssignScore} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Employee</label>
                        <select
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg cursor-pointer"
                          required
                        >
                          <option value="">Select Employee</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Evaluation</label>
                        <select
                          value={selectedEvaluation}
                          onChange={(e) => setSelectedEvaluation(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg cursor-pointer"
                          required
                        >
                          <option value="">Select Evaluation</option>
                          {evaluations.map(evaluation => (
                            <option key={evaluation.id} value={evaluation.id}>{evaluation.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        placeholder="Enter score between 0-100"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Assign Score
                    </button>
                  </form>

                  <div className="mt-8">
                    <h4 className="text-md font-medium mb-4">Score Buckets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="font-medium text-red-800">0-30</p>
                        <p className="text-sm text-red-600">Needs Improvement</p>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="font-medium text-orange-800">31-50</p>
                        <p className="text-sm text-orange-600">Below Average</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-medium text-yellow-800">51-70</p>
                        <p className="text-sm text-yellow-600">Average</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800">71-100</p>
                        <p className="text-sm text-green-600">Excellent</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'report' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Evaluation Score Report</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-slate-600 border-b">
                        <tr>
                          <th className="text-left p-3">Evaluation</th>
                          <th className="text-center p-3">0-30</th>
                          <th className="text-center p-3">31-50</th>
                          <th className="text-center p-3">51-70</th>
                          <th className="text-center p-3">71-100</th>
                          <th className="text-center p-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.map(item => (
                          <tr key={item.evaluation_name} className="border-b">
                            <td className="p-3 font-medium">{item.evaluation_name}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                                {item.bucket_0_30}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                                {item.bucket_31_50}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                {item.bucket_51_70}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                {item.bucket_71_100}
                              </span>
                            </td>
                            <td className="p-3 text-center font-medium">
                              {item.bucket_0_30 + item.bucket_31_50 + item.bucket_51_70 + item.bucket_71_100}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationsPage;