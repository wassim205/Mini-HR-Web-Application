import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, BarChart2, FileText, Settings, Download } from 'lucide-react';
import TimeOffManagePage from './TimeOffManagePage.jsx';
import EvaluationsPage from './EvaluationsPage.jsx';
import CoursesPage from './CoursesPage.jsx';
import EmployeesPage from './EmployeesPage.jsx';
import axios from '../../config/axios.jsx';

export function AdminDashboard({ onSignOut }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats] = useState({
    totalEmployees: 27,
    pendingTimeOff: 3,
    activeCourses: 5,
    completedEvaluations: 18
  });

  const [recentTimeOffs, setRecentTimeOffs] = useState([]);

  useEffect(() => {
    const fetchTimeOffs = async () => {
      try {
        const response = await axios.get('/timeoff/all');
        setRecentTimeOffs(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching time offs:', error);
      }
    };
    fetchTimeOffs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleExportEmployees = async () => {
    try {
      const response = await axios.get('/export/employees', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting employees:', error);
      alert('Failed to export employees');
    }
  };

  const handleExportTimeOff = async () => {
    try {
      const response = await axios.get('/export/timeoff', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'time_off_requests.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting time off requests:', error);
      alert('Failed to export time off requests');
    }
  };

  if (currentPage === 'timeoff') {
    return <TimeOffManagePage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'evaluations') {
    return <EvaluationsPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'courses') {
    return <CoursesPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'employees') {
    return <EmployeesPage onBack={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your HR operations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportEmployees}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Employees
              </button>
              <button 
                onClick={handleExportTimeOff}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Time Off
              </button>
            </div>
            <button onClick={onSignOut} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 cursor-pointer">
              Sign out
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Time Off</p>
                <p className="text-2xl font-bold">{stats.pendingTimeOff}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Courses</p>
                <p className="text-2xl font-bold">{stats.activeCourses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Evaluations</p>
                <p className="text-2xl font-bold">{stats.completedEvaluations}</p>
              </div>
              <BarChart2 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => setCurrentPage('employees')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">Manage Employees</h3>
            <p className="text-sm text-slate-500">Add, edit, and view employee details</p>
          </button>
          <button 
            onClick={() => setCurrentPage('timeoff')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <Calendar className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-semibold mb-2">Time Off Requests</h3>
            <p className="text-sm text-slate-500">Review and approve leave requests</p>
          </button>
          <button 
            onClick={() => setCurrentPage('courses')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <BookOpen className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">Courses & Training</h3>
            <p className="text-sm text-slate-500">Manage training programs</p>
          </button>
          <button 
            onClick={() => setCurrentPage('evaluations')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <BarChart2 className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold mb-2">Evaluations</h3>
            <p className="text-sm text-slate-500">Assign scores and view reports</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer">
            <FileText className="w-8 h-8 text-indigo-500 mb-3" />
            <h3 className="font-semibold mb-2">Reports</h3>
            <p className="text-sm text-slate-500">View analytics and export data</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer">
            <Settings className="w-8 h-8 text-gray-500 mb-3" />
            <h3 className="font-semibold mb-2">Settings</h3>
            <p className="text-sm text-slate-500">Configure system preferences</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Time Off Requests</h3>
          <div className="space-y-3">
            {recentTimeOffs.map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">{request.user_name}</p>
                  <p className="text-sm text-slate-500">Requested leave starting {formatDate(request.start_date)}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {request.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
            View all requests →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;