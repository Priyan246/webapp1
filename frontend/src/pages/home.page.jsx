import React, { useState } from 'react';
import { Wallet, Send, FileText, CheckCircle, Activity, ShieldAlert, X, CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { THEME } from '../theme';

const HomePage = ({ user, onBalanceUpdate }) => {
  const [activeModal, setActiveModal] = useState(null);
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
        showNotification("Failed", 'error');
      }
    } catch (error) {
      showNotification("Network Error", 'error');
    }
  };

  const handleSendMoney = async () => {
     // ... (Your existing send money logic here) ...
     // For brevity, assuming standard fetch logic similar to TopUp
     // Remember to call onBalanceUpdate(newBalance) on success
     showNotification("Simulation: Money Sent!", 'success');
     closeModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-24">
      {/* Notifications and Modals */}
      {notification && (
        <div className={`fixed top-20 left-6 right-6 p-4 rounded-2xl shadow-lg z-50 flex items-center justify-center gap-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-slate-900'} text-white`}>
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{activeModal === 'topup' ? 'Add Money' : 'Send Money'}</h3>
              <button onClick={closeModal}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            {/* Simple Inputs for modal */}
             {activeModal === 'send' && (
                 <input type="text" placeholder="Phone Number" value={receiverPhone} onChange={e=>setReceiverPhone(e.target.value)} className="w-full mb-4 p-3 bg-slate-50 rounded-xl" />
             )}
            <input type="number" placeholder="Amount" value={amountInput} onChange={e=>setAmountInput(e.target.value)} className="w-full text-3xl font-bold text-center p-4 outline-none" />
            <button onClick={activeModal === 'topup' ? handleTopUpSubmit : handleSendMoney} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4">Confirm</button>
          </div>
        </div>
      )}

      {/* Main Dashboard Card */}
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

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton icon={<Wallet />} label="Top Up" color="bg-blue-50 text-blue-600" onClick={() => setActiveModal('topup')} />
          <ActionButton icon={<Send />} label="Send" color="bg-purple-50 text-purple-600" onClick={() => setActiveModal('send')} />
          <ActionButton icon={<FileText />} label="Bills" color="bg-orange-50 text-orange-600" onClick={() => alert("Coming soon")} />
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                 </div>
                 <div>
                    <p className="font-bold text-sm">{tx.title}</p>
                    <p className="text-xs text-slate-400">{tx.user}</p>
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

export default HomePage;