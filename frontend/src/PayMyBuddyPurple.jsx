import React, { useState } from 'react';
import {
  Wallet, Send, Plus, Users, Bell, Search,
  LogOut, ShieldAlert, CheckCircle, Smartphone,
  Home, FileText, User, ArrowUpRight, ArrowDownLeft, X, Eye, EyeOff,
  Activity, CreditCard, Lock
} from 'lucide-react';

// --- STYLE CONSTANTS ---
const THEME = {
  primary: 'bg-[#BFAEE3] hover:bg-[#af9ce0] text-slate-900', // Pastel Purple
  secondary: 'bg-[#C3D69B] text-slate-900', // Lime Green
  bg: 'bg-slate-50', // Slightly off-white for better contrast
  textMain: 'text-slate-900',
  textMuted: 'text-slate-500',
  inputBg: 'bg-white',
  inputBorder: 'border-slate-200',
  roundedBtn: 'rounded-xl',
  roundedCard: 'rounded-2xl',
};

// --- MAIN COMPONENT ---
const OweMeNotApp = () => {
  const [currentView, setCurrentView] = useState('login'); 
  const [user, setUser] = useState(null); // Stores the logged-in user

  // SIMULATED LOGIN (Connects to your Backend Data)
  const handleLogin = (phone, pin) => {
    // In a real app, this fetch() would go to your Spring Boot /api/login
    // For now, we simulate ALICE logging in (Phone: 111)
    if (phone === '111') {
      setUser({
        name: 'Alice',
        phone: '111',
        balance: 10000.00, // Matches DataLoader
        uniqueId: '@Alice_Wonder',
        avatar: 'https://i.pravatar.cc/150?u=alice'
      });
      setCurrentView('home');
    } else {
      alert("Try Phone: 111 (Alice) for the demo!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.textMain} font-sans pb-24`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#BFAEE3]">
             <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className={`text-xs ${THEME.textMuted}`}>Good Morning,</p>
            <p className="font-bold text-sm">{user.name} 👋</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white shadow-sm border border-slate-100 rounded-full relative">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <main className="px-6 py-2">
        {currentView === 'home' && <HomeView user={user} navigate={setCurrentView} />}
        {currentView === 'split' && <SplitBillView navigate={setCurrentView} />}
        {currentView === 'debts' && <DebtSettlerView navigate={setCurrentView} />}
        {currentView === 'profile' && <AccountView user={user} navigate={setCurrentView} onLogout={handleLogout} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <NavButton icon={<Home />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
        <NavButton icon={<Users />} label="Split" active={currentView === 'split'} onClick={() => setCurrentView('split')} />
        <NavButton icon={<Activity />} label="Debts" active={currentView === 'debts'} onClick={() => setCurrentView('debts')} />
        <NavButton icon={<User />} label="Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#8A70BE]' : 'text-slate-400 hover:text-slate-600'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- 1. LOGIN SCREEN (UPDATED WITH LOGO) ---
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('111'); // Pre-filled for demo
  const [pass, setPass] = useState('');

  return (
    <div className={`min-h-screen bg-white flex flex-col p-6`}>
      <div className="flex-1 flex flex-col justify-center">
        
        {/* --- LOGO UPDATE HERE --- */}
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-purple-100 bg-white p-1">
                {/* Ensure logo.png is in your /public folder */}
                <img 
                    src="/logo.png" 
                    alt="OweMeNot Logo" 
                    className="w-full h-full object-cover rounded-full" 
                />
            </div>
        </div>
        {/* ------------------------ */}

        <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900 text-center">OweMeNot</h1>
        <p className={`${THEME.textMuted} mb-8 text-center`}>Manage debts without ruining friendships.</p>

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

// --- 2. HOME VIEW (Matches DataLoader) ---
const HomeView = ({ user, navigate }) => {
  const recentTransactions = [
    { id: 1, title: 'Trip to Goa', user: 'Bob', amount: '+ 500.00', date: 'Yesterday', type: 'credit' },
    { id: 2, title: 'Dinner at Taj', user: 'Charlie', amount: '- 200.00', date: 'Yesterday', type: 'debit' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Balance Card */}
      <div className={`${THEME.primary} rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-purple-200`}>
        <div className="relative z-10 flex flex-col h-32 justify-between">
          <div>
            <p className="text-slate-800/70 text-sm font-medium">Total Balance</p>
            <h2 className="text-4xl font-bold text-slate-900 mt-1">₹{user.balance.toLocaleString()}</h2>
          </div>
          <div className="flex justify-between items-end opacity-80">
            <p className="font-mono text-sm tracking-wider">**** 8829</p>
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
        {/* Decor */}
        <div className="absolute -right-4 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute -left-4 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
      </div>

      {/* Analytics / Insight */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <ArrowDownLeft className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-slate-400">Income</p>
            <p className="font-bold text-lg">₹500</p>
        </div>
        <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <ArrowUpRight className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xs text-slate-400">Spent</p>
            <p className="font-bold text-lg">₹200</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          <ActionButton icon={<Wallet />} label="Top Up" color="bg-blue-50 text-blue-600" />
          <ActionButton icon={<Send />} label="Send" color="bg-purple-50 text-purple-600" onClick={() => navigate('split')} />
          <ActionButton icon={<FileText />} label="Bills" color="bg-orange-50 text-orange-600" />
          <ActionButton icon={<Smartphone />} label="Airtime" color="bg-green-50 text-green-600" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
          <span className="text-xs font-bold text-[#8A70BE] cursor-pointer">See All</span>
        </div>
        <div className="space-y-4">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.user} • {tx.date}</p>
                </div>
              </div>
              <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 ${color}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-xs font-medium text-slate-600">{label}</span>
  </button>
);

// --- 3. DEBT SETTLER (Matches DataLoader Logic) ---
const DebtSettlerView = ({ navigate }) => {
  const debts = [
    { id: 1, friend: 'Bob', amount: 100.00, reason: 'Team Lunch Split', date: '2025-11-01', status: 'overdue' },
    { id: 2, friend: 'Charlie', amount: 100.00, reason: 'Team Lunch Split', date: '2025-12-09', status: 'pending' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-bold text-slate-900">Debt Manager</h2>
         <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
      </div>

      <div className="bg-[#C3D69B] p-6 rounded-3xl relative overflow-hidden">
        <h3 className="text-slate-900 font-bold text-lg relative z-10">You are owed</h3>
        <h1 className="text-4xl font-bold text-slate-900 mt-2 relative z-10">₹200.00</h1>
        <p className="text-slate-800 text-sm mt-1 relative z-10 opacity-80">From 2 friends</p>
        <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-900 opacity-10" />
      </div>

      <div className="space-y-4">
        {debts.map(debt => (
          <div key={debt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                    {debt.friend.charAt(0)}
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900">{debt.friend}</h4>
                    <p className="text-xs text-slate-400">{debt.reason}</p>
                 </div>
              </div>
              <p className="font-bold text-lg">₹{debt.amount}</p>
            </div>

            {/* THE LOGIC YOU ASKED FOR */}
            {debt.status === 'overdue' ? (
                <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-100">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500">Overdue (&gt;10 days) • Email Sent</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-100">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-600">Pending • Due soon</span>
                </div>
            )}
            
            <button className="w-full mt-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm">Remind {debt.friend}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. SPLIT BILL VIEW (Simplistic) ---
const SplitBillView = ({ navigate }) => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900">Split Bill</h2>
            <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <p className="text-slate-400 text-sm font-bold uppercase mb-2">Total Amount</p>
             <div className="flex justify-center items-center gap-1 text-slate-900">
                <span className="text-3xl font-bold">₹</span>
                <input type="number" placeholder="0" className="text-5xl font-bold w-32 text-center outline-none placeholder:text-slate-200" />
             </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <p className="text-slate-400 text-sm font-bold uppercase mb-4">Split With</p>
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {['Bob', 'Charlie'].map(name => (
                    <div key={name} className="flex flex-col items-center gap-2 min-w-[60px]">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border-2 border-transparent hover:border-[#8A70BE] cursor-pointer transition-all">
                            {name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium">{name}</span>
                    </div>
                ))}
                 <div className="flex flex-col items-center gap-2 min-w-[60px]">
                    <div className="w-14 h-14 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-slate-400">
                        <Plus />
                    </div>
                    <span className="text-xs font-medium">Add</span>
                </div>
             </div>
        </div>
        
        <button className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg shadow-lg shadow-purple-200`}>
            Split Now
        </button>
    </div>
);

// --- 5. ACCOUNT VIEW (Profile Management) ---
const AccountView = ({ user, navigate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alice',
    phone: user?.phone || '111',
    email: 'alice@example.com', 
    bio: 'Love spending time with friends! 💸',
  });

  const handleSave = () => {
    // In real app: POST to backend
    setIsEditing(false);
    alert("Profile Updated! (Simulated)");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
         <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center">
        <div className="relative group cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#BFAEE3] shadow-lg">
             <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold">Change</span>
          </div>
          <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full border-2 border-white shadow-sm">
            <User className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-xl font-bold mt-3 text-slate-900">{formData.name}</h3>
        <p className="text-slate-400 text-sm">{user?.uniqueId}</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-slate-800">Personal Details</h4>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`text-xs font-bold px-3 py-1 rounded-full ${isEditing ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
            >
                {isEditing ? 'Save Changes' : 'Edit'}
            </button>
        </div>

        <div>
            <label className="text-xs text-slate-400 font-bold uppercase">Full Name</label>
            <input 
                type="text" 
                value={formData.name} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full mt-1 p-2 rounded-lg outline-none transition-all ${isEditing ? 'bg-slate-50 border border-[#BFAEE3]' : 'bg-transparent'}`}
            />
        </div>

        <div>
            <label className="text-xs text-slate-400 font-bold uppercase">Phone Number</label>
            <input 
                type="text" 
                value={formData.phone} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={`w-full mt-1 p-2 rounded-lg outline-none transition-all ${isEditing ? 'bg-slate-50 border border-[#BFAEE3]' : 'bg-transparent'}`}
            />
        </div>

        <div>
            <label className="text-xs text-slate-400 font-bold uppercase">Email</label>
            <input 
                type="text" 
                value={formData.email} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full mt-1 p-2 rounded-lg outline-none transition-all ${isEditing ? 'bg-slate-50 border border-[#BFAEE3]' : 'bg-transparent'}`}
            />
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-2">
        <h4 className="font-bold text-slate-800 ml-2">Security & App</h4>
        <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <EyeOff className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Change PIN</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-300" />
        </button>
        
        <button onClick={onLogout} className="w-full bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between group active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium text-red-600">Log Out</span>
            </div>
        </button>
      </div>
    </div>
  );
};

export default OweMeNotApp;