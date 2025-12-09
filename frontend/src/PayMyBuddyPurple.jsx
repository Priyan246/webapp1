import React, { useState } from 'react';
import {
  Wallet, Send, Plus, Users, Bell, Search,
  LogOut, ShieldAlert, CheckCircle, Smartphone,
  Home, FileText, User, ArrowUpRight, X, Eye, EyeOff
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_FRIENDS = [
  { id: 1, name: 'Darasaoba', phone: '555-0123', avatar: 'D' },
  { id: 2, name: 'Adonai geng', phone: '555-0987', avatar: 'A' },
];

const MOCK_DEBTS = [
  { id: 1, friend: 'Adonai geng', amount: 4500.00, date: '2025-11-25', status: 'overdue' }, // >10 days
  { id: 2, friend: 'Darasaoba', amount: 1550.00, date: '2025-12-08', status: 'pending' },
];

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'Transfer to', name: '@darasaoba', amount: '-₦10.00', date: 'Feb 02, 2022', time: '3:00 pm' },
  { id: 2, type: 'Transfer to', name: '@darasaoba', amount: '-₦10.00', date: 'Feb 02, 2022', time: '3:00 pm' },
];

// --- STYLE CONSTANTS (From your images) ---
const THEME = {
  primary: 'bg-[#BFAEE3] hover:bg-[#af9ce0] text-slate-900', // Pastel Purple
  secondary: 'bg-[#C3D69B] text-slate-900', // Lime Green
  bg: 'bg-white',
  textMain: 'text-slate-900',
  textMuted: 'text-slate-500',
  inputBg: 'bg-slate-50',
  inputBorder: 'border-slate-200',
  roundedBtn: 'rounded-xl',
  roundedCard: 'rounded-2xl',
};


// --- MAIN COMPONENT ---
const PayMyBuddyPurple = () => {
  const [currentView, setCurrentView] = useState('login'); // login, home, split, debts, addFriend
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState(1000.00);

  const navigate = (view) => setCurrentView(view);

  if (currentView === 'login') {
    return <LoginScreen onLogin={() => navigate('home')} />;
  }

  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.textMain} font-sans pb-20`}>
      {/* Header / Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#BFAEE3]">
             <img src="https://i.pravatar.cc/150?img=3" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className={`text-sm ${THEME.textMuted}`}>Hey Baru,</p>
            <p className="font-semibold">It's a good day to spend 👇</p>
          </div>
        </div>
        <button className="p-2 bg-slate-100 rounded-full">
          <Search className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      <main className="px-6 py-4">
        {currentView === 'home' && (
          <HomeView
            balance={balance}
            onOpenWallet={() => setShowWalletModal(true)}
            navigate={navigate}
          />
        )}
        {currentView === 'split' && <SplitBillView navigate={navigate} />}
        {currentView === 'debts' && <DebtSettlerView navigate={navigate} />}
        {currentView === 'addFriend' && <AddFriendView navigate={navigate} />}
      </main>

      {/* Bottom Navigation Bar (Matches image style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-3 px-6 flex justify-between items-center text-xs font-medium text-slate-400 z-10">
        <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-[#8A70BE]' : ''}`}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </button>
        <button onClick={() => navigate('split')} className={`flex flex-col items-center gap-1 ${currentView === 'split' ? 'text-[#8A70BE]' : ''}`}>
          <Users className="w-6 h-6" />
          <span>Split</span>
        </button>
        <button onClick={() => navigate('debts')} className={`flex flex-col items-center gap-1 ${currentView === 'debts' ? 'text-[#8A70BE]' : ''}`}>
          <FileText className="w-6 h-6" />
          <span>Debts</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User className="w-6 h-6" />
          <span>Account</span>
        </button>
      </nav>

      {/* Modals */}
      {showWalletModal && (
        <WalletModal
          onClose={() => setShowWalletModal(false)}
          onAdd={(amount) => { setBalance(b => b + parseFloat(amount)); setShowWalletModal(false); }}
        />
      )}
    </div>
  );
};

