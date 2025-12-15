import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, CheckCircle } from 'lucide-react';

const DebtsPage = ({ user, onBalanceUpdate }) => {
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
    // ... Copy your handleSettle logic here ...
  };

  const totalOwed = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-900">Debt Manager</h2>
      
      <div className="bg-[#C3D69B] p-6 rounded-3xl relative overflow-hidden">
        <h3 className="text-slate-900 font-bold text-lg relative z-10">You are owed</h3>
        <h1 className="text-4xl font-bold text-slate-900 mt-2 relative z-10">₹{totalOwed.toLocaleString()}</h1>
        <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-900 opacity-10" />
      </div>

      <div className="space-y-4">
        {debts.map(debt => (
          <div key={debt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-3">
                 <h4 className="font-bold text-slate-900">{debt.friend}</h4>
                 <p className="font-bold text-lg">₹{debt.amount}</p>
             </div>
             {/* Copy the rest of your debt UI logic here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtsPage;