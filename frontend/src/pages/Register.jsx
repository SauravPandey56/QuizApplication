import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import Chatbot from '../components/Chatbot';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    course: '',
    universityCampus: '',
    branch: '',
    semester: 1,
    section: ''
  });
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesAndSettings = async () => {
      try {
        const [coursesRes, settingsRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/settings')
        ]);
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0) {
          setFormData(prev => ({ ...prev, course: coursesRes.data[0]._id }));
        }
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchCoursesAndSettings();
  }, []);

  const campuses = settings.filter(s => s.type === 'campus').map(s => s.value);
  const branches = settings.filter(s => s.type === 'branch').map(s => s.value);
  const sections = settings.filter(s => s.type === 'section').map(s => s.value);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultCampuses = ['GEU DEHRADUN', 'GEHU DEHRADUN', 'GEHU haldwani', 'GEHU bihmtal'];
  const defaultBranches = ['CSE', 'mechanical', 'civil', 'electrical', 'ECE', 'chemical'];
  const defaultSections = ['A', 'B', 'C', 'D'];

  const getOptions = (arr, defaultArr) => arr.length > 0 ? arr : defaultArr;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-=]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long, and include a lowercase letter, uppercase letter, number, and special symbol.');
      return;
    }

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 relative">
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
                <>
                  <div className="col-span-2 sm:col-span-1">
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
                        value="Loading courses..." 
                        className="w-full px-4 py-2 border border-red-300 bg-red-50 text-red-600 rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">University Campus</label>
                    <select
                      name="universityCampus"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      value={formData.universityCampus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Campus</option>
                      {getOptions(campuses, defaultCampuses).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                    <select
                      name="branch"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {getOptions(branches, defaultBranches).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                    <select
                      name="semester"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                    >
                      {semesters.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                    <select
                      name="section"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      value={formData.section}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Section</option>
                      {getOptions(sections, defaultSections).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </>
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
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Register;
