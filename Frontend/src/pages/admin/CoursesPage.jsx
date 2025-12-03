import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Users } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function CoursesPage({ onBack }) {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`/courses/${editingCourse.id}`, formData);
      } else {
        await axios.post('/courses', formData);
      }
      setFormData({ title: '', description: '', image_url: '' });
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      image_url: course.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const getEnrolledUsers = (course) => {
    if (!course.enrolled_users) return [];
    return course.enrolled_users.split(',').filter(name => name);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Courses & Training</h1>
              <p className="text-slate-500">Manage training programs</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </header>

        {/* Course Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="Course description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
                    setFormData({ title: '', description: '', image_url: '' });
                  }}
                  className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const enrolledUsers = getEnrolledUsers(course);
            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-white" />
                  )}
                </div>
                
                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  {/* Enrolled Users */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">{course.enrolled_count} enrolled</span>
                    </div>
                    <div className="flex items-center -space-x-2">
                      {enrolledUsers.slice(0, 3).map((name, idx) => (
                        <div 
                          key={idx}
                          className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white text-xs flex items-center justify-center font-medium text-blue-600"
                          title={name}
                        >
                          {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      ))}
                      {enrolledUsers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white text-xs flex items-center justify-center font-medium text-slate-600">
                          +{enrolledUsers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex items-center gap-1 px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex items-center gap-1 px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No courses available. Create your first course!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;