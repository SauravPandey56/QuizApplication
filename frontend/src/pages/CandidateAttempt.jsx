import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, CheckCircle, AlertCircle, Maximize } from 'lucide-react';

const CandidateAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(0);

  // Proctoring States
  const [isStarted, setIsStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  
  // Refs
  const responsesRef = useRef({});
  const handlingViolationRef = useRef(false);

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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
    // eslint-disable-next-line
  }, [isStarted, loading, timeLeft]); 

  const handleOptionSelect = (questionId, optionId) => {
    const updated = { ...responses, [questionId]: optionId };
    setResponses(updated);
    responsesRef.current = updated;
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm('Are you sure you want to submit your quiz?')) return;
    
    try {
      const currentResponses = responsesRef.current;
      const formattedResponses = Object.keys(currentResponses).map(qId => ({
        questionId: qId,
        selectedOption: currentResponses[qId]
      }));

      await axios.post(`/api/attempts/${attemptId}/submit`, { responses: formattedResponses });
      if (!autoSubmit) {
          alert('Quiz submitted successfully!');
      }
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }

      navigate('/');
    } catch (err) {
      alert('Error submitting quiz.');
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

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Quiz...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 glass-panel text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">{quiz?.title}</h2>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl mb-8 text-left space-y-4">
           <h3 className="font-bold flex items-center text-xl"><AlertCircle className="mr-2"/> Strict Proctoring Rules</h3>
           <ul className="list-disc pl-5 space-y-2">
             <li>This is a rigorously proctored evaluation.</li>
             <li>You <b>must</b> complete the test in Fullscreen mode.</li>
             <li>Do <b>not</b> switch tabs, minimize the browser, or open other applications.</li>
             <li>Violating these conditions will trigger a warning. After 3 warnings, your test is automatically submitted and halted.</li>
           </ul>
        </div>
        <button 
          onClick={startTest}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2 mx-auto text-xl"
        >
          <Maximize size={24} />
          <span>Enter Fullscreen & Start Test</span>
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-4">
      <div className="glass-panel p-4 flex items-center justify-between sticky top-[76px] z-40 bg-white/80 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{quiz.title}</h1>
          <p className="text-sm text-slate-500">
             {warnings === 0 && "Answer carefully. Negative marking may apply."}
             {warnings > 0 && <span className="font-bold text-red-600 animate-pulse flex items-center"><AlertCircle size={14} className="mr-1"/> Warning {warnings}/3 Triggered</span>}
          </p>
        </div>
        <div className={`flex items-center space-x-2 font-mono text-2xl font-bold px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
          <Timer size={24} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {questions.map((q, idx) => (
          <div key={q._id} className="glass-panel p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4 items-start flex">
              <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 shrink-0">{idx + 1}</span>
              <span className="mt-1">{q.text}</span>
            </h3>
            
            <div className="space-y-3 ml-11">
              {q.options.map(opt => (
                <label 
                  key={opt.id} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${responses[q._id] === opt.id ? 'border-indigo-500 bg-indigo-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                >
                  <input 
                    type="radio" 
                    name={`question-${q._id}`} 
                    value={opt.id}
                    checked={responses[q._id] === opt.id}
                    onChange={() => handleOptionSelect(q._id, opt.id)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-slate-700">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 flex justify-center">
        <button 
          onClick={() => handleSubmit(false)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
        >
          <CheckCircle size={20} />
          <span>Submit Final Answers</span>
        </button>
      </div>
    </div>
  );
};

export default CandidateAttempt;
