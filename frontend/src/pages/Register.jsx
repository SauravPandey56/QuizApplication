import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import InteractiveBackground from '../components/layout/InteractiveBackground';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import { Mail, Lock, User, Phone, MapPin, Camera, ArrowRight, UserCircle, Briefcase, GraduationCap } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'candidate',
    course: '', universityCampus: '', branch: '', semester: 1, section: '',
    contact: '', address: '', profilePhoto: null
  });
  
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesAndSettings = async () => {
      try {
        const [coursesRes, settingsRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/settings')
        ]);
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0) {
          setFormData(prev => ({ ...prev, course: coursesRes.data[0]._id }));
        }
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('Data fetch failed');
      }
    };
    fetchCoursesAndSettings();
  }, []);

  const campuses = settings.filter(s => s.type === 'campus').map(s => s.value);
  const branches = settings.filter(s => s.type === 'branch').map(s => s.value);
  const sections = settings.filter(s => s.type === 'section').map(s => s.value);
  
  const defaultCampuses = ['GEU DEHRADUN', 'GEHU DEHRADUN', 'GEHU haldwani', 'GEHU bihmtal'];
  const defaultBranches = ['CSE', 'mechanical', 'civil', 'electrical', 'ECE', 'chemical'];
  const defaultSections = ['A', 'B', 'C', 'D'];
  const getOptions = (arr, defaultArr) => arr.length > 0 ? arr : defaultArr;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      let strength = 0;
      if (value.length > 5) strength += 25;
      if (value.match(/[a-z]+/)) strength += 25;
      if (value.match(/[A-Z]+/)) strength += 25;
      if (value.match(/[@$!%*#?&]+/)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const validateStep1 = () => {
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      setError('System requires all basic vectors attached.'); return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      if (formData.role === 'examiner') setStep(3); // Skip academic setup
      else setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.role !== 'candidate') delete payload.course;
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration sequence critically failed.');
    }
  };

  return (
    <InteractiveBackground>
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 w-full animate-fade-in relative z-20">
        
        {/* Registration Glass Card */}
        <div className="w-full max-w-[500px]">
           <div className="bg-[#111113]/80 backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
             
             {/* Progress Engine */}
             <div className="flex items-center justify-between mb-10 px-2 relative z-10">
               {[1, 2, 3].map((s) => (
                 <div key={s} className="flex items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 z-10 
                     ${step >= s ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-[#1A1A1E] border-white/10 text-slate-500'} 
                     border-2`}>
                     {s === 1 ? <UserCircle size={14} /> : s === 2 ? <GraduationCap size={14} /> : <Briefcase size={14} />}
                   </div>
                   {s !== 3 && (
                     <div className="w-[100px] sm:w-[130px] h-1 bg-[#1A1A1E] rounded-full mx-2 overflow-hidden relative">
                        <div className={`absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-1000 ${step > s ? 'w-full' : 'w-0'}`}></div>
                     </div>
                   )}
                 </div>
               ))}
             </div>

             <div className="mb-8 text-center relative z-10">
               <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                 {step === 1 ? "Initialize Identity" : step === 2 ? "Academic Matrix" : "Finalize Profile"}
               </h2>
               <p className="text-slate-400 text-sm font-medium">Join the intelligent evaluation platform.</p>
             </div>

             {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center justify-center animate-pulse">{error}</div>}

             <form onSubmit={handleSubmit} className="relative z-10">
               
               {/* STEP 1: BASIC INFO */}
               {step === 1 && (
                 <div className="space-y-5 animate-slide-right">
                    
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <label className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 transform hover:-translate-y-1 ${formData.role === 'candidate' ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-[#1A1A1E] border-white/5 hover:border-white/20'}`}>
                         <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} className="hidden" />
                         <GraduationCap size={24} className={`mb-3 ${formData.role === 'candidate' ? 'text-indigo-400' : 'text-slate-500'}`} />
                         <p className={`font-bold text-sm ${formData.role === 'candidate' ? 'text-white' : 'text-slate-400'}`}>Candidate</p>
                         <p className="text-[10px] text-slate-500 mt-1 leading-tight">Execute modules & track rank.</p>
                       </label>
                       <label className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 transform hover:-translate-y-1 ${formData.role === 'examiner' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-[#1A1A1E] border-white/5 hover:border-white/20'}`}>
                         <input type="radio" name="role" value="examiner" checked={formData.role === 'examiner'} onChange={handleChange} className="hidden" />
                         <UserCircle size={24} className={`mb-3 ${formData.role === 'examiner' ? 'text-cyan-400' : 'text-slate-500'}`} />
                         <p className={`font-bold text-sm ${formData.role === 'examiner' ? 'text-white' : 'text-slate-400'}`}>Examiner</p>
                         <p className="text-[10px] text-slate-500 mt-1 leading-tight">Manage testing parameters.</p>
                       </label>
                    </div>

                    <InputField icon={<User size={18}/>} type="text" name="name" label="Full Legal Name" value={formData.name} onChange={handleChange} focused={focusedField} setFocused={setFocusedField} />
                    <InputField icon={<Mail size={18}/>} type="email" name="email" label="Institutional Email" value={formData.email} onChange={handleChange} focused={focusedField} setFocused={setFocusedField} />
                    
                    <div className="relative">
                      <InputField icon={<Lock size={18}/>} type="password" name="password" label="Cryptographic Signature" value={formData.password} onChange={handleChange} focused={focusedField} setFocused={setFocusedField} />
                      <div className="flex h-1 mt-2 space-x-1 w-full rounded-full overflow-hidden bg-[#1A1A1E]">
                        <div className={`h-full transition-all duration-500 ${passwordStrength > 0 ? (passwordStrength > 50 ? 'bg-cyan-500' : 'bg-red-500') : 'bg-transparent'} w-1/4`}></div>
                        <div className={`h-full transition-all duration-500 ${passwordStrength > 25 ? (passwordStrength > 50 ? 'bg-cyan-500' : 'bg-amber-500') : 'bg-transparent'} w-1/4`}></div>
                        <div className={`h-full transition-all duration-500 ${passwordStrength > 50 ? (passwordStrength > 75 ? 'bg-indigo-500' : 'bg-cyan-500') : 'bg-transparent'} w-1/4`}></div>
                        <div className={`h-full transition-all duration-500 ${passwordStrength > 75 ? 'bg-indigo-500' : 'bg-transparent'} w-1/4`}></div>
                      </div>
                    </div>

                    <button type="button" onClick={handleNextStep} className="w-full mt-8 bg-white text-black font-extrabold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group overflow-hidden">
                       <span className="relative z-10 flex items-center">Engage Pipeline <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
                    </button>
                 </div>
               )}

               {/* STEP 2: ACADEMIC INFO */}
               {step === 2 && (
                 <div className="space-y-4 animate-slide-left">
                    <SelectField label="Enrolled Course" name="course" value={formData.course} onChange={handleChange} options={courses.map(c => ({val: c._id, tag: c.name}))} />
                    <SelectField label="Campus" name="universityCampus" value={formData.universityCampus} onChange={handleChange} options={getOptions(campuses, defaultCampuses).map(c => ({val: c, tag: c}))} />
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField label="Branch" name="branch" value={formData.branch} onChange={handleChange} options={getOptions(branches, defaultBranches).map(b => ({val: b, tag: b}))} />
                      <SelectField label="Semester" name="semester" value={formData.semester} onChange={handleChange} options={[1,2,3,4,5,6,7,8].map(s => ({val: s, tag: `Sem ${s}`}))} />
                    </div>
                    <SelectField label="Section" name="section" value={formData.section} onChange={handleChange} options={getOptions(sections, defaultSections).map(s => ({val: s, tag: `Sec ${s}`}))} />

                    <div className="flex space-x-3 pt-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 font-bold py-4 rounded-xl transition-all">Back</button>
                      <button type="button" onClick={handleNextStep} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">Confirm Matrix</button>
                    </div>
                 </div>
               )}

               {/* STEP 3: PROFILE SETUP */}
               {step === 3 && (
                 <div className="space-y-5 animate-slide-left">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-[#1A1A1E] border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer group">
                        <Camera size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Upload</span>
                      </div>
                    </div>
                    
                    <InputField icon={<Phone size={18}/>} type="text" name="contact" label="Digital Contact Pipeline" value={formData.contact} onChange={handleChange} focused={focusedField} setFocused={setFocusedField} />
                    <InputField icon={<MapPin size={18}/>} type="text" name="address" label="Geographical Vector" value={formData.address} onChange={handleChange} focused={focusedField} setFocused={setFocusedField} />
                    
                    <div className="flex space-x-3 pt-4">
                      <button type="button" onClick={() => setStep(formData.role === 'examiner' ? 1 : 2)} className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 font-bold py-4 rounded-xl transition-all">Back</button>
                      <button type="submit" className="flex-[2] bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">Finalize Build</button>
                    </div>
                 </div>
               )}

             </form>

           </div>
           <p className="mt-8 text-center text-sm font-medium text-slate-500">
             Already mapped? <span onClick={() => navigate('/login')} className="text-white hover:text-indigo-400 cursor-pointer transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5 ml-1">Authenticate here</span>
           </p>
        </div>
      </div>
    </InteractiveBackground>
  );
};

const InputField = ({ icon, type, name, label, value, onChange, focused, setFocused }) => (
  <div className="relative group/input w-full">
    <div className={`absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/40 to-cyan-500/40 ${focused === name ? 'opacity-100' : ''}`}></div>
    <div className="relative flex items-center bg-[#1A1A1E] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-indigo-500/50">
       <div className="pl-4 pr-2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
         {icon}
       </div>
       <div className="flex-1 relative pt-2">
         <input type={type} name={name} id={name} className="w-full bg-transparent text-slate-100 px-2 pt-4 pb-2 outline-none peer text-sm font-medium" value={value} onChange={onChange} onFocus={() => setFocused(name)} onBlur={() => setFocused('')} placeholder=" " />
         <label htmlFor={name} className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-400 pointer-events-none">
           {label}
         </label>
       </div>
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="relative w-full">
    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full bg-[#1A1A1E] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none shadow-inner text-sm font-medium">
      <option value="" disabled>Select Mapping...</option>
      {options.map((opt, i) => <option key={i} value={opt.val} className="bg-slate-900">{opt.tag}</option>)}
    </select>
  </div>
);

export default Register;
