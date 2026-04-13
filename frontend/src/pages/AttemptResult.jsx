import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, Trophy, Clock, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const COLORS = ['#4F46E5', '#EF4444', '#F59E0B'];

const AttemptResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, quiz } = location.state || {};

  if (!result) {
    return <Navigate to="/" />;
  }

  const accuracy = result.totalCorrect + result.totalIncorrect > 0 
    ? Math.round((result.totalCorrect / (result.totalCorrect + result.totalIncorrect)) * 100) 
    : 0;

  const pieData = [
    { name: 'Correct', value: result.totalCorrect },
    { name: 'Incorrect', value: result.totalIncorrect },
  ];

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 animate-fade-in bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-indigo-600 to-[#06B6D4] text-white mb-6 shadow-2xl shadow-indigo-500/30">
            <Trophy size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Examination Completed!</h1>
          <p className="text-lg text-slate-500 font-medium">Your cryptographic execution payload has been successfully validated.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 mb-8 shadow-2xl rounded-[3rem] border border-white/50 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Graphing Metric */}
            <div className="flex flex-col items-center justify-center p-10 bg-slate-50/80 rounded-[2.5rem] border border-slate-100 shadow-inner relative">
               <h3 className="absolute top-6 left-8 font-bold text-slate-500 uppercase tracking-widest text-xs">Algorithmic Accuracy</h3>
               <div className="w-64 h-64 relative mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" cornerRadius={10}>
                         {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <RechartsTooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-5xl font-black text-slate-800 tracking-tighter">{accuracy}%</span>
                     <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-2">Precision</span>
                  </div>
               </div>
               
               <div className="mt-8 flex items-end space-x-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <Award className="text-[#06B6D4] shrink-0 mr-2" size={32}/>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Computed Score</span>
                     <div className="leading-none">
                       <span className="text-4xl font-black text-indigo-600 leading-none">{result.score}</span>
                       {quiz && <span className="text-lg text-slate-400 font-bold ml-1 leading-none">/ {quiz.totalMarks}</span>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Summary Grid */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 text-2xl mb-6">Target Metrics Breakdown</h3>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group">
                 <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Correct Computations</p>
                      <p className="text-2xl font-black text-slate-800">{result.totalCorrect}</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group">
                 <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                      <XCircle size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Incorrect Computations</p>
                      <p className="text-2xl font-black text-slate-800">{result.totalIncorrect}</p>
                    </div>
                 </div>
              </div>

              {result.totalNegativeMarks > 0 && (
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group">
                   <div className="flex items-center">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-800/70 uppercase tracking-widest mb-1">Negative Penalty Matrix</p>
                        <p className="text-2xl font-black text-amber-700">-{result.totalNegativeMarks}</p>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
           <button onClick={() => navigate('/')} className="px-8 py-4.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all hover:shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
             <ArrowRight size={20} className="rotate-180" />
             <span>Return to Dashboard Network</span>
           </button>
           {quiz?.allowRetake && (
             <button onClick={() => navigate('/')} className="px-8 py-4.5 bg-gradient-to-r from-indigo-600 to-[#06B6D4] text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1 text-lg group">
               <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
               <span>Retry Algorithmic Simulation</span>
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AttemptResult;
