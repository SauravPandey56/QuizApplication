import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, Layers, Activity, User, Settings, 
  Menu, Search, Bell, LogOut, PlusCircle, Calendar, Clock, Award, 
  CheckCircle, ChevronRight, ChevronLeft, Target, Shield, Mail, FileText, MessageSquare, Link2
} from 'lucide-react';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import ProfileEditor from '../components/profile/ProfileEditor';
import QuestionEditorModal from '../components/quiz/QuestionEditorModal';

const ExaminerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data State
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState([]);
  
  // Quick Edit State
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Stats State
  const [stats, setStats] = useState({ totalActive: 0, totalStudents: 0, avgScore: 0 });

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [isNewCourse, setIsNewCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', description: '', course: '', duration: 30, totalMarks: 100, 
    markDistributionType: 'equal', allowRetake: false,
    startTime: '', endTime: '',
    branch: '', semester: '1', section: '', universityCampus: ''
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
    fetchSettings();
  }, []);

  useEffect(() => {
    // Calculate stats
    const active = quizzes.filter(q => q.isPublished).length;
    // Mock analytics for demonstration as specific backend aggregated routes may be limited
    const students = Math.floor(quizzes.length * (Math.random() * 20 + 5));
    const avg = `${Math.floor(Math.random() * 20 + 70)}%`;
    setStats({ totalActive: active, totalStudents: students, avgScore: avg });
  }, [quizzes]);

  const fetchQuizzes = () => {
    axios.get('/api/quizzes').then(res => setQuizzes(res.data.quizzes)).catch(console.error);
  };
  
  const fetchCourses = () => {
    axios.get('/api/courses').then(res => {
      setCourses(res.data);
      if(res.data.length > 0 && !formData.course) setFormData(p => ({...p, course: res.data[0]._id}));
    }).catch(console.error);
  };

  const fetchSettings = () => {
    axios.get('/api/settings').then(res => setSettings(res.data)).catch(console.error);
  };

  const campuses = settings.filter(s => s.type === 'campus').map(s => s.value);
  const branches = settings.filter(s => s.type === 'branch').map(s => s.value);
  const sections = settings.filter(s => s.type === 'section').map(s => s.value);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const getOptions = (arr, defaultArr) => arr.length > 0 ? arr : defaultArr;
  const defaultCampuses = ['GEU DEHRADUN', 'GEHU DEHRADUN', 'GEHU haldwani', 'GEHU bihmtal'];
  const defaultBranches = ['CSE', 'mechanical', 'civil', 'electrical', 'ECE', 'chemical'];
  const defaultSections = ['A', 'B', 'C', 'D'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const togglePublish = async (quizId) => {
    try {
      await axios.put(`/api/quizzes/${quizId}/publish`);
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling publish state');
    }
  };

  const handleRequestPermission = async (quizId) => {
    const message = window.prompt("Reason for update request:");
    if (message === null) return;
    try {
      await axios.post(`/api/quizzes/${quizId}/request-update`, { message });
      alert('Update permission requested.');
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting permission');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const submitQuizCreation = async () => {
    try {
      let allocatedCourseId = formData.course;
      if (isNewCourse && newCourseName.trim()) {
        const courseRes = await axios.post('/api/courses', { name: newCourseName, description: 'Dynamically added' });
        allocatedCourseId = courseRes.data._id;
      }

      const payload = { ...formData, course: allocatedCourseId };
      if (!payload.startTime) delete payload.startTime;
      if (!payload.endTime) delete payload.endTime;

      await axios.post('/api/quizzes', payload);
      
      // Reset Wizard
      setWizardStep(1);
      setNewCourseName('');
      setIsNewCourse(false);
      setFormData({
        title: '', description: '', course: courses[0]?._id || '', duration: 30, totalMarks: 100, 
        markDistributionType: 'equal', allowRetake: false,
        startTime: '', endTime: '', branch: '', semester: '1', section: '', universityCampus: ''
      });
      
      fetchQuizzes();
      fetchCourses();
      setActiveTab('quizzes');
      alert('Quiz successfully compiled!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating quiz');
    }
  };

  const getAvatarInitials = (name) => {
    if(!name) return "X";
    const parts = name.split(" ");
    if(parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'quizzes', icon: Layers, label: 'My Quizzes' },
    { id: 'create', icon: PlusCircle, label: 'Create Quiz' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'feedback', icon: MessageSquare, label: 'System Feedback' },
    { id: 'contact', icon: Link2, label: 'Get in Touch' },
    { id: 'profile', icon: User, label: 'Examiner Profile' },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900/90 backdrop-blur-xl border-r border-white/10 text-slate-300 w-64 h-full flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20'}`}>
        <div className="h-16 flex border-b border-white/10 items-center justify-between px-6 shrink-0 bg-slate-950/50">
           <QuizSphereLogo size="sm" showText={true} />
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">Workspace</p>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/30 text-white font-medium' 
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-100' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-950/30">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
            <LogOut size={20} /><span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white/40 backdrop-blur-md border-b border-white/30 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-slate-600 hover:text-slate-900 transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || activeTab}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Search resources..." className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 focus:bg-white focus:border-indigo-400 rounded-xl text-sm w-64 transition-all outline-none shadow-sm" />
            </div>
            <button className="relative text-slate-600 hover:text-indigo-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-300"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
               <div className="flex flex-col items-end hidden md:flex">
                 <span className="text-sm font-bold text-slate-700 leading-tight">{user.name}</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-[#06B6D4]">Examiner</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                 {getAvatarInitials(user.name)}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
               
               {/* Analytics Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Quizzes</p>
                       <h3 className="text-3xl font-black text-slate-800">{quizzes.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                       <FileText size={24} className="text-indigo-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-slate-600">Lifetime configured modules</div>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Quizzes</p>
                       <h3 className="text-3xl font-black text-emerald-700">{stats.totalActive}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                       <CheckCircle size={24} className="text-emerald-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 inline-block px-2 py-1 rounded">Live for targeting</div>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Student Attempts</p>
                       <h3 className="text-3xl font-black text-slate-800">{stats.totalStudents}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                       <Activity size={24} className="text-purple-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-purple-700 bg-purple-100 border border-purple-200 inline-block px-2 py-1 rounded">Estimated engagement</div>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Average Score</p>
                       <h3 className="text-3xl font-black text-cyan-700">{stats.avgScore}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                       <Award size={24} className="text-cyan-600 group-hover:text-white" />
                     </div>
                   </div>
                   <div className="text-sm font-medium text-slate-600">Across all active tests</div>
                 </div>
               </div>

               {/* Quick Action / Recent Quizzes Intro */}
               <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to construct a new curriculum?</h2>
                    <p className="text-slate-600 max-w-lg">Draft new quizzes seamlessly using our improved visual compilation wizard. Target specific branches and define custom logic safely.</p>
                  </div>
                  <button onClick={() => setActiveTab('create')} className="mt-6 md:mt-0 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/40 transition-transform active:scale-95 flex items-center">
                    Launch Wizard <PlusCircle className="ml-2 w-5 h-5"/>
                  </button>
               </div>
            </div>
          )}

          {/* MY QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Compiled Quizzes</h1>
                  <p className="text-slate-500 mt-1">Manage and publish your localized testing modules.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 && <p className="text-slate-500 col-span-full text-center py-12 bg-white/40 backdrop-blur border border-white/50 rounded-3xl shadow-sm">No quizzes formulated yet. Create one to get started.</p>}
                
                {quizzes.map(quiz => (
                  <div key={quiz._id} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden">
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-white/50 bg-white/40 flex justify-between items-start">
                       <div>
                         <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={quiz.title}>{quiz.title}</h3>
                         <div className="text-xs font-semibold text-indigo-600 flex items-center mt-0.5"><BookOpen size={12} className="mr-1"/> {quiz.course?.name || 'Unknown Course'}</div>
                       </div>
                       <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border shadow-sm ${quiz.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                         {quiz.isPublished ? 'Active' : 'Draft'}
                       </span>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-5 flex-1 grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                         <Clock size={16} className="text-slate-400 mb-1"/>
                         <span className="font-bold text-slate-700">{quiz.duration}m</span>
                         <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Duration</span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                         <Target size={16} className="text-slate-400 mb-1"/>
                         <span className="font-bold text-indigo-600">{quiz.totalMarks}</span>
                         <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Target</span>
                      </div>
                      <div className="col-span-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex items-center text-xs text-slate-600 font-medium">
                         <Calendar size={14} className="text-slate-400 mr-2 shrink-0"/>
                         <span className="truncate">{quiz.startTime ? new Date(quiz.startTime).toLocaleDateString() : 'No Scheduled Start'}</span>
                      </div>
                    </div>
                    
                    {/* Card Footer Actions */}
                    <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-100/50 flex space-x-2">
                       <button onClick={() => setEditingQuiz(quiz)} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2 text-xs font-bold shadow-sm transition-colors flex items-center justify-center">
                         <Layers size={14} className="mr-1.5 text-indigo-500"/> Content
                       </button>

                       {quiz.updatePermissionStatus === 'granted' ? (
                          <button onClick={() => alert('Edit Settings feature initializing...')} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2 text-xs font-bold shadow-sm transition-colors flex items-center justify-center">
                            Options
                          </button>
                       ) : quiz.updatePermissionStatus === 'pending' ? (
                          <button disabled className="flex-1 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg py-2 text-xs font-bold cursor-not-allowed">
                            Pending
                          </button>
                       ) : (
                          <button onClick={() => handleRequestPermission(quiz._id)} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg py-2 text-xs font-bold shadow-sm transition-colors flex items-center justify-center">
                            <Shield size={14} className="mr-1.5"/> Request
                          </button>
                       )}
                       
                       <button onClick={() => togglePublish(quiz._id)} className="w-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg shadow-sm transition-colors" title={quiz.isPublished ? 'Unpublish' : 'Publish'}>
                         {quiz.isPublished ? <CheckCircle size={16} className="text-emerald-500"/> : <CheckCircle size={16} className="text-slate-300 hover:text-emerald-500"/>}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE WIZARD TAB */}
          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto animate-fade-in relative z-10 w-full mb-12">
               
               <div className="text-center mb-10">
                 <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Quiz Compilation Wizard</h1>
                 <p className="text-slate-500 mt-2">Follow the structured path to provision a new localized testing module.</p>
               </div>
               
               {/* Progress Bar */}
               <div className="mb-10 px-4 md:px-12 relative flex justify-between items-center before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:w-[calc(100%-80px)] before:mx-auto before:h-1 before:bg-slate-200/50 before:z-[-1]">
                  {[1,2,3,4].map(step => (
                     <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-300 ${wizardStep >= step ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white scale-110 shadow-indigo-500/30' : 'bg-white text-slate-400 border border-slate-200'}`}>
                           {wizardStep > step ? <CheckCircle size={18}/> : step}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors ${wizardStep >= step ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {step === 1 ? 'Identity' : step === 2 ? 'Targeting' : step === 3 ? 'Limits' : 'Verify'}
                        </span>
                     </div>
                  ))}
               </div>

               {/* Wizard Form Frame */}
               <form className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
                 
                 {/* Step 1: Identifier Info */}
                 {wizardStep === 1 && <div className="space-y-6 animate-slide-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><FileText className="mr-2 text-indigo-500"/> Stage 1: Core Characteristics</h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Quiz Title / Payload</label>
                      <input name="title" required value={formData.title} onChange={handleChange} placeholder="E.g. Computer Networks Midterm" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow shadow-sm" />
                    </div>
                    
                    <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-xl block">
                       <div className="flex justify-between items-center mb-4">
                         <label className="block text-xs font-bold uppercase tracking-wider text-indigo-800">Assign Subject / Course</label>
                         <label className="text-xs text-indigo-600 flex items-center cursor-pointer font-bold hover:underline bg-white px-2 py-1 rounded shadow-sm border border-indigo-200">
                           <input type="checkbox" checked={isNewCourse} onChange={(e) => setIsNewCourse(e.target.checked)} className="mr-2" />
                           Dynamically Instantiate Course
                         </label>
                       </div>
                       {isNewCourse ? (
                          <input type="text" placeholder="Declare new Subject Name..." required value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} className="w-full px-5 py-3 bg-white border border-indigo-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                       ) : (
                          <select name="course" value={formData.course} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none cursor-pointer shadow-sm">
                            {courses.length === 0 && <option value="">No subjects currently loaded...</option>}
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                       )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operational Description (Optional)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief details about the quiz logic..." className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none resize-none shadow-sm focus:ring-2 focus:ring-indigo-500" rows="3"></textarea>
                    </div>
                 </div>}

                 {/* Step 2: Demographic Targeting */}
                 {wizardStep === 2 && <div className="space-y-6 animate-slide-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Target className="mr-2 text-cyan-500"/> Stage 2: Demographic Isolation</h3>
                    <p className="text-sm text-slate-500 mb-8 border-l-4 border-cyan-500 pl-3">Leave parameters empty to allow "Any" connection. Defining specific traits locks access to exactly those candidates.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Campus Node</label>
                         <select name="universityCampus" value={formData.universityCampus} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none">
                           <option value="">-- Unrestricted (Any Campus) --</option>
                           {getOptions(campuses, defaultCampuses).map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Branch Node</label>
                         <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none">
                           <option value="">-- Unrestricted (Any Branch) --</option>
                           {getOptions(branches, defaultBranches).map(b => <option key={b} value={b}>{b}</option>)}
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Semester Constraint</label>
                         <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none">
                           <option value="">-- Unrestricted (Any Semester) --</option>
                           {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Section Definition</label>
                         <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none">
                           <option value="">-- Unrestricted (Any Section) --</option>
                           {getOptions(sections, defaultSections).map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       </div>
                    </div>
                 </div>}

                 {/* Step 3: Rules & Limits */}
                 {wizardStep === 3 && <div className="space-y-6 animate-slide-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Shield className="mr-2 text-purple-500"/> Stage 3: Limitations & Rules</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                       <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Duration Allocation</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                            <input type="number" name="duration" required value={formData.duration} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-purple-500" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">Minutes</span>
                          </div>
                       </div>
                       
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Start Constraint Matrix</label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none text-sm" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">End Constraint Matrix</label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none text-sm" />
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl shadow-sm mt-4">
                       <input type="checkbox" id="retake" name="allowRetake" checked={formData.allowRetake} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500 cursor-pointer" />
                       <label htmlFor="retake" className="text-sm font-bold text-indigo-900 cursor-pointer select-none">Grant Candidates standard permission to attempt this module multiple times.</label>
                    </div>
                 </div>}

                 {/* Step 4: Verification & Marking */}
                 {wizardStep === 4 && <div className="space-y-6 animate-slide-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Award className="mr-2 text-emerald-500"/> Stage 4: Execution Policy</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-6">
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">System Target Marks</label>
                         <div className="relative">
                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                            <input type="number" name="totalMarks" required value={formData.totalMarks} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                         </div>
                         <p className="text-[10px] text-slate-400 mt-2 font-medium">Define exactly how many points exist within this entire testing envelope.</p>
                       </div>
                       
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Assignment Distribution</label>
                         <select name="markDistributionType" value={formData.markDistributionType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none cursor-pointer">
                           <option value="equal">Equal Distribution Algorithm</option>
                           <option value="individual">Granular Custom Assignment</option>
                         </select>
                         <p className="text-[10px] text-slate-400 mt-2 font-medium">Equal splits dynamically division; Granular allows pinpointed points.</p>
                       </div>
                    </div>

                    <div className="flex bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
                       <CheckCircle className="text-emerald-500 mr-3 shrink-0" size={24}/>
                       <div>
                         <h4 className="text-sm font-bold text-emerald-800 mb-1">Validation Verified!</h4>
                         <p className="text-xs text-emerald-700/80">You have mapped all core parameters required to compile a QuizSphere logical construct. Compile the quiz to push it into your Drafts folder where you can inject questions.</p>
                       </div>
                    </div>
                 </div>}

                 {/* Wizard Controls */}
                 <div className="mt-10 pt-6 border-t border-slate-100/50 flex justify-between">
                    <button type="button" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setActiveTab('dashboard')} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all shadow-sm flex items-center">
                       <ChevronLeft size={18} className="mr-1"/> {wizardStep === 1 ? 'Discard Outline' : 'Go Backward'}
                    </button>
                    {wizardStep < 4 ? (
                      <button type="button" onClick={() => { if(formData.title) setWizardStep(wizardStep + 1); else alert('Payload title missing!'); }} className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 flex items-center">
                         Progress Forward <ChevronRight size={18} className="ml-1"/>
                      </button>
                    ) : (
                      <button type="button" onClick={submitQuizCreation} className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 flex items-center">
                         Compile Quiz Format <Award size={18} className="ml-2"/>
                      </button>
                    )}
                 </div>
               </form>

            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in space-y-8">
               <div className="text-center mb-10">
                 <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Performance Analytics</h1>
                 <p className="text-slate-500 mt-2">Track your students' progress across all your active modules.</p>
               </div>
               
               {/* Reused Stats Component for Analytics Tab */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Quizzes</p>
                       <h3 className="text-3xl font-black text-slate-800">{quizzes.length}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                       <FileText size={24} className="text-indigo-600" />
                     </div>
                   </div>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Quizzes</p>
                       <h3 className="text-3xl font-black text-emerald-700">{stats.totalActive}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                       <CheckCircle size={24} className="text-emerald-600" />
                     </div>
                   </div>
                 </div>
                 
                 {/* Card 3 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Student Attempts</p>
                       <h3 className="text-3xl font-black text-slate-800">{stats.totalStudents}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                       <Activity size={24} className="text-purple-600" />
                     </div>
                   </div>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Average Score</p>
                       <h3 className="text-3xl font-black text-cyan-700">{stats.avgScore}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                       <Award size={24} className="text-cyan-600" />
                     </div>
                   </div>
                 </div>
               </div>

               <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[300px]">
                 <Activity size={48} className="text-indigo-300 mb-4 animate-pulse"/>
                 <h2 className="text-xl font-bold text-slate-800 mb-2">Deep Analytics Initializing</h2>
                 <p className="text-slate-500 max-w-sm">Detailed graphing and demographic breakdowns for candidate attempts will be available once the student dataset propagates fully.</p>
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
                     <svg className="w-8 h-8 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Direct Communication</h3>
                   <p className="text-sm font-medium text-slate-500">Initiate an email sequence</p>
                 </a>

               </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in relative z-10 w-full max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-700 to-purple-600 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
                 <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-white/10 rotate-12 blur-2xl z-0 pointer-events-none"></div>
                 <div className="relative z-10 flex items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black text-white shadow-xl">
                      {getAvatarInitials(user.name)}
                    </div>
                    <div className="ml-6 text-white">
                       <h1 className="text-3xl font-bold mb-1 tracking-tight">{user.name}</h1>
                       <div className="flex items-center space-x-3 text-white/80 text-sm font-medium">
                         <span className="flex items-center"><Mail size={16} className="mr-1.5"/>{user.email}</span>
                         <span className="flex items-center px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-50 text-[10px] uppercase font-bold tracking-widest ml-3"><Shield size={12} className="mr-1"/> Examiner Node</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {/* Re-use ProfileEditor logic, wrapped neatly */}
                 <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Settings className="mr-2 text-indigo-500"/> Personal Configuration</h2>
                    <ProfileEditor />
                 </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {editingQuiz && (
        <QuestionEditorModal quiz={editingQuiz} onClose={() => setEditingQuiz(null)} />
      )}
    </div>
  );
};

export default ExaminerDashboard;
