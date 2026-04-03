import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    course: ''
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses');
        setCourses(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, course: data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch courses');
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure course is strictly removed if not candidate
      const payload = { ...formData };
      if (payload.role !== 'candidate') delete payload.course;
      
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none transform translate-x-10 -translate-y-10"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          </div>

          {error && <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  name="role"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="candidate">Candidate</option>
                  <option value="examiner">Examiner</option>
                </select>
              </div>

              {formData.role === 'candidate' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                  {courses.length > 0 ? (
                    <select
                      name="course"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      value={formData.course}
                      onChange={handleChange}
                      required
                    >
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      disabled 
                      value="Loading courses or Backend Database is empty..." 
                      className="w-full px-4 py-2 border border-red-300 bg-red-50 text-red-600 rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all hover:scale-[1.02]"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 hover:underline cursor-pointer">Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
