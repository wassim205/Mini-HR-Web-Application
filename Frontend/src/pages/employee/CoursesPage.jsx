import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Users, Check } from 'lucide-react';
import axios from '../../config/axios.jsx';

export function CoursesPage({ onBack }) {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchCourses();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/users/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (currentUser && courses.length > 0) {
      const userEnrolled = courses
        .filter(course => course.enrolled_users && course.enrolled_users.includes(currentUser.name))
        .map(course => course.id);
      setEnrolledCourses(userEnrolled);
    }
  }, [currentUser, courses]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/courses/enroll', { course_id: courseId });
      setEnrolledCourses([...enrolledCourses, courseId]);
      fetchCourses(); // Refresh to update enrollment count
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const getEnrolledUsers = (course) => {
    if (!course.enrolled_users) return [];
    return course.enrolled_users.split(',').filter(name => name);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Available Courses</h1>
            <p className="text-slate-500">Browse and enroll in training programs</p>
          </div>
        </header>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const enrolledUsers = getEnrolledUsers(course);
            const enrolled = isEnrolled(course.id);
            
            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-white" />
                  )}
                  {enrolled && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                  
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
                  
                  {/* Enroll Button */}
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolled}
                    className={`w-full py-2 px-4 rounded-lg font-medium cursor-pointer ${
                      enrolled 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {enrolled ? 'Enrolled' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;