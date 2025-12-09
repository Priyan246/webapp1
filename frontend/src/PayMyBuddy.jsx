import React, { useState } from 'react';
import { 
  CreditCard, Send, Plus, Users, Bell, Search, 
  LogOut, Wallet, ShieldAlert, CheckCircle, Smartphone 
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_FRIENDS = [
  { id: 1, name: 'Sarah Smith', phone: '555-0123', avatar: 'bg-emerald-500' },
  { id: 2, name: 'Mike Ross', phone: '555-0987', avatar: 'bg-blue-500' },
];

const INITIAL_DEBTS = [
  { id: 1, friend: 'Mike Ross', amount: 45.00, date: '2025-11-25', status: 'overdue' }, // >10 days old
  { id: 2, friend: 'Sarah Smith', amount: 15.50, date: '2025-12-08', status: 'pending' },
];

// --- MAIN COMPONENT ---
const PayMyBuddyApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // If not logged in, show Login Screen
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  // If logged in, show Dashboard
  return <MainDashboard onLogout={() => setIsLoggedIn(false)} />;
};

// --- 1. LOGIN SCREEN ---
const LoginScreen = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

    <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="h-12 w-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-2xl">P</div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-slate-400 text-center mb-8">Login to manage your wallet & debts</p>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">Phone / Email</label>
          <input type="text" placeholder="user@paymybuddy.com" className="w-full mt-1 p-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-colors" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
          <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-colors" />
        </div>
        <button onClick={onLogin} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 mt-4">
          Sign In
        </button>
      </div>
    </div>
  </div>
);

// --- 2. MAIN DASHBOARD ---
const MainDashboard = ({ onLogout }) => {
  const [balance, setBalance] = useState(12450.00);
  const [activeTab, setActiveTab] = useState('overview'); // overview, split, friends
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Feature: Add Money
  const handleAddMoney = (amount) => {
    setBalance(prev => prev + parseFloat(amount));
    setShowWalletModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">P</div>
          <span className="hidden md:block text-xl font-bold tracking-tight">PayMyBuddy</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {['Overview', 'Split Bill', 'Friends'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.toLowerCase().replace(' ', '') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {activeTab === 'overview' && <OverviewTab balance={balance} openWallet={() => setShowWalletModal(true)} />}
        {activeTab === 'splitbill' && <SplitBillTab />}
        {activeTab === 'friends' && <FriendsTab />}
      </main>

      {/* Wallet Modal */}
      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} onAdd={handleAddMoney} />}
    </div>
  );
};

// --- TAB: OVERVIEW (Your existing dashboard logic + Debt Alerts) ---
const OverviewTab = ({ balance, openWallet }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
    {/* Left: Card & Balance */}
    <section className="md:col-span-2 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl shadow-indigo-900/20 h-64 flex flex-col justify-between">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="flex justify-between items-start z-10">
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">Total Balance</p>
            <h1 className="text-4xl font-bold text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
          </div>
          <CreditCard className="w-8 h-8 text-white/80" />
        </div>
        <div className="z-10 flex justify-between items-end">
          <div className="flex gap-4 text-sm text-indigo-100 font-mono">
            <span>****</span><span>****</span><span>****</span><span>8892</span>
          </div>
          <p className="text-xs font-bold bg-white/20 px-2 py-1 rounded">PLATINUM</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={openWallet} className="flex items-center justify-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-200">Add Money</span>
        </button>
        <button className="flex items-center justify-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-200">Withdraw</span>
        </button>
      </div>
    </section>

    {/* Right: Active Debts (The Logic you asked for) */}
    <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          Active Debts <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{INITIAL_DEBTS.length}</span>
        </h3>
      </div>
      <div className="space-y-4">
        {INITIAL_DEBTS.map(debt => (
          <div key={debt.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-200">{debt.friend}</p>
                <p className="text-xs text-slate-500">Owes since: {debt.date}</p>
              </div>
              <span className="font-mono text-indigo-400 font-bold">${debt.amount}</span>
            </div>
            
            {/* 10-DAY ALERT LOGIC VISUALIZATION */}
            {debt.status === 'overdue' ? (
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-400 font-medium">{"Overdue (>=10 days) • Email Sent"}</span>
              </div>
            ) : (
               <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-400 font-medium">Pending Payment</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);

// --- TAB: SPLIT BILL ---
const SplitBillTab = () => (
  <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in slide-in-from-bottom-4">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <Users className="text-indigo-500" /> Split an Expense
    </h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Select Friend(s)</label>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {INITIAL_FRIENDS.map(friend => (
            <div key={friend.id} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-14 h-14 rounded-full ${friend.avatar} flex items-center justify-center text-xl font-bold border-2 border-transparent group-hover:border-white transition-all`}>
                {friend.name.charAt(0)}
              </div>
              <span className="text-xs text-slate-300">{friend.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
             <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500 group-hover:border-indigo-500 group-hover:text-indigo-500 transition-all">
                <Plus className="w-6 h-6" />
             </div>
             <span className="text-xs text-slate-500">Add New</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Total Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">$</span>
            <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-8 pr-4 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="0.00" />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
           <select className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-indigo-500 focus:outline-none transition-colors">
             <option>Dinner</option>
             <option>Rent</option>
             <option>Travel</option>
             <option>Groceries</option>
           </select>
        </div>
      </div>

      <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all mt-4">
        Split Bill Now
      </button>
    </div>
  </div>
);

// --- TAB: FRIENDS ---
const FriendsTab = () => (
  <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4">
    {/* Add Friend By Phone */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Smartphone className="text-emerald-500" /> Add Friend by Number
      </h3>
      <div className="flex gap-4">
        <input 
          type="tel" 
          placeholder="+1 (555) 000-0000" 
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-emerald-500 focus:outline-none transition-colors"
        />
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors">
          Invite
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">* User will receive an SMS invite if not on PayMyBuddy.</p>
    </div>

    {/* Friends List */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4">Your Contacts</h3>
      <div className="space-y-2">
        {INITIAL_FRIENDS.map(friend => (
          <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${friend.avatar} flex items-center justify-center font-bold text-white`}>
                {friend.name.charAt(0)}
              </div>
              <div>
                 <p className="font-medium">{friend.name}</p>
                 <p className="text-xs text-slate-500">{friend.phone}</p>
              </div>
            </div>
            <button className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all">
              Send Money
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MODAL: WALLET ---
const WalletModal = ({ onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add to Wallet</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><LogOut className="w-5 h-5 rotate-180" /></button>
        </div>
        
        <div className="mb-6">
          <label className="text-xs text-slate-400 uppercase font-semibold">Amount</label>
          <div className="flex items-center mt-2 border-b-2 border-indigo-500 pb-2">
            <span className="text-3xl font-bold text-slate-400">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold focus:outline-none ml-2" 
              placeholder="0.00" 
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[10, 50, 100].map(val => (
            <button key={val} onClick={() => setAmount(val)} className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              +${val}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onAdd(amount || 0)} 
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          Confirm Top Up
        </button>
      </div>
    </div>
  );
};

export default PayMyBuddyApp;