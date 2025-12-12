import React, { useState, useEffect } from 'react';
import {
  Wallet, Send, Plus, Users, Bell, Search,
  LogOut, ShieldAlert, CheckCircle, Smartphone,
  Home, FileText, User, ArrowUpRight, ArrowDownLeft, X, Eye, EyeOff,
  Activity, CreditCard, Lock
} from 'lucide-react';

// --- STYLE CONSTANTS ---
const THEME = {
  primary: 'bg-[#BFAEE3] hover:bg-[#af9ce0] text-slate-900',
  secondary: 'bg-[#C3D69B] text-slate-900',
  bg: 'bg-slate-50',
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
  const [user, setUser] = useState(null); 

  // LOGIN CONNECTION
  const handleLogin = async (phone, pin) => {
    try {
      const response = await fetch(`http://localhost:8080/api/login?phone=${phone}`);
      if (!response.ok) throw new Error("User not found");
      const userData = await response.json();
      setUser(userData);
      setCurrentView('home');
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  // Helper to update balance without re-login
  const updateUserBalance = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
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
        {currentView === 'home' && <HomeView user={user} navigate={setCurrentView} onBalanceUpdate={updateUserBalance} />}
        {currentView === 'split' && <SplitBillView user={user} navigate={setCurrentView} />}
        {currentView === 'debts' && <DebtSettlerView user={user} navigate={setCurrentView} onBalanceUpdate={updateUserBalance} />}
        {currentView === 'profile' && <AccountView user={user} navigate={setCurrentView} onLogout={handleLogout} />}
      </main>

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

// --- 1. LOGIN SCREEN ---
const LoginScreen = ({ onLogin }) => {
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
// --- 2. HOME VIEW (With Send Money Feature) ---
const HomeView = ({ user, navigate, onBalanceUpdate }) => {
  // Modals State
  const [activeModal, setActiveModal] = useState(null); // 'topup' or 'send' or null
  
  // Form States
  const [amountInput, setAmountInput] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [notification, setNotification] = useState(null); 

  const recentTransactions = [
    { id: 1, title: 'Trip to Goa', user: 'Bob', amount: '+ 500.00', date: 'Yesterday', type: 'credit' },
    { id: 2, title: 'Dinner at Taj', user: 'Charlie', amount: '- 200.00', date: 'Yesterday', type: 'debit' },
  ];

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000); 
  };

  const closeModal = () => {
    setActiveModal(null);
    setAmountInput('');
    setReceiverPhone('');
  };

  // --- HANDLER: TOP UP ---
  const handleTopUpSubmit = async () => {
    if (!amountInput) return;
    try {
      const response = await fetch('http://localhost:8080/api/user/addMoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: parseFloat(amountInput) })
      });

      if (response.ok) {
        const data = await response.json();
        onBalanceUpdate(data.balance); 
        closeModal();
        showNotification(`Success! New Balance: ₹${data.balance}`);
      } else {
        const errorText = await response.text();
        showNotification("Failed: " + errorText, 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification("Network Error", 'error');
    }
  };

  // --- HANDLER: SEND MONEY (NEW) ---
  const handleSendMoney = async () => {
    if (!amountInput || !receiverPhone) {
        showNotification("Please enter phone and amount", 'error');
        return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            senderId: user.id,
            receiverPhone: receiverPhone,
            amount: parseFloat(amountInput),
            note: "Sent via App"
        })
      });

      if (response.ok) {
        const data = await response.json();
        onBalanceUpdate(data.balance);
        closeModal();
        showNotification(data.message);
      } else {
        // ✅ FIX: Read error as TEXT first, then try to parse JSON
        const rawError = await response.text(); 
        console.error("Backend Error:", rawError); // Look at Console (F12)
        
        try {
            const jsonError = JSON.parse(rawError);
            showNotification(jsonError.message || "Transfer Failed", 'error');
        } catch (e) {
            // If it's not JSON (e.g. 404 Not Found), show the raw text
            showNotification("Failed: " + rawError, 'error');
        }
      }
    } catch (error) {
       console.error(error);
       showNotification("Network Error", 'error');
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* 1. NOTIFICATION BANNER */}
      {notification && (
        <div className={`fixed top-20 left-6 right-6 p-4 rounded-2xl shadow-lg z-50 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5"/>}
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* 2. SHARED MODAL OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                  {activeModal === 'topup' ? 'Add Money' : 'Send Money'}
              </h3>
              <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
                {/* Receiver Input (Only for Send) */}
                {activeModal === 'send' && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <label className="text-xs text-slate-400 font-bold uppercase">To (Phone Number)</label>
                         <input 
                            type="text" 
                            autoFocus
                            placeholder="e.g. 9876543210"
                            value={receiverPhone}
                            onChange={(e) => setReceiverPhone(e.target.value)}
                            className="w-full bg-transparent text-lg font-bold outline-none mt-1 text-slate-900" 
                         />
                    </div>
                )}

                {/* Amount Input */}
                <div className="flex justify-center items-center gap-1 py-4">
                    <span className="text-3xl font-bold text-slate-900">₹</span>
                    <input 
                        type="number" 
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder="0"
                        className="text-5xl font-bold text-slate-900 w-40 text-center outline-none placeholder:text-slate-200"
                    />
                </div>
            </div>

            <button 
              onClick={activeModal === 'topup' ? handleTopUpSubmit : handleSendMoney}
              className={`w-full py-4 mt-4 font-bold rounded-xl text-lg shadow-lg transition-transform active:scale-95 ${activeModal === 'topup' ? 'bg-[#BFAEE3] text-slate-900 shadow-purple-200' : 'bg-slate-900 text-white shadow-slate-300'}`}
            >
              {activeModal === 'topup' ? 'Confirm Top Up' : 'Send Now'}
            </button>
          </div>
        </div>
      )}

      {/* 3. DASHBOARD UI */}
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
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {/* TOP UP */}
          <ActionButton 
            icon={<Wallet />} label="Top Up" color="bg-blue-50 text-blue-600" 
            onClick={() => setActiveModal('topup')} 
          />
          {/* SEND (Now Active!) */}
          <ActionButton 
            icon={<Send />} label="Send" color="bg-purple-50 text-purple-600" 
            onClick={() => setActiveModal('send')} 
          />
          
          <ActionButton icon={<FileText />} label="Bills" color="bg-orange-50 text-orange-600" />
          <ActionButton icon={<Smartphone />} label="Airtime" color="bg-green-50 text-green-600" />
        </div>
      </div>

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
// ✅ NEW: Handle Top Up (Matches the simplified Backend response)
  const handleTopUp = async () => {
    const amountStr = prompt("Enter amount to add to wallet:", "1000");
    if (!amountStr) return;

    try {
      const response = await fetch('http://localhost:8080/api/user/addMoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amountStr)
        })
      });

      if (response.ok) {
        const data = await response.json(); // Read the simple map
        alert("Success! New Balance: ₹" + data.balance); // Show the new balance
        onBalanceUpdate(data.balance); // Update the screen
      } else {
        const errorText = await response.text();
        alert("Failed: " + errorText);
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

// --- 3. DEBT SETTLER (UPDATED ERROR HANDLING) ---
const DebtSettlerView = ({ user, navigate, onBalanceUpdate }) => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    fetchDebts();
  }, [user.id]);

  const fetchDebts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/debts?userId=${user.id}`);
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error("Failed to load debts", error);
    }
  };

  const handleSettle = async (debtId, amount) => {
    if (!window.confirm("Confirm payment? Money will be deducted from your wallet.")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/settle/${debtId}`, {
        method: 'POST'
      });

      // ✅ FIXED: Better error handling to see "Insufficient Funds" message
      if (response.ok) {
        alert("Debt Settled Successfully!");
        
        // Update local balance immediately (Assuming we paid 'amount')
        onBalanceUpdate(user.balance - amount);
        fetchDebts(); // Refresh list
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown Error" }));
        const msg = errorData.message || "Settlement Failed on Server";
        alert("Settlement Failed: " + msg);
      }
    } catch (error) {
      console.error(error);
      alert("Network Error: Is backend running?");
    }
  };

  const totalOwed = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-bold text-slate-900">Debt Manager</h2>
         <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
      </div>

      <div className="bg-[#C3D69B] p-6 rounded-3xl relative overflow-hidden">
        <h3 className="text-slate-900 font-bold text-lg relative z-10">You are owed</h3>
        <h1 className="text-4xl font-bold text-slate-900 mt-2 relative z-10">₹{totalOwed.toLocaleString()}</h1>
        <p className="text-slate-800 text-sm mt-1 relative z-10 opacity-80">From {debts.length} friends</p>
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
            
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-600">Remind</button>
                <button 
                    onClick={() => handleSettle(debt.id, debt.amount)}
                    className="py-3 bg-slate-900 text-white rounded-xl font-bold hover:scale-[1.02] transition-transform"
                >
                    Settle
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. SPLIT BILL VIEW ---
const SplitBillView = ({ user, navigate }) => {
  const [amount, setAmount] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [description, setDescription] = useState('Split Bill');
  const [isSending, setIsSending] = useState(false);
  const friends = ['Bob', 'Charlie'];

  const handleSplit = async () => {
    if (!amount || !selectedFriend) {
      alert("Please enter an amount and select a friend!");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('http://localhost:8080/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditorId: user.id, // You paid
          debtorName: selectedFriend, // They owe
          amount: parseFloat(amount),
          description: description
        })
      });

      if (response.ok) {
        alert("Success! Bill split added.");
        navigate('debts'); 
      } else {
        alert("Failed to split bill.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900">Split Bill</h2>
            <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <p className="text-slate-400 text-sm font-bold uppercase mb-2">Total Amount</p>
             <div className="flex justify-center items-center gap-1 text-slate-900">
                <span className="text-3xl font-bold">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0" 
                  className="text-5xl font-bold w-32 text-center outline-none placeholder:text-slate-200" 
                />
             </div>
             <input 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-4 text-center w-full text-slate-500 font-medium outline-none border-b border-transparent focus:border-slate-200 transition-colors"
                placeholder="What is this for?"
             />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <p className="text-slate-400 text-sm font-bold uppercase mb-4">Split With</p>
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {friends.map(name => (
                    <div key={name} className="flex flex-col items-center gap-2 min-w-[60px]" onClick={() => setSelectedFriend(name)}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-2 cursor-pointer transition-all ${selectedFriend === name ? 'bg-[#BFAEE3] text-slate-900 border-[#BFAEE3]' : 'bg-slate-100 text-slate-600 border-transparent hover:border-[#BFAEE3]'}`}>
                            {name.charAt(0)}
                        </div>
                        <span className={`text-xs font-medium ${selectedFriend === name ? 'text-[#8A70BE] font-bold' : 'text-slate-500'}`}>{name}</span>
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
        
        <button 
          onClick={handleSplit}
          disabled={isSending}
          className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg shadow-lg shadow-purple-200 disabled:opacity-50`}
        >
            {isSending ? 'Splitting...' : 'Split Now'}
        </button>
    </div>
  );
};

// --- 5. ACCOUNT VIEW ---
const AccountView = ({ user, navigate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    phone: user?.phone,
    email: 'alice@example.com', 
    bio: 'Love spending time with friends! 💸',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile Updated! (Simulated)");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
         <button onClick={() => navigate('home')} className="p-2 bg-white rounded-full border border-slate-200"><X className="w-5 h-5" /></button>
      </div>

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
      </div>

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
