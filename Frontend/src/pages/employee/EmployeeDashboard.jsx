import React, { useState } from 'react';
import { Calendar, BookOpen, BarChart2, User, Clock, Award } from 'lucide-react';

export function EmployeeDashboard({ user = { id: 2, name: 'John Doe', email: 'john@hr.com', job_position: 'Accountant', date_hired: '2022-05-20' }, onSignOut }) {
  const [timeOffBalance] = useState({
    available: 15,
    used: 5,
    pending: 2
  });

  const [recentTimeOffs] = useState([
    { id: 1, start: '2025-01-10', end: '2025-01-12', reason: 'Family event', status: 'approved' },
    { id: 2, start: '2025-02-01', end: '2025-02-03', reason: 'Vacation', status: 'pending' }
  ]);

  const [enrolledCourses] = useState([
    { id: 1, title: 'React Basics', progress: 75 },
    { id: 2, title: 'Financial Reporting', progress: 30 }
  ]);

  const [evaluationScores] = useState([
    { name: 'Bookkeeping', score: 45, bucket: '31-50' },
    { name: 'VAT', score: 72, bucket: '71-100' },
    { name: 'Toolbox', score: 65, bucket: '51-70' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-semibold text-blue-600">
              {user.name.split(' ').map(n => n[0]).slice(0,2).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
              <p className="text-slate-500">{user.job_position} • Hired {user.date_hired}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
              Profile
            </button>
            <button onClick={onSignOut} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 cursor-pointer">
              Sign out
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Available Time Off</p>
                <p className="text-2xl font-bold">{timeOffBalance.available} days</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Enrolled Courses</p>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Evaluations</p>
                <p className="text-2xl font-bold">{evaluationScores.length}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <Calendar className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-semibold mb-2">Request Time Off</h3>
            <p className="text-sm text-slate-500">Submit a new leave request</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <BookOpen className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">Browse Courses</h3>
            <p className="text-sm text-slate-500">Enroll in training programs</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <User className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">My Profile</h3>
            <p className="text-sm text-slate-500">View and edit your details</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <BarChart2 className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold mb-2">My Evaluations</h3>
            <p className="text-sm text-slate-500">View your performance scores</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Off Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Off Status
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{timeOffBalance.available}</p>
                <p className="text-sm text-slate-500">Available</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{timeOffBalance.used}</p>
                <p className="text-sm text-slate-500">Used</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{timeOffBalance.pending}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Recent Requests</h4>
              {recentTimeOffs.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium">{request.start} - {request.end}</p>
                    <p className="text-sm text-slate-500">{request.reason}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Progress
            </h3>
            <div className="space-y-4 mb-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <span className="text-sm text-slate-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="font-medium mb-3">Evaluation Scores</h4>
            <div className="grid grid-cols-1 gap-3">
              {evaluationScores.map(evaluation => (
                <div key={evaluation.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{evaluation.name}</p>
                    <p className="text-sm text-slate-500">Bucket: {evaluation.bucket}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{evaluation.score}</p>
                    <p className="text-sm text-slate-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;