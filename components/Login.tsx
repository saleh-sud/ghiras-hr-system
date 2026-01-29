
import React, { useState } from 'react';
import { Lock, User as UserIcon, ShieldAlert, KeyRound } from 'lucide-react';

interface Props {
  onLogin: (username: string, pass: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-500 border border-white/10">
        <div className="bg-indigo-900 p-12 text-center text-white relative">
          <div className="bg-indigo-500 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40 animate-bounce-slow">
            <KeyRound size={40} />
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">غراس النهضة</h2>
          <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.2em] opacity-80">نظام إدارة الموارد البشرية</p>
          <div className="absolute -top-10 -right-10 p-12 opacity-5">
             <ShieldAlert size={180} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-7">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">هوية الدخول</label>
            <div className="relative">
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ادخل اسم المستخدم..."
                className="w-full pr-14 pl-4 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold placeholder:text-slate-300"
              />
              <UserIcon className="absolute right-5 top-5 text-indigo-300" size={24} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">كلمة المرور</label>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-14 pl-4 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold placeholder:text-slate-300"
              />
              <Lock className="absolute right-5 top-5 text-indigo-300" size={24} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all active:scale-[0.98] text-lg mt-4"
          >
            دخول النظام
          </button>
          
          <div className="pt-6 text-center">
             <p className="text-slate-400 text-[10px] font-bold leading-relaxed">
                يسمح فقط للمسؤولين المصرح لهم بالدخول.<br/>
                جميع الأنشطة مراقبة ومسجلة.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
