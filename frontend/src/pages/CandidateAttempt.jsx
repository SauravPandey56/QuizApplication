import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Timer, CheckCircle, AlertCircle, Maximize, 
  ChevronRight, ChevronLeft, Flag, Info
} from 'lucide-react';

const CandidateAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [reviewMarks, setReviewMarks] = useState({}); // Tracking strictly 'marked for review' boolean map
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Proctoring States
  const [isStarted, setIsStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  
  // Refs
  const responsesRef = useRef({});
  const handlingViolationRef = useRef(false);
  const quizRef = useRef(null);

  useEffect(() => {
    if(quiz) quizRef.current = quiz;
  }, [quiz]);

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        const { data: allAttempts } = await axios.get('/api/attempts');
        const currentAttempt = allAttempts.find(a => a._id === attemptId);
        
        if (!currentAttempt) throw new Error('Attempt not found');
        if (currentAttempt.status === 'completed') {
          navigate('/'); 
          return;
        }

        setAttempt(currentAttempt);
        
        const { data: quizData } = await axios.get('/api/quizzes');
        const currentQuiz = quizData.quizzes.find(q => q._id === currentAttempt.quiz._id);
        setQuiz(currentQuiz);

        const { data: qData } = await axios.get(`/api/quizzes/${currentQuiz._id}/questions`);
        setQuestions(qData);
        
        const startTime = new Date(currentAttempt.createdAt).getTime();
        const endTime = startTime + (currentQuiz.duration * 60 * 1000);
        const remaining = Math.floor((endTime - Date.now()) / 1000);
        
        setTimeLeft(remaining > 0 ? remaining : 0);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz attempt.');
        setLoading(false);
      }
    };
    
    fetchAttemptData();
  }, [attemptId, navigate]);

  useEffect(() => {
    if (!isStarted || loading || !quiz) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/quizzes/${quiz._id}`);
        
        if (data.status === 'COMPLETED' || data.status === 'ARCHIVED') {
          alert('ADMIN COMMAND: EXAM HAS BEEN FORCEFULLY TERMINATED.');
          handleSubmit(true);
        }

        if (data.broadcastMessage && data.broadcastMessage !== quizRef.current?.broadcastMessage) {
          alert(`ADMIN BROADCAST MESSAGE:\n${data.broadcastMessage}`);
        }

        if (data.duration > (quizRef.current?.duration || quiz.duration)) {
          const addedMins = data.duration - (quizRef.current?.duration || quiz.duration);
          setTimeLeft(prev => prev + (addedMins * 60));
          alert(`ADMIN NOTIFICATION: Your exam time has been extended by ${addedMins} minutes.`);
        }

        quizRef.current = data;
        setQuiz(data);
      } catch (e) {
        console.warn('Polling check failed', e);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [isStarted, loading, quiz?._id]);

  useEffect(() => {
    if (!isStarted || loading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleViolation = () => {
      if (handlingViolationRef.current) return;
      handlingViolationRef.current = true;

      setWarnings(prev => {
        const newWarnings = prev + 1;
        
        if (newWarnings === 1) {
          setTimeout(() => {
             alert("WARNING (1/3): You must not switch tabs, minimize the window, or open other apps. The next violation will be your final warning.");
             handlingViolationRef.current = false;
          }, 100);
        } else if (newWarnings === 2) {
          setTimeout(() => {
             alert("WARNING (2/3): This is your final warning! Do not leave the test environment. One more violation will automatically submit your quiz.");
             handlingViolationRef.current = false;
          }, 100);
        } else {
          setTimeout(() => {
             alert("VIOLATION (3/3): You have repeatedly left the test environment. Your test is now automatically submitted.");
             handleSubmit(true);
          }, 100);
        }
        return newWarnings;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };

    const handleBlur = () => {
      handleViolation();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation();
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyPaste = (e) => e.preventDefault();
    
    const handleKeyDown = (e) => {
      if (
        e.key === 'F5' || 
        (e.ctrlKey && e.key.toLowerCase() === 'r') || 
        (e.metaKey && e.key.toLowerCase() === 'r') || 
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.ctrlKey && e.key.toLowerCase() === 'c') ||
        (e.ctrlKey && e.key.toLowerCase() === 'v') ||
        (e.metaKey && e.key.toLowerCase() === 'c') ||
        (e.metaKey && e.key.toLowerCase() === 'v')
      ) {
        e.preventDefault();
      }
    };
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line
  }, [isStarted, loading, timeLeft]); 

  const handleOptionSelect = (questionId, optionId) => {
    const updated = { ...responses, [questionId]: optionId };
    setResponses(updated);
    responsesRef.current = updated;
  };

  const toggleReviewMark = (questionId) => {
    setReviewMarks(prev => ({
       ...prev,
       [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm('Are you absolutely sure you want to submit your quiz payload for grading?')) return;
    
    try {
      const currentResponses = responsesRef.current;
      const formattedResponses = Object.keys(currentResponses).map(qId => ({
        questionId: qId,
        selectedOption: currentResponses[qId]
      }));

      const { data } = await axios.post(`/api/attempts/${attemptId}/submit`, { responses: formattedResponses });
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }

      navigate(`/attempt/${attemptId}/result`, { state: { result: data, quiz } });
    } catch (err) {
      alert('Network Error submitting quiz validation payload.');
    }
  };

  const startTest = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsStarted(true);
    } catch (err) {
      alert("Please allow fullscreen to start the test safely. Your browser might require you to interact directly to enable it.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="p-8 text-center animate-pulse text-indigo-600 font-bold">Synchronizing Encrypted Test Environment...</div></div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold bg-slate-50 min-h-screen">{error}</div>;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none -z-10"></div>
        
        <div className="max-w-3xl mx-auto p-12 bg-white/70 backdrop-blur-xl shadow-2xl rounded-[32px] text-center border border-white/50 relative">
          <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight leading-tight">{quiz?.title}</h2>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-8 rounded-2xl mb-10 text-left space-y-5 shadow-sm shadow-amber-500/5">
             <h3 className="font-bold flex items-center text-xl tracking-tight"><AlertCircle className="mr-3 text-amber-600"/> Security & Proctoring Environment</h3>
             <ul className="list-disc pl-6 space-y-3 text-amber-900/80 font-medium">
               <li>You <b>must</b> complete the test entirely in Fullscreen mode.</li>
               <li>Do <b>not</b> switch tabs, minimize the browser, or open other background applications.</li>
               <li>System interactions, right-clicking, and keyboard shortcuts are intentionally disabled.</li>
               <li>Violating these conditions triggers an immediate warning. After 3 recorded warnings, your test is automatically isolated and submitted.</li>
             </ul>
          </div>
          
          <button 
            onClick={startTest}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 group flex items-center justify-center space-x-3 mx-auto text-xl w-full sm:w-auto"
          >
            <Maximize size={24} className="group-hover:scale-110 transition-transform" />
            <span>Enter Secure Fullscreen</span>
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const currentQ = questions[currentQuestionIndex];
  const progressCount = Object.keys(responses).length;
  const progressPercent = (progressCount / questions.length) * 100;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <>
    {quiz?.isPaused && (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white px-4 text-center">
        <AlertCircle size={64} className="text-amber-500 mb-6 animate-pulse"/>
        <h1 className="text-4xl font-black mb-4 tracking-tight text-white">EXAM TEMPORARILY PAUSED</h1>
        <p className="text-lg max-w-2xl text-slate-300">An administrator has paused the testing environment. Your timer will automatically adjust if necessary. Do not close this window or exit fullscreen.</p>
      </div>
    )}
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="fixed top-0 right-0 w-1/3 h-1/2 bg-[#4F46E5]/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-white/50 z-50 flex items-center justify-between px-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
         <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight mr-4">{quiz.title}</h1>
            {warnings > 0 && <span className="font-bold text-red-600 animate-pulse flex items-center text-xs bg-red-100/50 px-2.5 py-1 rounded-md border border-red-200"><AlertCircle size={14} className="mr-1.5"/> Warning {warnings}/3</span>}
         </div>

         <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end mr-4">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Test Time Remaining</span>
               <div className={`font-mono font-black text-xl flex items-center transition-colors ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                 <Timer size={20} className="mr-1.5" /> {formatTime(timeLeft)}
               </div>
            </div>
            <button 
               onClick={() => handleSubmit(false)}
               className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm flex items-center"
            >
               <CheckCircle size={16} className="mr-2"/> Submit Exam
            </button>
         </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8 z-10 relative">
         
         {/* Main Question Area */}
         <div className="flex-1 flex flex-col">
            
            {currentQ && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 lg:p-10 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                 {/* Internal Question Header */}
                 <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center font-mono">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg mr-3 shadow-inner">Q{currentQuestionIndex + 1}</span> 
                    </h2>
                    
                    <button 
                       onClick={() => toggleReviewMark(currentQ._id)}
                       className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${reviewMarks[currentQ._id] ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                    >
                       <Flag size={16} className={reviewMarks[currentQ._id] ? 'fill-amber-500 outline-none stroke-amber-500' : ''}/>
                       <span>{reviewMarks[currentQ._id] ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>
                 </div>

                 <p className="text-xl font-semibold text-slate-800 mb-10 leading-relaxed max-w-4xl">{currentQ.text}</p>

                 <div className="space-y-4 max-w-4xl">
                   {currentQ.options.map((opt, idx) => {
                     const isSelected = responses[currentQ._id] === opt.id;
                     return (
                       <label 
                         key={opt.id} 
                         className={`group flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${isSelected ? 'border-indigo-500 bg-indigo-50/70 shadow-md transform scale-[1.01]' : 'border-slate-200/60 hover:border-indigo-300 hover:bg-slate-50/80 hover:shadow-sm'}`}
                       >
                         <input 
                           type="radio" name={`question-${currentQ._id}`} value={opt.id}
                           checked={isSelected}
                           onChange={() => handleOptionSelect(currentQ._id, opt.id)}
                           className="hidden"
                         />
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-5 transition-all duration-300 ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'bg-slate-100 border border-slate-200 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:border-indigo-200'}`}>
                           {letters[idx]}
                         </div>
                         <span className={`text-lg transition-colors font-medium flex-1 ${isSelected ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{opt.text}</span>
                         
                         {isSelected && <CheckCircle className="text-indigo-500 ml-4 animate-in fade-in zoom-in" size={24}/>}
                       </label>
                     );
                   })}
                 </div>

                 {/* Question Footer Controls */}
                 <div className="mt-auto pt-10 flex justify-between items-center">
                    <button 
                       onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                       disabled={currentQuestionIndex === 0}
                       className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all text-sm ${currentQuestionIndex === 0 ? 'opacity-0 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-sm'}`}
                    >
                       <ChevronLeft size={16} className="mr-1"/> Previous
                    </button>
                    
                    <button 
                       onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                       disabled={currentQuestionIndex === questions.length - 1}
                       className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all text-sm ${currentQuestionIndex === questions.length - 1 ? 'opacity-0 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5'}`}
                    >
                       Next <ChevronRight size={16} className="ml-1"/>
                    </button>
                 </div>
              </div>
            )}
         </div>

         {/* Sidebar Navigation Palette */}
         <div className="w-80 shrink-0 flex flex-col space-y-6">
            
            {/* Legend / Status Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-5 border-b border-slate-100 pb-3">Test Metrics</h3>
               
               <div className="flex items-center justify-between mb-4 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-600 uppercase">Completion Rate</span>
                  <span className="text-sm font-black text-indigo-600">{progressCount} / {questions.length}</span>
               </div>
               
               <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                     <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/20 mr-3"></div> Answered</div>
                     <span className="text-slate-400">{progressCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                     <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-amber-400 shadow-sm shadow-amber-400/20 mr-3"></div> Marked for Review</div>
                     <span className="text-slate-400">{Object.values(reviewMarks).filter(Boolean).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                     <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-white border border-slate-200 shadow-sm mr-3"></div> Not Answered</div>
                     <span className="text-slate-400">{questions.length - progressCount}</span>
                  </div>
               </div>
            </div>

            {/* Question Palette Matrix */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex-1 flex flex-col max-h-[60vh]">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-5 border-b border-slate-100 pb-3">Question Palette</h3>
               
               <div className="grid grid-cols-5 gap-3 overflow-y-auto custom-scrollbar p-1 pb-4">
                 {questions.map((q, i) => {
                   const isAnswered = responses[q._id] !== undefined;
                   const isMarked = reviewMarks[q._id];
                   const isActive = currentQuestionIndex === i;
                   
                   let stateClasses = "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"; // Unanswered
                   if (isMarked) stateClasses = "bg-amber-400 border-amber-500 text-amber-900"; // Marked (highest visual priority usually)
                   else if (isAnswered) stateClasses = "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20"; // Answered

                   return (
                     <button
                       key={q._id}
                       onClick={() => setCurrentQuestionIndex(i)}
                       className={`w-full aspect-square rounded-xl font-bold text-sm flex items-center justify-center transition-all border ${stateClasses} ${isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110 !font-black shadow-lg z-10' : 'shadow-sm hover:scale-105'}`}
                     >
                       {i + 1}
                     </button>
                   );
                 })}
               </div>
               
               <div className="mt-auto pt-4 border-t border-slate-100 flex items-start text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <Info size={14} className="mr-2 shrink-0 -mt-0.5" />
                  <p>Click any block to navigate directly. Answers are saved locally implicitly.</p>
               </div>
            </div>

         </div>

      </div>
    </div>
    </>
  );
};

export default CandidateAttempt;
