import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useContext(AuthContext) || {};
  
  const [feedback, setFeedback] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    message: '' 
  });
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedbacks', feedback);
      setFeedbackStatus('Sent reliably! Thanks!');
      setFeedback({ name: user?.name || '', email: user?.email || '', message: '' });
      setTimeout(() => setFeedbackStatus(''), 4000);
    } catch {
      setFeedbackStatus('Error submitting feedback.');
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
        
        <div className="md:w-1/3">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">Connect With Me</h3>
          <p className="text-slate-400 text-sm mb-4">Let's collaborate or share some thoughts on this project. Feel free to connect across any of these platforms:</p>
          <div className="flex flex-col space-y-2">
            <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center text-sm">
              <span className="w-8">In.</span> www.linkedin.com/in/sauravpandey56
            </a>
            <a href="https://github.com/SauravPandey56" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center text-sm">
              <span className="w-8">Git.</span> github.com/SauravPandey56
            </a>
            <a href="mailto:pandeysaurav108@gmail.com" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center text-sm">
              <span className="w-8">Mail.</span> pandeysaurav108@gmail.com
            </a>
          </div>
        </div>

        <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
          <h3 className="text-lg font-bold text-slate-200 mb-4">Send System Feedback</h3>
          <form onSubmit={submitFeedback} className="space-y-3">
            {!user && (
              <>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={feedback.name} 
                  onChange={e => setFeedback({...feedback, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border-slate-700 border text-slate-300 rounded text-sm outline-none focus:border-indigo-500 transition-colors" 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Your Email"
                  value={feedback.email} 
                  onChange={e => setFeedback({...feedback, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border-slate-700 border text-slate-300 rounded text-sm outline-none focus:border-indigo-500 transition-colors" 
                  required 
                />
              </>
            )}
            {user && (
              <input 
                type="text" 
                readOnly 
                value={feedback.name} 
                className="w-full px-3 py-2 bg-slate-800 border-slate-700 border text-slate-300 rounded text-sm outline-none opacity-70 cursor-not-allowed" 
                required 
              />
            )}
            <textarea 
              value={feedback.message} 
              onChange={e => setFeedback({...feedback, message: e.target.value})} 
              className="w-full px-3 py-2 bg-slate-800 border-slate-700 border text-slate-300 rounded text-sm outline-none focus:border-indigo-500 transition-colors" 
              rows="3" 
              placeholder="What are your thoughts?" 
              required
            ></textarea>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded text-sm transition-colors">Submit Form</button>
            {feedbackStatus && <p className="text-xs text-indigo-400">{feedbackStatus}</p>}
          </form>
        </div>

        <div className="md:w-1/3 flex flex-col justify-end text-sm text-slate-500 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
           <p className="mb-2">&copy; {new Date().getFullYear()} QuizSphere Platform</p>
           <p>Developed with passion.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
