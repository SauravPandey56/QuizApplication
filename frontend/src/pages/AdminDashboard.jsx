import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Users, FileText, Settings, MessageSquare, ClipboardList, 
  Bell, LogOut, Search, PlusCircle, Trash2, Ban, Layers, Activity, UserCog, CheckCircle, XCircle, Menu, BookOpen
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import QuestionEditorModal from '../components/quiz/QuestionEditorModal';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
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
  const [postponeQuiz, setPostponeQuiz] = useState(null);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [broadcastQuizId, setBroadcastQuizId] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [extendQuizId, setExtendQuizId] = useState(null);
  const [extendMinutes, setExtendMinutes] = useState(15);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ACTIONS
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
    } catch (err) { alert(err.response?.data?.message || 'Error creating user'); }
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

  const handleApproveQuiz = async (id) => {
    try {
      await axios.put(`/api/quizzes/${id}/approve`);
      fetchData();
    } catch { alert('Error approving quiz'); }
  };

  const handlePostponeQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/quizzes/${postponeQuiz._id}/schedule`, { startTime: newStartTime, endTime: newEndTime });
      setPostponeQuiz(null);
      fetchData();
    } catch { alert('Error scheduling quiz'); }
  };

  const executeControl = async (id, action, payload = {}) => {
    try {
      await axios.put(`/api/quizzes/${id}/${action}`, payload);
      fetchData();
      setBroadcastQuizId(null);
      setExtendQuizId(null);
      setBroadcastMessage('');
      alert(`Emergency Action: ${action} executed.`);
    } catch (e) {
      alert(`Failed to execute ${action}`);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if(!window.confirm("Are you sure you want to delete this quiz?")) return;
    try { 
      await axios.delete(`/api/quizzes/${id}`); 
      fetchData(); 
    } catch { alert('Error deleting quiz'); }
  };


  // Generate mock chart data since API format might differ
  const getLineData = () => {
    if (!performance || performance.length === 0) return [{ name: 'Attempt 1', score: 0 }];
    const last10 = performance.slice(-10);
    return last10.map((p, i) => ({ name: `Attempt ${i + 1}`, score: p.score || 0 }));
  };

  const getBarData = () => {
    if (!quizzes || quizzes.length === 0) return [];
    return quizzes.slice(0, 5).map(q => ({ name: q.title.substring(0, 10), attempts: Math.floor(Math.random() * 20) + 1 }));
  };

  const getPieData = () => {
    if (!courses || courses.length === 0) return [{ name: 'Empty', value: 1 }];
    return courses.slice(0, 4).map(c => ({ name: c.name, value: quizzes.filter(q => q.course?._id === c._id).length || 1 }));
  };

  const COLORS = ['#4F46E5', '#06B6D4', '#22C55E', '#9333EA'];

  const getAvatarInitials = (name) => {
    if(!name) return "X";
    const parts = name.split(" ");
    if(parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Sidenav Mapping
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'quizzes', icon: ClipboardList, label: 'Quizzes & Approvals' },
    { id: 'users', icon: Users, label: 'User Directory' },
    { id: 'results', icon: Activity, label: 'Performance Analytics' },
    { id: 'settings', icon: Settings, label: 'System Configuration' },
    { id: 'feedback', icon: MessageSquare, label: 'Support & Feedback' },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F8FAFC]">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900 text-slate-300 w-64 h-full flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20'}`}>
        <div className="h-16 flex border-b border-slate-800 items-center justify-between px-6 shrink-0 bg-slate-900">
           <QuizSphereLogo size="sm" showText={true} />
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">Admin Controls</p>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 focus:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-200' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
            <LogOut size={20} /><span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-slate-500 hover:text-slate-800">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block capitalize">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Search system..." className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 border rounded-lg text-sm w-64 transition-all outline-none" />
            </div>
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
               <div className="flex flex-col items-end hidden md:flex">
                 <span className="text-sm font-bold text-slate-700 leading-tight">{user.name}</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Administrator</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200 shadow-sm group-hover:scale-105 transition-transform">
                 {getAvatarInitials(user.name)}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 sm:p-8 custom-scrollbar">
          
          {/* OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
               {/* Metrics Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                       <h3 className="text-3xl font-black text-slate-800">{users.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                       <Users size={24} className="text-indigo-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">
                     ▲ +{users.filter(u=>u.role!=='admin').length} Candidates
                   </div>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Quizzes</p>
                       <h3 className="text-3xl font-black text-slate-800">{quizzes.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                       <FileText size={24} className="text-cyan-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-slate-600">
                     Across {courses.length} Active Courses
                   </div>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Attempts</p>
                       <h3 className="text-3xl font-black text-slate-800">{performance.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                       <Activity size={24} className="text-purple-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">
                     Healthy Testing Volume
                   </div>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Updates Pending</p>
                       <h3 className="text-3xl font-black text-amber-600">{quizzes.filter(q => q.updatePermissionStatus === 'pending').length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                       <Bell size={24} className="text-amber-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-amber-700 bg-amber-50 inline-block px-2 py-1 rounded">
                     Requires Admin Approval
                   </div>
                 </div>
               </div>

               {/* Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Main Chart */}
                 <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-indigo-500"/> Performance Trends</h3>
                    <div className="h-72 w-full">
                       <ResponsiveContainer>
                          <AreaChart data={getLineData()}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Side Charts / Distribution */}
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Layers className="mr-2 text-cyan-500"/> Course Distribution</h3>
                    <div className="flex-1 w-full min-h-[250px] relative flex justify-center items-center">
                       <ResponsiveContainer>
                          <PieChart>
                             <Pie data={getPieData()} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {getPieData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                             </Pie>
                             <Tooltip contentStyle={{ borderRadius: '12px' }} />
                             <Legend iconType="circle" />
                          </PieChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* RESULTS / PERFORMANCE TAB TABLE */}
          {activeTab === 'results' && (
            <div className="animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Global Student Performance</h2>
                    <p className="text-sm text-slate-500">Monitor automated testing results centrally.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                        <th className="p-4 pl-6">Candidate</th>
                        <th className="p-4">Academic Target</th>
                        <th className="p-4">Quiz Matrix</th>
                        <th className="p-4 text-right pr-6">Score Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {performance.length === 0 && (
                         <tr><td colSpan="4" className="text-center py-10 text-slate-500">No attempts recorded on platform.</td></tr>
                       )}
                       {performance.map((p, idx) => {
                         const scorePercent = p.quiz?.totalMarks ? (p.score / p.quiz.totalMarks) * 100 : 0;
                         let badgeColor = 'bg-red-50 text-red-600 border-red-200';
                         if (scorePercent > 80) badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
                         else if (scorePercent > 50) badgeColor = 'bg-amber-50 text-amber-600 border-amber-200';

                         return (
                           <tr key={p._id || idx} className="hover:bg-slate-50/80 transition-colors">
                             <td className="p-4 pl-6">
                               <div className="flex items-center space-x-3">
                                 <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex flex-col justify-center items-center font-bold text-xs ring-2 ring-white">
                                    {getAvatarInitials(p.candidate?.name)}
                                 </div>
                                 <div>
                                   <div className="font-bold text-slate-800">{p.candidate?.name || 'Unknown'}</div>
                                   <div className="text-xs text-slate-400 font-medium">{p.candidate?.email}</div>
                                 </div>
                               </div>
                             </td>
                             <td className="p-4 text-xs">
                               <div className="font-medium text-slate-700">{p.candidate?.universityCampus || 'Unknown Campus'}</div>
                               <div className="text-slate-500">{p.candidate?.branch} • Sem {p.candidate?.semester} • Sec {p.candidate?.section}</div>
                             </td>
                             <td className="p-4">
                               <div className="font-semibold text-slate-800">{p.quiz?.title || 'Unknown Quiz'}</div>
                               <div className="text-xs text-slate-500">{p.quiz?.course?.name || 'No Course'}</div>
                             </td>
                             <td className="p-4 pr-6 text-right">
                               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                                  {p.score} / {p.quiz?.totalMarks || 0}
                               </span>
                             </td>
                           </tr>
                         )
                       })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <div>
                      <h2 className="text-xl font-bold text-slate-800">Quiz Operations & Requests</h2>
                      <p className="text-sm text-slate-500">Approve editing permissions and monitor module targets.</p>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                        <th className="p-4 pl-6">Quiz Payload</th>
                        <th className="p-4">Demographics</th>
                        <th className="p-4 text-right pr-6">Status & Requests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {quizzes.map(q => (
                         <tr key={q._id} className="hover:bg-slate-50/80 transition-colors">
                           <td className="p-4 pl-6">
                              <div className="font-bold text-slate-800">{q.title}</div>
                              <div className="text-xs font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 mt-1 rounded"><UserCog size={10} className="inline mr-1"/>{q.examiner?.name}</div>
                           </td>
                           <td className="p-4">
                              <div className="flex space-x-1 flex-wrap">
                                 {q.universityCampus ? <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border mb-1">{q.universityCampus}</span> : <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 mb-1">ALL CAMPUS</span>}
                                 {q.branch && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border mb-1">{q.branch}</span>}
                              </div>
                           </td>
                           <td className="p-4 pr-6 flex flex-col items-end">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border ${q.status === 'approved' || q.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : q.status === 'pending_approval' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                 {q.status ? q.status.replace('_', ' ') : (q.isPublished ? 'approved' : 'draft')}
                              </span>
                              
                              {q.updatePermissionStatus === 'pending' && (
                                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-left w-64 shadow-sm mb-2">
                                   <div className="flex items-center mb-1.5"><Bell size={12} className="text-amber-600 mr-1"/> <span className="text-xs font-bold text-amber-800">Update Request</span></div>
                                   <p className="text-xs text-amber-700/80 mb-2 truncate">"{q.updatePermissionMessage}"</p>
                                   <div className="flex justify-end gap-2">
                                     <button onClick={() => updateQuizPermission(q._id, 'none')} className="bg-white border border-slate-200 text-slate-600 hover:text-red-600 px-2.5 py-1 text-xs rounded font-bold shadow-sm transition-colors">Deny</button>
                                     <button onClick={() => updateQuizPermission(q._id, 'granted')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 text-xs rounded font-bold shadow-sm transition-colors">Approve</button>
                                   </div>
                                </div>
                              )}

                              <div className="flex flex-wrap justify-end gap-2 mt-2 w-full max-w-[250px]">
                                {q.status === 'REVIEW' && (
                                  <button onClick={() => handleApproveQuiz(q._id)} className="text-[11px] flex items-center justify-center font-bold bg-emerald-50 hover:bg-emerald-100 border hover:border-emerald-200 text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded transition-all">
                                    <CheckCircle size={12} className="mr-1"/> Approve
                                  </button>
                                )}
                                {['APPROVED', 'SCHEDULED'].includes(q.status) && (
                                  <button onClick={() => { setPostponeQuiz(q); setNewStartTime(q.startTime ? new Date(q.startTime).toISOString().slice(0, 16) : ''); setNewEndTime(q.endTime ? new Date(q.endTime).toISOString().slice(0, 16) : ''); }} className="text-[11px] flex items-center justify-center font-bold bg-amber-50 hover:bg-amber-100 border hover:border-amber-200 text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded transition-all">
                                    {q.status === 'APPROVED' ? 'Schedule' : 'Postpone'}
                                  </button>
                                )}
                                <button onClick={() => setEditingQuiz(q)} className="text-[11px] flex items-center justify-center font-bold bg-slate-100 hover:bg-indigo-50 border hover:border-indigo-200 text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded transition-all">
                                  <Layers size={12} className="mr-1"/> Inspect
                                </button>
                                <button onClick={() => handleDeleteQuiz(q._id)} className="text-[11px] flex items-center justify-center font-bold bg-red-50 hover:bg-red-100 border hover:border-red-200 text-red-600 hover:text-red-700 px-3 py-1.5 rounded transition-all">
                                  <Trash2 size={12} className="mr-1"/> Delete
                                </button>
                              </div>
                              {['UPCOMING', 'LIVE'].includes(q.state) && (
                                <div className="flex flex-wrap gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 justify-end w-full max-w-[250px]">
                                  <button onClick={() => executeControl(q._id, 'pause')} className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200">
                                    {q.isPaused ? "Resume" : "Pause"}
                                  </button>
                                  <button onClick={() => setExtendQuizId(q._id)} className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200">Extend</button>
                                  <button onClick={() => setBroadcastQuizId(q._id)} className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200">Broadcast</button>
                                  <button onClick={() => { if(window.confirm('Force submit?')) executeControl(q._id, 'force-submit') }} className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200">Force Stop</button>
                                </div>
                              )}
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
            <div className="animate-fade-in space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-end gap-4 overflow-hidden">
                 <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Onboard New User</h2>
                    <p className="text-sm text-slate-500">Manually provision candidates or examiners to the platform.</p>
                 </div>
                 <form onSubmit={handleCreateUser} className="flex-1 grid grid-cols-2 gap-3 items-end">
                    <div><input required type="text" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-all" placeholder="Name" /></div>
                    <div><input required type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-all" placeholder="Email" /></div>
                    <div><input required type="password" value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-all" placeholder="Password" /></div>
                    <div className="flex space-x-2">
                      <select value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-all">
                        <option value="candidate">Candidate</option>
                        <option value="examiner">Examiner</option>
                      </select>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 flex items-center justify-center rounded-lg shadow-md shrink-0 transition-colors"><PlusCircle size={18}/></button>
                    </div>
                 </form>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                      <tr className="bg-white text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                        <th className="p-4 pl-6">Profile</th>
                        <th className="p-4">Role Matrix</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 pl-6">
                             <div className="flex items-center space-x-3">
                               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex flex-col justify-center items-center font-bold text-xs ring-2 ring-white">
                                  {getAvatarInitials(u.name)}
                               </div>
                               <div>
                                 <div className="font-bold text-slate-800">{u.name}</div>
                                 <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                               </div>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className={`text-xs font-bold uppercase tracking-wider inline-block px-2.5 py-1 rounded border ${u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-200' : u.role === 'examiner' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{u.role}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${u.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                              {u.isActive ? 'Active' : 'Blocked'}
                            </span>
                          </td>
                          <td className="p-4 pr-6 flex justify-end space-x-2 mt-1">
                             <button onClick={() => toggleBlockUser(u._id)} className={`p-1.5 rounded text-slate-400 hover:text-white transition-colors ${u.isActive ? 'hover:bg-amber-500' : 'hover:bg-emerald-500'}`} title={u.isActive ? "Block Access" : "Restore Access"}>
                               {u.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                             </button>
                             <button onClick={() => removeUser(u._id)} className="p-1.5 rounded text-slate-400 hover:bg-red-500 hover:text-white transition-colors" title="Delete Profile">
                               <Trash2 size={16} />
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
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Settings className="mr-2 text-indigo-500"/> Core Targeting Models</h3>
                  <form onSubmit={handleCreateSetting} className="flex space-x-2 mb-6">
                    <select value={newSetting.type} onChange={(e) => setNewSetting({...newSetting, type: e.target.value})} className="px-3 py-2 border rounded-lg bg-slate-50 text-sm font-medium outline-none w-32 border-slate-200 focus:bg-white focus:border-indigo-500">
                      <option value="campus">Campus</option>
                      <option value="branch">Branch</option>
                      <option value="semester">Semester</option>
                      <option value="section">Section</option>
                    </select>
                    <input type="text" placeholder="Data Value (e.g. Graphic Era)" required value={newSetting.value} onChange={(e) => setNewSetting({...newSetting, value: e.target.value})} className="flex-1 px-4 py-2 border border-slate-200 bg-slate-50 text-sm rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-all"/>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><PlusCircle size={18}/></button>
                  </form>
                  <div className="space-y-4">
                     {['campus', 'branch', 'semester', 'section'].map(type => (
                       <div key={type} className="border border-slate-100 rounded-xl bg-slate-50/50 p-4">
                         <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">{type}</h4>
                         <div className="flex flex-wrap gap-2">
                           {settings.filter(s => s.type === type).length === 0 && <span className="text-xs text-slate-400 italic">None added</span>}
                           {settings.filter(s => s.type === type).map(s => (
                             <span key={s._id} className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center">
                               {s.value} <button onClick={() => deleteSetting(s._id)} className="ml-2 text-slate-400 hover:text-red-500"><XCircle size={12}/></button>
                             </span>
                           ))}
                         </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><BookOpen className="mr-2 text-cyan-500"/> Managing Subjects</h3>
                  <form onSubmit={handleCreateCourse} className="flex space-x-2 mb-6">
                    <input type="text" placeholder="Subject Name (e.g. Data Structures)" required value={newCourse} onChange={(e) => setNewCourse(e.target.value)} className="flex-1 px-4 py-2 border border-slate-200 bg-slate-50 text-sm rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-all"/>
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold shadow-md shadow-cyan-500/20"><PlusCircle size={18} className="mr-1"/> Add</button>
                  </form>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {courses.length === 0 && <span className="text-sm text-slate-400">No subjects currently instantiated.</span>}
                     {courses.map(course => (
                       <div key={course._id} className="flex items-center justify-between border border-slate-100 bg-slate-50 hover:bg-white p-3 rounded-xl transition-colors">
                          <span className="font-semibold text-slate-700 text-sm">{course.name}</span>
                          <button onClick={() => deleteCourse(course._id)} className="text-slate-400 hover:text-red-500 p-1 bg-white rounded shadow-sm border border-slate-100"><Trash2 size={14}/></button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <div className="animate-fade-in max-w-6xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 pb-2 mb-6">
                 <h2 className="text-xl font-bold text-slate-800">Support & Feedback Inbox</h2>
                 <p className="text-sm text-slate-500 mt-1">Review bug reports and student requests securely submitted via the platform.</p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4 w-1/3">Message</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {feedbacks.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">Inbox is empty. No new tickets!</td>
                        </tr>
                      )}
                      {feedbacks.map(f => (
                        <tr key={f._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!f.isRead ? 'bg-amber-50/50' : ''}`}>
                          <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">{getAvatarInitials(f.name)}</div>
                              <span>{f.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 truncate max-w-[150px]">{f.email}</td>
                          <td className="p-4 font-medium text-slate-700 truncate max-w-[150px]">{f.subject || 'No Subject'}</td>
                          <td className="p-4 text-slate-600 truncate max-w-[300px]" title={f.message}>{f.message}</td>
                          <td className="p-4 text-slate-500 whitespace-nowrap text-xs">{new Date(f.createdAt).toLocaleDateString()} {new Date(f.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td className="p-4">
                            <div className="flex justify-center items-center space-x-2">
                              {!f.isRead && (
                                <button onClick={() => markFeedbackRead(f._id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Mark as Read">
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button onClick={() => deleteFeedback(f._id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete Feedback">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {editingQuiz && (
        <QuestionEditorModal quiz={editingQuiz} onClose={() => setEditingQuiz(null)} />
      )}

      {postponeQuiz && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Postpone Quiz</h3>
              <form onSubmit={handlePostponeQuiz} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">New Start Time</label>
                   <input required type="datetime-local" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">New End Time</label>
                   <input type="datetime-local" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none" />
                 </div>
                 <div className="flex justify-end space-x-3 mt-6">
                   <button type="button" onClick={() => setPostponeQuiz(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                   <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors">Save Schedule</button>
                 </div>
              </form>
           </div>
        </div>
      )}


      {/* Admin Emergency Modals */}
      {extendQuizId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Extend Time</h3>
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Minutes to ADD</label>
                   <input required type="number" min="1" value={extendMinutes} onChange={e => setExtendMinutes(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none" />
                 </div>
                 <div className="flex justify-end space-x-3 mt-6">
                   <button type="button" onClick={() => setExtendQuizId(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                   <button onClick={() => executeControl(extendQuizId, 'extend', { extensionMinutes: extendMinutes })} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">Apply</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {broadcastQuizId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Send Broadcast</h3>
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                   <textarea required value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} rows="3" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 outline-none resize-none" />
                 </div>
                 <div className="flex justify-end space-x-3 mt-6">
                   <button type="button" onClick={() => setBroadcastQuizId(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                   <button onClick={() => executeControl(broadcastQuizId, 'broadcast', { message: broadcastMessage })} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors">Send</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
