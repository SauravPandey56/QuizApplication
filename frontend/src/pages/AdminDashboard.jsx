import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Users, PlusCircle, Ban, Trash2, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('/api/courses').then(res => setCourses(res.data)).catch(console.error);
    axios.get('/api/users').then(res => setUsers(res.data)).catch(console.error);
    axios.get('/api/users/performance').then(res => setPerformance(res.data)).catch(console.error);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', { name: newCourse, description: 'Added by Administrator' });
      setNewCourse('');
      fetchData();
    } catch (err) {
      alert('Error creating course');
    }
  };

  const toggleBlock = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}/toggle-block`);
      fetchData();
    } catch (err) {
      alert('Error changing user status');
    }
  };

  const removeUser = async (userId) => {
    if(!window.confirm("Are you sure you want to completely remove this user?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchData();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const deleteCourse = async (courseId) => {
    if(!window.confirm("Are you sure you want to deactivate this course? It will be hidden from new registrations but data will be preserved.")) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating course');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">System Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COURSES PANEL */}
        <div className="glass-panel p-6">
          <div className="flex items-center mb-4 text-indigo-600">
            <BookOpen size={24} className="mr-2"/>
            <h2 className="text-xl font-bold">Manage Courses</h2>
          </div>
          
          <form onSubmit={handleCreateCourse} className="flex space-x-2 mb-6">
            <input 
              type="text" 
              placeholder="E.g. Bachelor of Arts" 
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
              <PlusCircle size={18} className="mr-1"/> Add
            </button>
          </form>

          <ul className="space-y-2 border-t border-slate-200 mt-4 overflow-y-auto max-h-64">
            {courses.map(course => (
               <li key={course._id} className="flex justify-between items-center bg-white/50 p-3 rounded-lg border border-slate-100">
                 <span className="font-medium text-slate-700">{course.name}</span>
                 <button onClick={() => deleteCourse(course._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
               </li>
            ))}
          </ul>
        </div>

        {/* USERS PANEL */}
        <div className="glass-panel p-6">
          <div className="flex items-center mb-4 text-blue-600">
            <Users size={24} className="mr-2"/>
            <h2 className="text-xl font-bold">User Access Control</h2>
          </div>
          
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b bg-slate-50">
                  <th className="p-2">Name</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 font-medium">{u.name}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="p-2 flex justify-end space-x-2">
                       <button onClick={() => toggleBlock(u._id)} className={`${u.isActive ? 'text-amber-500 hover:text-amber-700' : 'text-green-500 hover:text-green-700'}`} title={u.isActive ? "Block" : "Unblock"}>
                         <Ban size={16} />
                       </button>
                       <button onClick={() => removeUser(u._id)} className="text-red-500 hover:text-red-700" title="Delete">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PERFORMANCE PANEL */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex items-center mb-4 text-emerald-600">
            <Activity size={24} className="mr-2"/>
            <h2 className="text-xl font-bold">Global Student Performance</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Quiz Taken</th>
                  <th className="p-3">Course</th>
                  <th className="p-3 text-right">Final Score</th>
                </tr>
              </thead>
              <tbody>
                 {performance.length === 0 && (
                   <tr><td colSpan="4" className="text-center p-4 text-slate-500">No attempts recorded yet.</td></tr>
                 )}
                 {performance.map(p => (
                   <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50">
                     <td className="p-3 font-medium text-slate-700">{p.candidate?.name || 'Unknown User'}</td>
                     <td className="p-3 text-slate-600">{p.quiz?.title || 'Unknown Quiz'}</td>
                     <td className="p-3 text-slate-500">{p.quiz?.course?.name || 'N/A'}</td>
                     <td className="p-3 text-right font-bold text-slate-800">{p.score} <span className="text-slate-400 font-normal">/ {p.quiz?.totalMarks || 0}</span></td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