// --- 1. LOGIN SCREEN (Visual match) ---
const LoginScreen = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`min-h-screen ${THEME.bg} flex flex-col justify-between p-6`}>
      <div className="mt-10">
        <button className="text-slate-400"><X className="w-6 h-6" /></button>
        <h1 className="text-2xl font-bold mt-6 flex items-center gap-2">
          Welcome back <span className="text-2xl">🎉</span>
        </h1>
        <p className={`${THEME.textMuted} mt-2`}>Let's get you back to your zone</p>

        <div className="mt-10 space-y-6">
          <div className={`${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} p-4`}>
            <input type="text" placeholder="Enter phone number" className="w-full bg-transparent focus:outline-none" />
          </div>
          <div className={`${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} p-4 flex items-center justify-between`}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-transparent focus:outline-none" />
            <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end">
            <button className={`text-sm font-semibold text-[#8A70BE]`}>Forgot password?</button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <button onClick={onLogin} className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg`}>
          Log In
        </button>
        <p className={`text-center mt-4 ${THEME.textMuted}`}>
          Don't have an account? <button className={`font-semibold text-[#8A70BE]`}>Register</button>
        </p>
      </div>
    </div>
  );
};

// --- 2. HOME VIEW ---
const HomeView = ({ balance, onOpenWallet, navigate }) => (
  <div className="space-y-8 animate-in fade-in duration-300">
    {/* Balance Card (Purple) */}
    <div className={`${THEME.primary} ${THEME.roundedCard} p-6 relative overflow-hidden shadow-lg`}>
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-80 mb-1">Total Balance</p>
        <h2 className="text-4xl font-bold">₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        <div className="flex items-center justify-between mt-6 opacity-80 text-sm">
          <p>Wema bank: 123456789 <span className="ml-2">❐</span></p>
          <p>Unique ID: @Soba</p>
        </div>
      </div>
      {/* Abstract Shapes for Card Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
    </div>

    {/* Quick Actions (Matching image style) */}
    <div>
      <h3 className="font-bold text-lg mb-4">Quick Action</h3>
      <div className="grid grid-cols-4 gap-4">
        <QuickActionButton icon={<Wallet className="w-6 h-6 text-slate-700" />} label="Fund wallet" bgColor="bg-[#F0EBE0]" onClick={onOpenWallet} />
        <QuickActionButton icon={<Smartphone className="w-6 h-6 text-slate-700" />} label="Buy airtime" bgColor="bg-[#E4ECCE]" />
        <QuickActionButton icon={<FileText className="w-6 h-6 text-slate-700" />} label="Pay a bill" bgColor="bg-[#D8E4E8]" />
        <QuickActionButton icon={<ArrowUpRight className="w-6 h-6 text-slate-700" />} label="Transfer" bgColor="bg-[#E8D8E4]" onClick={() => navigate('split')} />
      </div>
    </div>

    {/* Recent Transactions */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Recent Transaction</h3>
        <button className={`text-sm font-semibold text-[#8A70BE]`}>View all</button>
      </div>
      <div className="space-y-4">
        {MOCK_TRANSACTIONS.map(tx => (
          <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-medium">{tx.type} <span className="font-bold">{tx.name}</span></p>
                <p className="text-xs text-slate-500">{tx.date} | {tx.time}</p>
              </div>
            </div>
            <span className="font-bold">{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, bgColor, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${bgColor} ${THEME.roundedBtn} flex items-center justify-center group-hover:opacity-90 transition-opacity shadow-sm`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-slate-600 text-center">{label}</span>
  </button>
);

// --- 3. SPLIT BILL VIEW ---
const SplitBillView = ({ navigate }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-300">
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => navigate('home')} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
      <h2 className="text-2xl font-bold">Split Bill</h2>
    </div>

    <div className={`${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedCard} p-6 space-y-6`}>
      <div>
        <label className="block text-sm font-medium mb-2">Total Amount</label>
        <div className={`flex items-center ${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} p-4`}>
          <span className="text-2xl font-bold mr-2">₦</span>
          <input type="number" placeholder="0.00" className="w-full bg-transparent text-2xl font-bold focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select Friends</label>
        <div className="flex gap-4">
          <button onClick={() => navigate('addFriend')} className={`w-14 h-14 ${THEME.inputBg} border-2 border-dashed ${THEME.inputBorder} rounded-full flex items-center justify-center text-slate-400 hover:border-[#8A70BE] hover:text-[#8A70BE] transition-colors`}>
            <Plus className="w-6 h-6" />
          </button>
          {MOCK_FRIENDS.map(friend => (
            <div key={friend.id} className="flex flex-col items-center gap-1">
              <div className={`w-14 h-14 bg-[#E8D8E4] rounded-full flex items-center justify-center font-bold text-[#8A70BE] border-2 border-transparent hover:border-[#8A70BE] cursor-pointer`}>
                {friend.avatar}
              </div>
              <span className="text-xs">{friend.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <button className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg mt-4`}>
        Split Now
      </button>
    </div>
  </div>
);

// --- 4. DEBT SETTLER VIEW (With Red Alert) ---
const DebtSettlerView = ({ navigate }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-300">
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => navigate('home')} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
      <h2 className="text-2xl font-bold">Debt Settler</h2>
    </div>

    <div className="space-y-4">
      {MOCK_DEBTS.map(debt => (
        <div key={debt.id} className={`${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedCard} p-5`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{debt.friend}</h3>
              <p className="text-sm text-slate-500">Owes you since {debt.date}</p>
            </div>
            <p className="font-bold text-xl">₦{debt.amount.toLocaleString()}</p>
          </div>

          {/* --- THE RED ALERT LOGIC --- */}
          {debt.status === 'overdue' ? (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <div>
                <p className="text-sm font-bold">Overdue (10+ days)</p>
                <p className="text-xs">Automatic reminder email sent.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Pending Payment</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className={`py-3 ${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} font-semibold text-slate-600`}>Remind</button>
            <button className={`py-3 ${THEME.primary} ${THEME.roundedBtn} font-semibold`}>Settle</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- 5. ADD FRIEND VIEW ---
const AddFriendView = ({ navigate }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-300">
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => navigate('split')} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
      <h2 className="text-2xl font-bold">Add Friend</h2>
    </div>

    <div className={`${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedCard} p-6 space-y-6`}>
        <div className="text-center">
            <div className="w-20 h-20 bg-[#E4ECCE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-[#7A8F4E]" />
            </div>
            <p className="text-sm text-slate-500">Enter their phone number to send an invite.</p>
        </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <div className={`flex items-center ${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} p-4`}>
          <input type="tel" placeholder="+234..." className="w-full bg-transparent text-lg focus:outline-none" />
        </div>
      </div>

      <button className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg`}>
        Send Invite
      </button>
    </div>
  </div>
);

// --- MODAL: WALLET ---
const WalletModal = ({ onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
      <div className={`w-full md:max-w-sm ${THEME.bg} ${THEME.roundedCard} p-6 animate-in slide-in-from-bottom duration-300 m-4`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Fund Wallet</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-2 font-medium">Enter Amount</p>
          <div className="flex items-center border-b-2 border-[#BFAEE3] pb-2">
            <span className="text-4xl font-bold mr-2">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold focus:outline-none"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1000, 5000, 10000].map(val => (
            <button key={val} onClick={() => setAmount(val)} className={`py-3 ${THEME.inputBg} border ${THEME.inputBorder} ${THEME.roundedBtn} font-medium`}>
              +₦{val.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          onClick={() => onAdd(amount || 0)}
          className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PayMyBuddyPurple;