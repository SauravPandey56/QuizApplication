import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Save, UploadCloud, User as UserIcon } from 'lucide-react';

const ProfileEditor = () => {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    password: '',
    profileImage: user?.profileImage || '',
    contactNumber: user?.contactNumber || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    address: user?.address || '',
    fatherName: user?.fatherName || ''
  });
  const [message, setMessage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage({ type: 'error', text: 'Image file size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if(!payload.password) delete payload.password;
      
      const res = await axios.put('/api/users/profile', payload);
      // Update local storage token if user data implies token generation occurred, but our PUT route only sends user details.
      // We will reload to populate AuthContext naturally.
      setMessage({ type: 'success', text: 'Profile & Credentials updated successfully!' });
      setTimeout(() => window.location.reload(), 1000);
    } catch(err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    }
  };

  return (
    <div className="glass-panel p-6 max-w-4xl mx-auto shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-3">Complete Your Profile</h2>
      {message && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type==='success' ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
         {/* Profile Photo Strategy */}
         <div className="flex flex-col items-center space-y-4 md:border-r md:border-slate-100 pr-4">
           <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-indigo-50 shadow-md flex items-center justify-center relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {formData.profileImage ? (
                 <img src={formData.profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                 <UserIcon size={48} className="text-slate-300" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 hidden group-hover:flex items-center justify-center transition-all">
                 <UploadCloud className="text-white relative z-10" />
              </div>
           </div>
           <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
           <div className="text-center">
             <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Upload New Photo</button>
             <p className="text-xs text-slate-400 mt-1">JPEG, PNG under 2MB</p>
           </div>
           
           <div className="w-full pt-6 mt-6 border-t border-slate-100 opacity-60 pointer-events-none">
             <label className="block text-sm font-medium text-slate-700 mb-1">Account Core ID</label>
             <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2 border bg-slate-50 text-slate-500 rounded-lg" />
           </div>
         </div>

         {/* Core Properties */}
         <div className="md:col-span-2 space-y-5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
               <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
               <input type="tel" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Father's Name</label>
               <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
               <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700" />
             </div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
             <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"></textarea>
           </div>
           
           <div className="pt-4 border-t border-slate-100">
             <label className="block text-sm font-medium text-slate-700 mb-1">Reset Password <span className="text-xs text-slate-400 font-normal">(Leave blank to keep active)</span></label>
             <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all placeholder:text-rose-200" placeholder="••••••••" />
           </div>

           <div className="pt-4 flex justify-end">
             <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 font-bold">
               <Save size={18} className="mr-2"/> Commit Parameters
             </button>
           </div>
         </div>
         
      </form>
    </div>
  );
};
export default ProfileEditor;
