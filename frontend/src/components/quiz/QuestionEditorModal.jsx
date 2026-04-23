import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const QuestionEditorModal = ({ quiz, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    negativeMarks: 0
  });

  useEffect(() => {
    fetchQuestions();
  }, [quiz]);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`/api/quizzes/${quiz._id}/questions`);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
    
    // Automatically update correctAnswer if it matches exactly (just basic UX)
    // To be perfectly safe, user should manually select radio.
  };

  const handleRadioChange = (opt) => {
    if(opt === '') return;
    setFormData({...formData, correctAnswer: opt});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.correctAnswer) return alert('Please select a strictly marked correct answer by clicking its radio button.');
    
    try {
      await axios.post(`/api/quizzes/${quiz._id}/questions`, formData);
      setFormData({ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, negativeMarks: 0 });
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding question');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Question Editor</h2>
            <p className="text-slate-500 text-sm">Editing questions for: <span className="font-semibold text-indigo-600">{quiz.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm transition-colors border hover:border-slate-300"><X size={20} /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-indigo-700 border-b pb-2">Add New Question</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question Text</label>
                <textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" rows="2"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Options & Correct Answer</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-2">
                    <input type="radio" name="correctAnswer" checked={formData.correctAnswer === opt && opt !== ''} onChange={() => handleRadioChange(opt)} className="w-5 h-5 text-indigo-600 cursor-pointer" />
                    <input required type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Option ${i+1}`} className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                ))}
                <p className="text-xs text-slate-400 mt-1">Select the radio button next to the correct written option.</p>
              </div>

              {quiz.markDistributionType === 'individual' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marks</label>
                    <input type="number" required value={formData.marks} onChange={e => setFormData({...formData, marks: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Negative Marks</label>
                    <input type="number" required value={formData.negativeMarks} onChange={e => setFormData({...formData, negativeMarks: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95 mt-4">
                <Plus size={18} className="mr-2"/> Inject Question
              </button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4 md:border-l md:pl-8 border-slate-100 mt-8 md:mt-0 pt-8 md:pt-0 border-t md:border-t-0">
            <h3 className="text-lg font-bold text-slate-700 border-b pb-2">Existing Questions ({questions.length})</h3>
            <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              {questions.length === 0 && <p className="text-slate-400 text-sm italic py-4">No questions added yet. The quiz requires questions to function.</p>}
              {questions.map((q, i) => (
                <div key={q._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col text-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-bold text-slate-800 mb-2">
                    <span className="text-indigo-600 mr-1">Q{i+1}.</span> {q.text}
                  </div>
                  <ul className="text-slate-600 space-y-1.5 pl-2 list-none">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 text-slate-400">•</span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                  {quiz.markDistributionType === 'individual' && (
                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-semibold text-slate-500 flex justify-between">
                      <span>Points: <span className="text-emerald-600">{q.marks}</span></span>
                      {q.negativeMarks > 0 && <span>Penalty: <span className="text-red-500">-{q.negativeMarks}</span></span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditorModal;
