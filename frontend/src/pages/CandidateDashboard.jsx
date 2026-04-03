import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Play, User, Home } from 'lucide-react';
import ProfileEditor from '../components/profile/ProfileEditor';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'dashboard') {
      axios.get('/api/quizzes').then(res => setQuizzes(res.data.quizzes)).catch(console.error);
      axios.get('/api/attempts').then(res => setAttempts(res.data)).catch(console.error);
    }
  }, [activeTab]);

  const handleStartQuiz = async (quizId) => {
    try {
      const { data } = await axios.post('/api/attempts', { quizId });
      navigate(`/attempt/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start quiz');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 mb-6 font-medium">
        <button className={`py-3 px-6 flex items-center space-x-2 ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('dashboard')}>
          <Home size={18}/> <span>My Dashboard</span>
        </button>
        <button className={`py-3 px-6 flex items-center space-x-2 ${activeTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('profile')}>
          <User size={18}/> <span>Account Settings</span>
        </button>
      </div>

      {activeTab === 'profile' && <ProfileEditor />}

      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 shadow-inner flex-shrink-0 flex items-center justify-center overflow-hidden mr-6">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-white/80" />
              )}
            </div>
            <div className="relative z-10">
               <h1 className="text-3xl font-bold mb-2">Candidate Division</h1>
               <p className="text-white/80">Ready to execute your assignment? Track parameters below.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="glass-panel text-center p-8 text-slate-500">No quizzes are currently active or published for your course right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <div key={quiz._id} className="glass-panel p-6 hover:-translate-y-1 transition-transform group">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                  <p className="text-slate-500 mt-2 text-sm line-clamp-2">{quiz.description}</p>
                  <div className="mt-4 flex flex-col space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Duration</span><span className="font-semibold">{quiz.duration} mins</span>
                    </div>
                    {quiz.startTime && (
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Scheduled For</span>
                        <span className="font-medium text-emerald-600">{new Date(quiz.startTime).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Total Marks</span><span className="font-semibold">{quiz.totalMarks}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartQuiz(quiz._id)}
                    className="mt-6 w-full flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 rounded-lg transition-all font-medium"
                  >
                    <Play size={16} />
                    <span>Start Quiz</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Past Results</h2>
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600">Quiz</th>
                  <th className="p-4 font-semibold text-slate-600">Date</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 && (
                  <tr><td colSpan="4" className="p-4 text-center text-slate-500">No past attempts found.</td></tr>
                )}
                {attempts.map(attempt => (
                  <tr key={attempt._id} className="border-b border-slate-100 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{attempt.quiz?.title || 'Unknown Quiz'}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(attempt.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${attempt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {attempt.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800 text-right">
                      {attempt.status === 'completed' ? attempt.score : '-'}
                      {attempt.status === 'completed' && attempt.quiz && <span className="text-slate-400 font-normal ml-1">/ {attempt.quiz.totalMarks}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidateDashboard;
