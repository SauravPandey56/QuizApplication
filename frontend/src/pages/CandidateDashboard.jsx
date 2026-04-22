import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, BookOpen, Clock, Activity, Award, Bell, User, Settings,
  Menu, Search, LogOut, Play, ChevronRight, CheckCircle, AlertCircle, TrendingUp, Filter, Download, Target, MessageSquare, Link2
} from 'lucide-react';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import ProfileEditor from '../components/profile/ProfileEditor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#EF4444', '#F59E0B', '#06B6D4'];

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [preparingEnvironments, setPreparingEnvironments] = useState({});
  
  // Data State
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to QuizSphere', desc: 'Secure your academic profile to track rankings.', time: '2h ago', read: false },
    { id: 2, title: 'New Module Uploaded', desc: 'A new quiz has been mapped to your course.', time: '1d ago', read: true }
  ]);

  // Derived stats
  const completedAttempts = attempts.filter(a => a.status === 'completed');
  const totalAttempted = completedAttempts.length;
  const avgScore = totalAttempted > 0 
    ? (completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAttempted).toFixed(1)
    : 0;
  
  const studentRankObj = leaderboard.find(l => l.candidateName === user.name);
  const myRank = studentRankObj ? leaderboard.indexOf(studentRankObj) + 1 : '-';

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    let pollInterval;
    if (activeTab === 'dashboard' || activeTab === 'quizzes') {
      pollInterval = setInterval(() => {
        axios.get('/api/quizzes').then(res => setQuizzes(res.data.quizzes || [])).catch(() => {});
      }, 5000);
    }
    return () => clearInterval(pollInterval);
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const [quizRes, attemptRes, leaderRes] = await Promise.all([
        axios.get('/api/quizzes').catch(() => ({ data: { quizzes: [] } })),
        axios.get('/api/attempts').catch(() => ({ data: [] })),
        axios.get('/api/attempts/leaderboard').catch(() => ({ data: [] }))
      ]);
      
      setQuizzes(quizRes.data.quizzes || []);
      setAttempts(attemptRes.data || []);
      setLeaderboard(leaderRes.data || []);
    } catch (err) {
      console.error("Data synchronization error:", err);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const { data } = await axios.post('/api/attempts', { quizId });
      navigate(`/attempt/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize testing environment');
    }
  };

  const handlePrepareEnvironment = (quizId) => {
    setPreparingEnvironments((prev) => ({ ...prev, [quizId]: 'preparing' }));
    
    // Simulate robust environment checks (browser, internet, webcam, fullscreen API checks logically delayed)
    setTimeout(() => {
      setPreparingEnvironments((prev) => ({ ...prev, [quizId]: 'ready' }));
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarInitials = (name) => {
    if(!name) return "X";
    const parts = name.split(" ");
    if(parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Recharts Data Mapping
  const trendData = completedAttempts.map((a, index) => ({
    name: `Quiz ${index + 1}`,
    score: a.score,
    title: a.quiz?.title || 'Unknown'
  }));

  const accuracyData = [
    { name: 'Correct', value: completedAttempts.reduce((acc, a) => acc + (a.totalCorrect || 0), 0) },
    { name: 'Incorrect', value: completedAttempts.reduce((acc, a) => acc + (a.totalIncorrect || 0), 0) }
  ];

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard Overview' },
    { id: 'quizzes', icon: BookOpen, label: 'Available Quizzes' },
    { id: 'history', icon: Clock, label: 'My Past Attempts' },
    { id: 'results', icon: Activity, label: 'Target Analytics' },
    { id: 'leaderboard', icon: Award, label: 'Global Leaderboard' },
    { id: 'notifications', icon: Bell, label: 'Alerts & Reminders' },
    { id: 'feedback', icon: MessageSquare, label: 'Platform Feedback' },
    { id: 'contact', icon: Link2, label: 'Get in Touch' },
    { id: 'profile', icon: User, label: 'Academic Profile' },
  ];

  const liveUnattemptedQuizzes = quizzes.filter(q => q.state === 'LIVE' && !completedAttempts.some(a => a.quiz?._id === q._id));

  return (
    <div className="flex w-full h-screen overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900/90 backdrop-blur-xl border-r border-white/10 text-slate-300 w-64 h-full flex flex-col transition-all duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full fixed'}`}>
        <div className="h-16 flex border-b border-white/10 items-center justify-between px-6 shrink-0 bg-slate-950/50">
           <QuizSphereLogo size="sm" showText={true} />
        </div>
        
        {/* Profile Snapshot */}
        <div className="p-5 border-b border-white/10 flex items-center space-x-3 bg-white/5">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-[#06B6D4] text-white flex items-center justify-center font-bold shadow-md">
             {getAvatarInitials(user.name)}
           </div>
           <div>
             <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
             <p className="text-[10px] uppercase font-bold text-[#06B6D4] tracking-widest">Candidate</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">Main Menu</p>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/30 text-white font-medium' 
                  : 'hover:bg-white/10 hover:text-white text-slate-400'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-100' : ''} />
              <span>{item.label}</span>
              {item.id === 'notifications' && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-950/30">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
            <LogOut size={20} /><span>Sign Out securely</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white/40 backdrop-blur-md border-b border-white/30 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-slate-600 hover:text-indigo-600 transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              {menuItems.find(m => m.id === activeTab)?.label || 'Workspace'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Search modules..." className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 focus:bg-white focus:border-indigo-400 rounded-xl text-sm w-64 transition-all outline-none shadow-sm" />
            </div>
            <button onClick={() => setActiveTab('notifications')} className="relative text-slate-600 hover:text-indigo-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Frame */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
               <div className="bg-gradient-to-r from-indigo-600 to-[#06B6D4] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-white/20">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
                 <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
                 
                 <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                    <p className="text-indigo-100 font-medium tracking-widest text-sm uppercase mb-1">Academic Gateway</p>
                    <h1 className="text-3xl lg:text-4xl font-black mb-2 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-white/80 max-w-md text-sm md:text-base">Track your analytics, conquer new assessments, and climb the institutional leaderboard.</p>
                 </div>
                 
                 <button onClick={() => setActiveTab('quizzes')} className="relative z-10 bg-white text-indigo-600 hover:bg-slate-50 font-bold py-3.5 px-8 rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center whitespace-nowrap group">
                   Start Executing <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Attempted</p>
                       <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalAttempted}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-inner">
                       <BookOpen size={24} className="text-indigo-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-[11px] font-bold text-indigo-700 bg-indigo-100/50 inline-block px-2.5 py-1 rounded-md border border-indigo-200">Modules Completed</div>
                 </div>

                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Average Score</p>
                       <h3 className="text-4xl font-black text-emerald-700 tracking-tight">{avgScore}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-inner">
                       <TrendingUp size={24} className="text-emerald-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/50 inline-block px-2.5 py-1 rounded-md border border-emerald-200">System Computed</div>
                 </div>

                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Queued Tests</p>
                       <h3 className="text-4xl font-black text-cyan-700 tracking-tight">{quizzes.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-500 transition-colors shadow-inner">
                       <Clock size={24} className="text-cyan-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-[11px] font-bold text-cyan-800 bg-cyan-100/50 inline-block px-2.5 py-1 rounded-md border border-cyan-200">Available to map</div>
                 </div>

                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => setActiveTab('leaderboard')}>
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Global Rank</p>
                       <h3 className="text-4xl font-black text-[#9333EA] tracking-tight">{myRank}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:bg-[#9333EA] transition-colors shadow-inner">
                       <Award size={24} className="text-[#9333EA] group-hover:text-white" />
                     </div>
                   </div>
                   <div className="flex items-center text-[11px] font-bold text-purple-800 bg-purple-100/50 inline-block px-2.5 py-1 rounded-md border border-purple-200">
                     View Ranking <ChevronRight size={12} className="ml-1 inline"/>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* AVAILABLE QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                 <div>
                   <h1 className="text-3xl font-black text-slate-800 tracking-tight">Deployment Modules</h1>
                   <p className="text-slate-500 mt-1 font-medium">Select and securely execute your assigned examinations.</p>
                 </div>
                 <div className="flex space-x-2">
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> {quizzes.length} Live</span>
                 </div>
              </div>

              {quizzes.length === 0 ? (
                <div className="bg-white/40 backdrop-blur border border-white/50 rounded-[32px] p-16 text-center shadow-sm">
                   <CheckCircle size={48} className="mx-auto text-slate-300 mb-4"/>
                   <h3 className="text-xl font-bold text-slate-700">All caught up!</h3>
                   <p className="text-slate-500 mt-2 max-w-sm mx-auto">There are no pending quizzes assigned to your specific branch and semester mapping.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {quizzes.map(quiz => {
                    const isUpcoming = quiz.state === 'SCHEDULED' || quiz.state === 'APPROVED';
                    const isEnvReady = quiz.state === 'UPCOMING';
                    const isLive = quiz.state === 'LIVE';
                    const isCompleted = quiz.state === 'COMPLETED' || completedAttempts.some(a => a.quiz?._id === quiz._id);
                    
                    const startTime = quiz.startTime ? new Date(quiz.startTime) : null;
                    const diffSeconds = startTime ? Math.floor((startTime - currentTime) / 1000) : 0;
                    
                    const formatCountdown = (secs) => {
                      if(secs <= 0) return '00:00:00';
                      const h = Math.floor(secs / 3600).toString().padStart(2, '0');
                      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
                      const s = (secs % 60).toString().padStart(2, '0');
                      return `${h}:${m}:${s}`;
                    };

                    const isPrepared = preparingEnvironments[quiz._id] === 'ready';
                    const isPreparing = preparingEnvironments[quiz._id] === 'preparing';

                    return (
                      <div key={quiz._id} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                           <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border backdrop-blur-sm shadow-sm ${
                             isCompleted ? 'bg-slate-100 text-slate-500 border-slate-200' :
                             isLive ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' :
                             isEnvReady ? 'bg-amber-50 text-amber-600 border-amber-200' :
                             'bg-blue-50/80 text-blue-600 border-blue-200'
                           }`}>
                             {isCompleted ? 'Completed' : isLive ? 'Live' : isEnvReady ? 'Prepare Environment' : 'Upcoming'}
                           </span>
                           <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded bg-white/50">Target: {quiz.totalMarks}</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-2 line-clamp-2">{quiz.title}</h3>
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 flex-1">{quiz.description || "No specific instructions explicitly provided by the Examiner."}</p>

                        <div className="space-y-3 mb-6">
                           <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                             <Clock size={16} className="text-indigo-400 mr-2 shrink-0"/> {quiz.duration} Minutes Duration
                           </div>
                           {(isUpcoming || isEnvReady) && (
                             <div className="flex items-center text-sm font-black text-slate-700 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                               <Timer size={18} className="text-indigo-500 mr-2 shrink-0 animate-pulse"/> Exam starts in: {formatCountdown(diffSeconds)}
                             </div>
                           )}
                           {isLive && !isCompleted && (
                             <div className="flex items-center text-sm font-black text-red-600 bg-red-50/50 p-3 rounded-lg border border-red-100">
                               <AlertCircle size={18} className="mr-2 shrink-0 animate-pulse"/> EXAM IS LIVE NOW
                             </div>
                           )}
                        </div>

                        {isCompleted ? (
                          <button disabled className="w-full py-3 rounded-xl font-bold flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                            Quiz Completed
                          </button>
                        ) : isUpcoming ? (
                          <button disabled className="w-full py-3 rounded-xl font-bold flex items-center justify-center bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-sm">
                            Locked <Play size={16} className="ml-2 opacity-50"/>
                          </button>
                        ) : isEnvReady ? (
                          <button 
                            onClick={() => handlePrepareEnvironment(quiz._id)}
                            disabled={isPrepared || isPreparing}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-md ${
                              isPrepared ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                              isPreparing ? 'bg-amber-100 text-amber-700 border border-amber-200 cursor-wait' :
                              'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            {isPrepared ? 'Environment Ready' : isPreparing ? 'Preparing Environment...' : 'Prepare Environment'}
                          </button>
                        ) : isLive ? (
                          <button 
                            onClick={() => handleStartQuiz(quiz._id)}
                            className="w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-md bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-red-500/30 active:scale-[0.98]"
                          >
                            Enter Live Exam <Play size={16} className="ml-2"/>
                          </button>
                        ) : (
                           <button disabled className="w-full py-3 rounded-xl font-bold flex items-center justify-center bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200">
                             Unavailable
                           </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* RESULTS & ANALYTICS TAB */}
          {activeTab === 'results' && (
            <div className="animate-fade-in space-y-6 max-w-6xl mx-auto">
               <div className="mb-8">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Performance Matrix</h1>
                 <p className="text-slate-500 mt-1 font-medium">Deep algorithmic breakdown of your historical assessments.</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Trajectory Graph */}
                  <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg p-6">
                     <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><TrendingUp className="mr-2 text-indigo-500"/> Score Trajectory</h3>
                     <div className="h-[300px] w-full">
                       {trendData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={trendData}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                             <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                             <YAxis stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                             <RechartsTooltip 
                               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                               labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                             />
                             <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={4} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6, fill: '#06B6D4' }} />
                           </LineChart>
                         </ResponsiveContainer>
                       ) : (
                         <div className="h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">No historical trajectory available.</div>
                       )}
                     </div>
                  </div>

                  {/* Accuracy Pie */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg p-6 flex flex-col">
                     <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center"><Target className="mr-2 text-[#06B6D4]"/> Total Accuracy Ratio</h3>
                     <div className="flex-1 min-h-[250px] relative">
                        {totalAttempted > 0 ? (
                          <>
                           <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                               <Pie data={accuracyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                 {accuracyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                               </Pie>
                               <RechartsTooltip />
                             </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                             <span className="text-2xl font-black text-slate-800 tracking-tighter">
                               {Math.round((accuracyData[0].value / (accuracyData[0].value + accuracyData[1].value)) * 100 || 0)}%
                             </span>
                             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Precision</span>
                           </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 font-medium">Matrix unpopulated.</div>
                        )}
                     </div>
                     <div className="flex justify-center space-x-6 mt-4 border-t border-slate-100 pt-4">
                        <div className="flex items-center text-xs font-bold text-slate-600"><span className="w-3 h-3 rounded-md bg-[#4F46E5] mr-2"></span> Correct</div>
                        <div className="flex items-center text-xs font-bold text-slate-600"><span className="w-3 h-3 rounded-md bg-[#EF4444] mr-2"></span> Incorrect</div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-6">
                 <div>
                   <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cryptographic Ledger</h1>
                   <p className="text-slate-500 mt-1 font-medium">Immutable records of your previous exam interactions.</p>
                 </div>
                 <button className="flex items-center space-x-2 bg-white text-slate-600 border border-slate-200 px-4 py-2 mt-4 md:mt-0 rounded-xl hover:bg-slate-50 font-bold transition-colors shadow-sm text-sm">
                   <Filter size={16}/> <span>Filter Ledger</span>
                 </button>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/60 backdrop-blur-md">
                        <th className="px-6 py-5.5 font-bold text-xs uppercase tracking-widest text-slate-500">Target Identifier</th>
                        <th className="px-6 py-5.5 font-bold text-xs uppercase tracking-widest text-slate-500">Timestamp</th>
                        <th className="px-6 py-5.5 font-bold text-xs uppercase tracking-widest text-slate-500">Status Vector</th>
                        <th className="px-6 py-5.5 font-bold text-xs uppercase tracking-widest text-slate-500 text-right">Computed Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60">
                      {attempts.length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400 font-medium">No recorded entries present in the ledger.</td></tr>
                      )}
                      {attempts.map(attempt => (
                        <tr key={attempt._id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4 font-bold text-slate-800">{attempt.quiz?.title || 'Unknown Asset'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm font-medium">{new Date(attempt.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${attempt.status === 'completed' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-200' : 'bg-amber-50/80 text-amber-600 border-amber-200'}`}>
                              {attempt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {attempt.status === 'completed' ? (
                               <span className="font-black text-lg text-indigo-900 group-hover:text-indigo-600 transition-colors">{attempt.score}</span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="animate-fade-in max-w-5xl mx-auto">
               <div className="text-center mb-10 mt-4">
                 <div className="w-16 h-16 bg-gradient-to-tr from-[#9333EA] to-[#06B6D4] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 transform -rotate-6">
                    <Award size={32}/>
                 </div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Ranking Tier</h1>
                 <p className="text-slate-500 mt-2 font-medium max-w-md mx-auto">See how your algorithmic computations rack up against candidates across all mapped campuses and branches.</p>
               </div>

               <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden p-2">
                 <ul className="divide-y divide-slate-100/80">
                   {leaderboard.length === 0 && <p className="p-8 text-center text-slate-400 font-bold">Leaderboard synchronizing...</p>}
                   {leaderboard.map((l, idx) => (
                     <li key={l._id} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${l.candidateName === user.name ? 'bg-indigo-50 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}>
                       <div className="flex items-center space-x-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-md' : idx === 1 ? 'bg-slate-300 text-slate-700 shadow-md' : idx === 2 ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                           #{idx + 1}
                         </div>
                         <div>
                           <p className="font-bold text-slate-800">{l.candidateName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.quizTitle} • {l.campus}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="font-black text-xl text-indigo-600">{l.score}</p>
                         <p className="text-[10px] text-slate-400 uppercase font-bold">Total Points</p>
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
               <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-8">System Alerts</h1>
               <div className="space-y-4">
                 {notifications.map(notif => (
                   <div key={notif.id} className={`p-6 rounded-2xl border backdrop-blur-xl flex items-start space-x-4 transition-all hover:shadow-md ${notif.read ? 'bg-white/50 border-white/40 opacity-70' : 'bg-white/90 border-indigo-200 shadow-sm'}`}>
                      <div className={`p-3 rounded-full mt-1 ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Bell size={20}/>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold ${notif.read ? 'text-slate-700' : 'text-indigo-900'}`}>{notif.title}</h4>
                          <span className="text-xs font-semibold text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{notif.desc}</p>
                      </div>
                      {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2"></div>}
                   </div>
                 ))}
               </div>
            </div>
          )}
          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
               <div className="mb-8">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Feedback</h1>
                 <p className="text-slate-500 mt-1 font-medium">Submit diagnostic logs, feature requests, or general platform feedback directly to the engineering team.</p>
               </div>
               
               <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 lg:p-12 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                 
                 <form className="relative z-10 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Transmission successful: Thank you for your feedback. Our team will review it.'); setActiveTab('dashboard'); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Authorized Reporter</label>
                        <input type="text" value={user.name} readOnly className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium rounded-xl px-4 py-3 outline-none cursor-not-allowed shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Return Address</label>
                        <input type="email" value={user.email} readOnly className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium rounded-xl px-4 py-3 outline-none cursor-not-allowed shadow-inner" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Transmission Category</label>
                        <select className="w-full bg-white border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-inner transition-all appearance-none" required>
                          <option value="">Select diagnostic class...</option>
                          <option value="bug">Bug Report</option>
                          <option value="feature">Feature Request</option>
                          <option value="ui">UI Suggestion</option>
                          <option value="general">General Feedback</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Platform Experience Rating</label>
                        <div className="flex items-center space-x-2 pt-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} type="button" className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold transition-all hover:scale-110 shadow-sm ${star >= 4 ? 'border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white' : 'border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white'}`}>
                              {star}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Detailed Message</label>
                      <textarea rows="4" className="w-full bg-white border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-inner resize-none transition-all" placeholder="Describe your experience or outline reproduction steps..." required></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60">
                      <button type="submit" className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] w-full sm:w-auto">
                        Transmit Feedback
                      </button>
                    </div>
                 </form>
               </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
               <div className="text-center mb-12 mt-8">
                 <h1 className="text-4xl font-black text-slate-800 tracking-tight">Direct Networking</h1>
                 <p className="text-slate-500 mt-2 font-medium max-w-xl mx-auto">Connect with the engineering architect out-of-band to discuss integrations, proposals, or networking opportunities.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 {/* LinkedIn Card */}
                 <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noreferrer" className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-8 hover:bg-white hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-300 transform hover:-translate-y-2 group text-center block">
                   <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                     <svg className="w-8 h-8 text-blue-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Professional Network</h3>
                   <p className="text-sm font-medium text-slate-500">Connect securely on LinkedIn</p>
                 </a>

                 {/* GitHub Card */}
                 <a href="https://github.com/SauravPandey56" target="_blank" rel="noreferrer" className="bg-white/70 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 hover:bg-white hover:border-purple-500 hover:shadow-[0_20px_40px_rgba(147,51,234,0.15)] transition-all duration-300 transform hover:-translate-y-2 group text-center block">
                   <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
                     <svg className="w-8 h-8 text-purple-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Code Repository</h3>
                   <p className="text-sm font-medium text-slate-500">Explore the project architecture</p>
                 </a>

                 {/* Email Card */}
                 <a href="mailto:pandeysaurav108@gmail.com" className="bg-white/70 backdrop-blur-xl border border-indigo-100 rounded-3xl p-8 hover:bg-white hover:border-indigo-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] transition-all duration-300 transform hover:-translate-y-2 group text-center block">
                   <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                     <svg className="w-8 h-8 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Direct Communication</h3>
                   <p className="text-sm font-medium text-slate-500">Initiate an email sequence</p>
                 </a>

               </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-4xl mx-auto pb-12">
              <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-[#06B6D4] rounded-3xl p-8 lg:p-10 shadow-2xl mb-8 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center border border-white/20">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2aDJWMzRoLTIyem0wLTEwaDJWMGgtdjI0ek0yNCAzNGgtMjR2MmgyNHYtMnptMC0xMEgyNHYyaC0yNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                 <div className="relative z-10 w-28 h-28 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl font-black text-white shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-6 sm:mb-0">
                    {getAvatarInitials(user.name)}
                 </div>
                 <div className="relative z-10 sm:ml-8 text-white">
                    <h1 className="text-3xl font-black mb-1 tracking-tight">{user.name}</h1>
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-white/90 text-sm font-medium">
                      <span>{user.email}</span>
                      <span className="hidden sm:inline opacity-50">•</span>
                      <span className="bg-white/20 px-3 py-1 rounded-md text-xs font-bold tracking-widest mt-3 sm:mt-0 uppercase border border-white/20">Authorized Student</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                 <ProfileEditor />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Exam Start Trigger Modal */}
      {liveUnattemptedQuizzes.length > 0 && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4">
          {liveUnattemptedQuizzes.map(liveQuiz => (
            <div key={liveQuiz._id} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-[6px] border-red-500 animate-in zoom-in fade-in duration-300 mb-6">
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50">
                <AlertCircle size={48} className="animate-pulse"/>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Exam Starting</h2>
              <p className="text-slate-600 font-medium mb-8 text-lg">Your exam <b>"{liveQuiz.title}"</b> is starting now. Ensure your environment is fully prepared.</p>
              
              <button 
                onClick={() => handleStartQuiz(liveQuiz._id)}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-red-500/30 transition-transform hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center uppercase tracking-widest"
              >
                Start Exam <Play size={24} className="ml-3 fill-current"/>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default CandidateDashboard;
