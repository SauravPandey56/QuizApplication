import React, { useState } from 'react';
import axios from 'axios';
import { Mail, CheckCircle2, Send } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const contactMethods = [
    {
      name: 'Email',
      value: 'pandeysaurav108@gmail.com',
      link: 'mailto:pandeysaurav108@gmail.com',
      icon: <Mail size={22} className="text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      name: 'GitHub',
      value: 'SauravPandey56',
      link: 'https://github.com/SauravPandey56',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-purple-600">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.8c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      name: 'LinkedIn',
      value: 'sauravpandey56',
      link: 'https://www.linkedin.com/in/sauravpandey56',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-blue-600">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100',
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use axios so it automatically inherits the http://localhost:5000 baseURL from main.jsx
      const response = await axios.post('/api/feedbacks', formData);
      
      if (response.status === 201 || response.status === 200) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      // Optional: Add toast or alert for user facing error here
      alert(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-24 bg-slate-50 overflow-hidden font-sans">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Have questions about QuizSphere? Send us a message and our team will respond shortly.
          </p>
        </div>

        {/* Dynamic Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Contact Methods */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                target={method.name !== 'Email' ? "_blank" : undefined}
                rel={method.name !== 'Email' ? "noopener noreferrer" : undefined}
                className="group p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${method.bg} border`}>
                  {method.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{method.name}</h3>
                <p className="text-sm font-medium text-slate-600 truncate w-full group-hover:text-indigo-600 transition-colors">
                  {method.value}
                </p>
              </a>
            ))}
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50/50">
                    <CheckCircle2 size={40} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-500 font-medium">We appreciate your feedback and will get back to you soon.</p>
                  <button 
                    onClick={() => setIsSuccess(false)} 
                    className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                      />
                    </div>
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm resize-none"
                    />
                  </div>

                  {/* Settings and Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 tracking-wide"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      ) : (
                        <Send size={18} className="mr-2" />
                      )}
                      {isSubmitting ? 'Sending Transmission...' : 'Send Message'}
                    </button>
                  </div>
                  
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
