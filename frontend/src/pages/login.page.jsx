import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { THEME } from '../theme';

const LoginPage = ({ onLogin }) => {
  const [phone, setPhone] = useState('111');
  const [pass, setPass] = useState('');

  return (
    <div className={`min-h-screen bg-white flex flex-col p-6`}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-[#BFAEE3] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200">
            <Wallet className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900">OweMeNot</h1>
        <p className={`${THEME.textMuted} mb-8`}>Manage debts without ruining friendships.</p>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs text-slate-400 font-bold uppercase">Phone Number</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-lg font-semibold outline-none mt-1" 
            />
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••"
              className="w-full bg-transparent text-lg font-semibold outline-none mt-1" 
            />
          </div>
        </div>

        <button 
          onClick={() => onLogin(phone, pass)} 
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg mt-8 shadow-xl shadow-slate-200 hover:scale-[1.02] transition-transform"
        >
          Sign In
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">Demo: Use Phone '111'</p>
      </div>
    </div>
  );
};

export default LoginPage;