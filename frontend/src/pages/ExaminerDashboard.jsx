import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, BookOpen, Clock, Award, User, Layers, Calendar, CheckCircle } from 'lucide-react';
import ProfileEditor from '../components/profile/ProfileEditor';
import QuestionEditorModal from '../components/quiz/QuestionEditorModal';

const ExaminerDashboard = () => {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  
  // Modal state
  const [editingQuiz, setEditingQuiz] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', course: '', duration: 30, totalMarks: 100, 
    markDistributionType: 'equal', allowRetake: false,
    startTime: '', endTime: '',
    branch: '', semester: 1, section: '', universityCampus: ''
  });
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    if (activeTab === 'quizzes') {
      fetchQuizzes();
      fetchCourses();
      fetchSettings();
    }
  }, [activeTab]);

  const fetchQuizzes = () => {
    axios.get('/api/quizzes').then(res => setQuizzes(res.data.quizzes)).catch(console.error);
  };
  
  const fetchCourses = () => {
    axios.get('/api/courses').then(res => {
      setCourses(res.data);
      if(res.data.length > 0) setFormData(p => ({...p, course: res.data[0]._id}));
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

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      let allocatedCourseId = formData.course;
      
      // If dynamically adding course
      if (isNewCourse && newCourseName.trim()) {
        const courseRes = await axios.post('/api/courses', { name: newCourseName, description: 'Dynamically added' });
        allocatedCourseId = courseRes.data._id;
      }

      const payload = { ...formData, course: allocatedCourseId };
      if (!payload.startTime) delete payload.startTime;
      if (!payload.endTime) delete payload.endTime;

      await axios.post('/api/quizzes', payload);
      setShowCreateForm(false);
      setNewCourseName('');
      setIsNewCourse(false);
      fetchQuizzes();
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating quiz');
    }
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

  const handleEditDetails = async (quiz) => {
    if (quiz.updatePermissionStatus !== 'granted') {
      if (quiz.updatePermissionStatus === 'pending') {
        alert('Your update request is currently pending admin approval.');
      } else {
        alert('You must request permission from the admin to update this quiz.');
      }
      return;
    }
    // Simplistic handling for direct editing - omitted full form logic for brevity, 
    // real app would open an edit modal like the question editor.
    alert('Edit mode unlocked! (Implementation pending based on requirements)');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation */}
      <div className="flex border-b border-slate-200 mb-6 font-medium">
        <button className={`py-3 px-6 flex items-center space-x-2 ${activeTab === 'quizzes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('quizzes')}>
          <Layers size={18}/> <span>My Compiled Quizzes</span>
        </button>
        <button className={`py-3 px-6 flex items-center space-x-2 ${activeTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('profile')}>
          <User size={18}/> <span>Examiner Profile</span>
        </button>
      </div>

      {activeTab === 'profile' && <ProfileEditor />}

      {activeTab === 'quizzes' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Quiz Management</h1>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-md font-bold"
            >
              <PlusCircle size={20} />
              <span>{showCreateForm ? 'Cancel Wizard' : 'Create New Quiz'}</span>
            </button>
          </div>

          {showCreateForm && (
            <div className="glass-panel p-6 animate-fade-in border-indigo-200 border-2 shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4 text-indigo-800 flex items-center"><Award className="mr-2"/> New Quiz Specification</h2>
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none" />
                  </div>
                  
                  {/* Dynamic Course Selector */}
                  <div className="border border-indigo-100 p-3 rounded-lg bg-indigo-50/50">
                    <div className="flex justify-between mb-1">
                      <label className="block text-sm font-medium text-slate-700">Course Target</label>
                      <label className="text-xs text-indigo-600 flex items-center cursor-pointer font-bold hover:underline">
                        <input type="checkbox" checked={isNewCourse} onChange={(e) => setIsNewCourse(e.target.checked)} className="mr-1" />
                        + Add Missing Course
                      </label>
                    </div>
                    {isNewCourse ? (
                      <input type="text" placeholder="E.g. Engineering 101" required value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} className="w-full px-4 py-2 border border-indigo-300 rounded-lg outline-none" />
                    ) : (
                      <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none cursor-pointer">
                        {courses.length === 0 && <option value="">No courses yet...</option>}
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    )}
                  </div>

                  {/* Target Fields */}
                  <div className="md:col-span-2 border border-slate-200 p-4 rounded-xl bg-white/50">
                     <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">Targeting Validation</h3>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Campus Options</label>
                          <select name="universityCampus" value={formData.universityCampus} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm cursor-pointer">
                            <option value="">Any Campus</option>
                            {getOptions(campuses, defaultCampuses).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Branch Focus</label>
                          <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm cursor-pointer">
                            <option value="">Any Branch</option>
                            {getOptions(branches, defaultBranches).map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Semester Rule</label>
                          <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm cursor-pointer">
                            <option value="">Any Semester</option>
                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Section Match</label>
                          <select name="section" value={formData.section} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm cursor-pointer">
                            <option value="">Any Section</option>
                            {getOptions(sections, defaultSections).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                     </div>
                  </div>

                  {/* Scheduling block */}
                  <div className="md:col-span-2 border border-slate-200 p-4 rounded-xl bg-white/50">
                     <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center"><Calendar size={16} className="mr-1"/> Scheduling & Time constraints</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Duration (minutes)</label>
                          <input type="number" name="duration" required value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Start Time (Optional)</label>
                          <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">End Time (Optional)</label>
                          <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                        </div>
                     </div>
                  </div>

                  {/* Marks & Extras */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks Limit</label>
                    <input type="number" name="totalMarks" required value={formData.totalMarks} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mark Distribution Policy</label>
                    <select name="markDistributionType" value={formData.markDistributionType} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none cursor-pointer">
                      <option value="equal">Equal Validation (Total/Questions)</option>
                      <option value="individual">Granular Assignment (Per Question)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description Brief</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" rows="2"></textarea>
                  </div>
                  
                  <div className="flex items-center md:col-span-2 mt-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                    <input type="checkbox" name="allowRetake" checked={formData.allowRetake} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded cursor-pointer" />
                    <label className="ml-3 text-sm text-indigo-900 font-bold cursor-pointer select-none">Allow Candidates to Retake this Quiz (If Failed/Completed)</label>
                  </div>
                </div>
                
                <button type="submit" className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center text-lg">
                   Compile Quiz Ruleset <CheckCircle className="ml-2 w-5 h-5"/>
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {quizzes.length === 0 && <p className="text-slate-500 col-span-full text-center py-10 bg-white/30 rounded-2xl border border-dashed border-slate-300">You haven't compiled any localized quizzes yet.</p>}
            {quizzes.map(quiz => (
              <div key={quiz._id} className={`glass-panel p-6 border-t-4 hover:shadow-xl transition-shadow flex flex-col ${quiz.isPublished ? 'border-emerald-500' : 'border-amber-400'}`}>
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{quiz.title}</h3>
                   <button 
                     onClick={() => togglePublish(quiz._id)}
                     className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm cursor-pointer transition-colors border ${quiz.isPublished ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'}`}
                   >
                     {quiz.isPublished ? 'Live Target' : 'Draft Mode'}
                   </button>
                </div>
                
                <div className="my-4 flex-1 space-y-2.5 text-sm text-slate-600 bg-white/60 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center font-medium"><BookOpen size={16} className="mr-2 text-indigo-500"/> Core: {quiz.course?.name || 'Unknown'}</div>
                  <div className="flex items-center font-medium"><Clock size={16} className="mr-2 text-indigo-500"/> Duration: {quiz.duration}m</div>
                  <div className="flex items-center font-medium"><Award size={16} className="mr-2 text-indigo-500"/> Target Score: {quiz.totalMarks}</div>
                  {quiz.startTime && <div className="flex items-center font-medium text-xs text-indigo-600 bg-indigo-50 p-1 rounded mt-2 px-2"><Calendar size={14} className="mr-1"/> Starts: {new Date(quiz.startTime).toLocaleDateString()}</div>}
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setEditingQuiz(quiz)}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-2.5 text-sm font-bold shadow-md transition-all flex justify-center items-center"
                  >
                    Question Editor
                  </button>

                  {quiz.updatePermissionStatus === 'granted' ? (
                     <button onClick={() => handleEditDetails(quiz)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-bold shadow-md transition-all flex justify-center items-center">
                        Edit Settings
                     </button>
                  ) : quiz.updatePermissionStatus === 'pending' ? (
                     <button disabled className="w-full bg-slate-200 text-slate-500 rounded-xl py-2.5 text-sm font-bold shadow-md transition-all flex justify-center items-center cursor-not-allowed text-xs">
                        Update Pending...
                     </button>
                  ) : (
                     <button onClick={() => handleRequestPermission(quiz._id)} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md transition-all flex justify-center items-center p-1 text-center leading-tight">
                        Request Update Perms
                     </button>
                  )}
                </div>
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

export default ExaminerDashboard;
