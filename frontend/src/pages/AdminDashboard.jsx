import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Users, PlusCircle, Ban, Trash2, Activity, Settings, MessageSquare, ClipboardList, CheckCircle, XCircle, Layers } from 'lucide-react';
import QuestionEditorModal from '../components/quiz/QuestionEditorModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [settings, setSettings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [newCourse, setNewCourse] = useState('');
  const [newSetting, setNewSetting] = useState({ type: 'campus', value: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    axios.get('/api/courses').then(res => setCourses(res.data)).catch(console.error);
    axios.get('/api/users').then(res => setUsers(res.data)).catch(console.error);
    axios.get('/api/users/performance').then(res => setPerformance(res.data)).catch(console.error);
    axios.get('/api/quizzes').then(res => setQuizzes(res.data.quizzes)).catch(console.error);
    axios.get('/api/settings').then(res => setSettings(res.data)).catch(console.error);
    axios.get('/api/feedbacks').then(res => setFeedbacks(res.data)).catch(console.error);
  };

  // --- ACTIONS ---
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', { name: newCourse, description: 'Added by Administrator' });
      setNewCourse('');
      fetchData();
    } catch { alert('Error creating course'); }
  };

  const deleteCourse = async (id) => {
    if(!window.confirm("Delete course?")) return;
    try { await axios.delete(`/api/courses/${id}`); fetchData(); } catch { alert('Error'); }
  };

  const handleCreateSetting = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings', newSetting);
      setNewSetting({ type: 'campus', value: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error adding setting'); }
  };

  const deleteSetting = async (id) => {
    try { await axios.delete(`/api/settings/${id}`); fetchData(); } catch { alert('Error'); }
  };

  const toggleBlockUser = async (id) => {
    try { await axios.put(`/api/users/${id}/toggle-block`); fetchData(); } catch { alert('Error'); }
  };

  const removeUser = async (id) => {
    if(!window.confirm("Delete user strictly?")) return;
    try { await axios.delete(`/api/users/${id}`); fetchData(); } catch { alert('Error'); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/create', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'candidate' });
      fetchData();
      alert('User created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const updateQuizPermission = async (quizId, status) => {
    try {
      await axios.post(`/api/quizzes/${quizId}/handle-permission`, { status });
      fetchData();
    } catch { alert('Error answering request'); }
  };

  const markFeedbackRead = async (id) => {
    try { await axios.put(`/api/feedbacks/${id}/read`); fetchData(); } catch { alert('Error'); }
  };

  const deleteFeedback = async (id) => {
    try { await axios.delete(`/api/feedbacks/${id}`); fetchData(); } catch { alert('Error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-slate-800">System Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {['overview', 'quizzes', 'users', 'settings', 'feedback'].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 font-medium rounded-t-lg capitalize transition-colors ${activeTab === tab ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Total Users</div>
                <div className="text-2xl font-bold text-slate-800">{users.length}</div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Total Quizzes</div>
                <div className="text-2xl font-bold text-slate-800">{quizzes.length}</div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Total Attempts</div>
                <div className="text-2xl font-bold text-slate-800">{performance.length}</div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Pending Updates</div>
                <div className="text-2xl font-bold text-amber-600">{quizzes.filter(q => q.updatePermissionStatus === 'pending').length}</div>
             </div>
           </div>

           <div className="glass-panel p-6">
            <div className="flex items-center mb-4 text-emerald-600">
              <Activity size={24} className="mr-2"/>
              <h2 className="text-xl font-bold">Global Student Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Academic Target</th>
                    <th className="p-3">Quiz Taken</th>
                    <th className="p-3">Course</th>
                    <th className="p-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                   {performance.length === 0 && (
                     <tr><td colSpan="5" className="text-center p-4 text-slate-500">No attempts recorded.</td></tr>
                   )}
                   {performance.map(p => (
                     <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50">
                       <td className="p-3 font-medium text-slate-800">
                         {p.candidate?.name || 'Unknown'}<br/><span className="text-xs text-slate-400 font-normal">{p.candidate?.email}</span>
                       </td>
                       <td className="p-3 text-xs text-slate-600">
                         {p.candidate?.universityCampus || 'N/A'}, {p.candidate?.branch || 'N/A'} <br/>
                         Sem: {p.candidate?.semester || 'N/A'}, Sec: {p.candidate?.section || 'N/A'}
                       </td>
                       <td className="p-3 text-slate-600 font-semibold">{p.quiz?.title || 'Unknown Quiz'}</td>
                       <td className="p-3 text-slate-500">{p.quiz?.course?.name || 'N/A'}</td>
                       <td className="p-3 text-right font-bold text-indigo-600">{p.score} <span className="text-slate-400 font-normal">/ {p.quiz?.totalMarks || 0}</span></td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="glass-panel p-6">
             <div className="flex items-center mb-4 text-indigo-600">
                <ClipboardList size={24} className="mr-2"/>
                <h2 className="text-xl font-bold">Quiz Operations & Requests</h2>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm border-collapse">
                 <thead>
                   <tr className="border-b bg-slate-50 text-slate-600">
                     <th className="p-3">Quiz Details</th>
                     <th className="p-3">Targeting (Campus/Branch/Sem/Sec)</th>
                     <th className="p-3">Status</th>
                     <th className="p-3 text-right">Update Request</th>
                   </tr>
                 </thead>
                 <tbody>
                    {quizzes.map(q => (
                      <tr key={q._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3">
                           <div className="font-bold text-slate-800">{q.title}</div>
                           <div className="text-xs text-slate-500">By: {q.examiner?.name} | {q.course?.name}</div>
                        </td>
                        <td className="p-3 text-xs font-mono text-slate-600">
                           {q.universityCampus || 'ALL'} / {q.branch || 'ALL'} / {q.semester || 'ALL'} / {q.section || 'ALL'}
                        </td>
                        <td className="p-3">
                           <span className={`px-2 py-1 rounded text-xs ${q.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{q.isPublished ? 'Live' : 'Draft'}</span>
                        </td>
                        <td className="p-3 text-right">
                           {q.updatePermissionStatus === 'pending' ? (
                             <div className="bg-amber-50 p-2 rounded border border-amber-200 text-left w-48 inline-block ml-auto mb-2">
                                <p className="text-xs text-amber-800 mb-2 italic">"{q.updatePermissionMessage}"</p>
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => updateQuizPermission(q._id, 'none')} className="text-red-600 hover:text-red-800 p-1"><XCircle size={16}/></button>
                                  <button onClick={() => updateQuizPermission(q._id, 'granted')} className="text-green-600 hover:text-green-800 p-1"><CheckCircle size={16}/></button>
                                </div>
                             </div>
                           ) : q.updatePermissionStatus === 'granted' ? (
                             <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded block mb-2 w-max ml-auto">Granted</span>
                           ) : (
                             <span className="text-xs text-slate-400 block mb-2">None</span>
                           )}
                           <button onClick={() => setEditingQuiz(q)} className="text-xs flex items-center justify-end bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded ml-auto">
                             <Layers size={14} className="mr-1"/> Questions
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
           <div className="glass-panel p-6">
            <div className="flex items-center mb-4 text-blue-600">
              <Users size={24} className="mr-2"/>
              <h2 className="text-xl font-bold">User Access Control</h2>
            </div>

            <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-slate-50 border rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input required type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Password</label>
                <input required type="password" value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="min 6 chars" minLength={6} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <select value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="candidate">Candidate</option>
                  <option value="examiner">Examiner</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center">
                <PlusCircle size={16} className="mr-1"/> Add User
              </button>
            </form>
            
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="border-b bg-slate-50">
                    <th className="p-3">Name / Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Academic Target</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">
                         <div className="font-bold">{u.name}</div>
                         <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-3 capitalize font-semibold">{u.role}</td>
                      <td className="p-3 text-xs text-slate-600">
                         {u.role === 'candidate' ? `${u.universityCampus||'NA'} | ${u.branch||'NA'} | ${u.semester||'0'} | ${u.section||'NA'}` : '--'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="p-3 flex justify-end space-x-3 mt-2">
                         <button onClick={() => toggleBlockUser(u._id)} className={`${u.isActive ? 'text-amber-500 hover:text-amber-700' : 'text-green-500 hover:text-green-700'}`} title={u.isActive ? "Block" : "Unblock"}>
                           <Ban size={18} />
                         </button>
                         <button onClick={() => removeUser(u._id)} className="text-red-500 hover:text-red-700" title="Delete">
                           <Trash2 size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-4 text-emerald-600">
              <Settings size={24} className="mr-2"/>
              <h2 className="text-xl font-bold">Targeting Configurations</h2>
            </div>
            
            <form onSubmit={handleCreateSetting} className="flex space-x-2 mb-6 p-4 bg-slate-50 rounded-lg border">
              <select value={newSetting.type} onChange={(e) => setNewSetting({...newSetting, type: e.target.value})} className="px-3 py-2 border rounded-lg bg-white outline-none">
                <option value="campus">Campus</option>
                <option value="branch">Branch</option>
                <option value="semester">Semester</option>
                <option value="section">Section</option>
              </select>
              <input 
                type="text" placeholder="Value (e.g. GEU DEHRADUN)" required
                value={newSetting.value} onChange={(e) => setNewSetting({...newSetting, value: e.target.value})}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold"><PlusCircle size={18}/></button>
            </form>

            <div className="grid grid-cols-2 gap-4">
               {['campus', 'branch', 'semester', 'section'].map(type => (
                 <div key={type} className="border rounded-lg p-3">
                   <h3 className="font-bold capitalize text-slate-700 mb-2 border-b pb-1">{type}s</h3>
                   <ul className="space-y-1">
                     {settings.filter(s => s.type === type).length === 0 && <span className="text-xs text-slate-400">None configured</span>}
                     {settings.filter(s => s.type === type).map(s => (
                       <li key={s._id} className="flex justify-between items-center bg-white p-2 text-sm rounded shadow-sm">
                         <span>{s.value}</span>
                         <button onClick={() => deleteSetting(s._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center mb-4 text-indigo-600">
              <BookOpen size={24} className="mr-2"/>
              <h2 className="text-xl font-bold">Manage Subjects / Courses</h2>
            </div>
            
            <form onSubmit={handleCreateCourse} className="flex space-x-2 mb-6 p-4 bg-slate-50 rounded-lg border">
              <input 
                type="text" placeholder="Course Name" required
                value={newCourse} onChange={(e) => setNewCourse(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><PlusCircle size={18}/></button>
            </form>

            <ul className="space-y-2 overflow-y-auto max-h-64 pr-2">
              {courses.map(course => (
                 <li key={course._id} className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                   <span className="font-medium text-slate-700">{course.name}</span>
                   <button onClick={() => deleteCourse(course._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                 </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === 'feedback' && (
        <div className="glass-panel p-6">
           <div className="flex items-center mb-4 text-amber-600">
              <MessageSquare size={24} className="mr-2"/>
              <h2 className="text-xl font-bold">Support & Feedback Inbox</h2>
           </div>

           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
             {feedbacks.length === 0 && <p className="text-slate-500">Inbox is empty.</p>}
             {feedbacks.map(f => (
               <div key={f._id} className={`p-4 rounded-xl border ${f.isRead ? 'bg-slate-50 border-slate-200' : 'bg-white border-amber-300 shadow-sm border-l-4'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800">{f.name} <span className="text-xs font-normal text-slate-500 ml-2">&lt;{f.email}&gt;</span></h4>
                      <p className="text-xs text-slate-400">{new Date(f.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {!f.isRead && <button onClick={() => markFeedbackRead(f._id)} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200">Mark Read</button>}
                      <button onClick={() => deleteFeedback(f._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <p className="text-slate-700 mt-2 bg-slate-50/50 p-3 rounded border text-sm">{f.message}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {editingQuiz && (
        <QuestionEditorModal quiz={editingQuiz} onClose={() => setEditingQuiz(null)} />
      )}

    </div>
  );
};

export default AdminDashboard;
