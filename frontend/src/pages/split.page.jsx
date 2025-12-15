import React, { useState } from 'react';
import { Plus, X, Users, CheckCircle, ShieldAlert } from 'lucide-react';
import { THEME } from '../theme';
import { useNavigate } from 'react-router-dom';

const SplitBillPage = ({ user, onBalanceUpdate }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]); 
  const [description, setDescription] = useState('Split Bill');
  const [isSending, setIsSending] = useState(false);
  
  // ✅ NEW: Notification State
  const [notification, setNotification] = useState(null);

  // Mock Friends
  const friends = ['Bob', 'Charlie', 'David', 'Alice'];

  // Helper to show in-app notification
  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    // Auto-hide after 3 seconds
    setTimeout(() => {
        setNotification(null);
        if (type === 'success') navigate('/debts'); // Redirect only on success
    }, 3000);
  };

  const toggleFriend = (name) => {
    if (selectedFriends.includes(name)) {
      setSelectedFriends(prev => prev.filter(f => f !== name));
    } else {
      setSelectedFriends(prev => [...prev, name]);
    }
  };

  const handleSplit = async () => {
    const totalAmount = parseFloat(amount);
    
    if (!amount || totalAmount <= 0) {
        showNotification("Please enter a valid amount", "error");
        return;
    }
    if (selectedFriends.length === 0) {
        showNotification("Select at least one friend", "error");
        return;
    }

    setIsSending(true);

    try {
      // --- STEP A: PAY THE BILL (Deduct Total from You) ---
      const payResponse = await fetch('http://localhost:8080/api/wallet/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: totalAmount
        })
      });

      if (!payResponse.ok) {
        const errorMsg = await payResponse.text();
        throw new Error(errorMsg || "Payment Failed");
      }

      // Update the balance in the App immediately
      const payData = await payResponse.json();
      onBalanceUpdate(payData.balance);

      // --- STEP B: SPLIT THE BILL (Create Debts) ---
      const totalPeople = selectedFriends.length + 1; 
      const splitAmount = (totalAmount / totalPeople).toFixed(2); 
      
      const promises = selectedFriends.map(friendName => {
        return fetch('http://localhost:8080/api/debts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creditorId: user.id,
            debtorName: friendName,
            amount: parseFloat(splitAmount),
            description: `${description} (Split)`
          })
        });
      });

      await Promise.all(promises);

      // ✅ SUCCESS: Show In-App Notification (No more Alert!)
      showNotification(`Bill Paid! New Balance: ₹${payData.balance}`, 'success');

    } catch (error) {
      console.error(error);
      showNotification(error.message || "Error processing transaction", 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getSplitPreview = () => {
    if (!amount || selectedFriends.length === 0) return "0.00";
    return (parseFloat(amount) / (selectedFriends.length + 1)).toFixed(2);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-24 relative">
        
        {/* ✅ NEW: NOTIFICATION BANNER */}
        {notification && (
            <div className={`fixed top-6 left-6 right-6 p-4 rounded-2xl shadow-xl z-50 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                {notification.type === 'error' ? <ShieldAlert className="w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
                <span className="font-bold text-sm">{notification.msg}</span>
            </div>
        )}

        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900">Split Bill</h2>
        </div>

        {/* Input Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <p className="text-slate-400 text-sm font-bold uppercase mb-2">Total Bill Amount</p>
             <div className="flex justify-center items-center gap-1 text-slate-900">
                <span className="text-3xl font-bold">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0" 
                  className="text-5xl font-bold w-40 text-center outline-none placeholder:text-slate-200" 
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

        {/* Friends Selection */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
               <p className="text-slate-400 text-sm font-bold uppercase">Split With</p>
               <span className="text-xs text-[#8A70BE] font-bold">
                 {selectedFriends.length > 0 ? `${selectedFriends.length} Selected` : 'Select Friends'}
               </span>
             </div>
             
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {friends.map(name => {
                    const isSelected = selectedFriends.includes(name);
                    return (
                      <div key={name} className="flex flex-col items-center gap-2 min-w-[60px]" onClick={() => toggleFriend(name)}>
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-2 cursor-pointer transition-all ${isSelected ? 'bg-[#BFAEE3] text-slate-900 border-[#BFAEE3] scale-110' : 'bg-slate-100 text-slate-600 border-transparent hover:border-[#BFAEE3]'}`}>
                              {name.charAt(0)}
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-[#8A70BE] font-bold' : 'text-slate-500'}`}>{name}</span>
                      </div>
                    );
                })}
             </div>
        </div>
        
        {/* Preview Box */}
        {selectedFriends.length > 0 && amount > 0 && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Per Person Share</p>
                <p className="font-bold text-lg">₹{getSplitPreview()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">You + {selectedFriends.length} Friends</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleSplit}
          disabled={isSending || selectedFriends.length === 0}
          className={`w-full py-4 ${THEME.primary} ${THEME.roundedBtn} font-bold text-lg shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isSending ? 'Processing...' : `Pay & Split ₹${amount}`}
        </button>
    </div>
  );
};

export default SplitBillPage;