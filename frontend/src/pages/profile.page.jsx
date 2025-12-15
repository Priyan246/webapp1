import React, { useState } from 'react';
import { 
    User, LogOut, Settings, Shield, 
    HelpCircle, Gift, ChevronRight, Edit3, Camera 
} from 'lucide-react';

const ProfilePage = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Default data fallback if user props are missing
  const [formData, setFormData] = useState({ 
      name: user?.name || 'User', 
      phone: user?.phoneNumber || '000-000-0000',
      email: 'alice@owemenot.com', // Mock email
      bio: 'Always pays debts on time! 🌟' 
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would POST to backend here
    alert("Profile Updated!");
  };

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      
      {/* 1. HEADER & AVATAR CARD */}
      <div className="relative bg-slate-900 rounded-3xl p-6 text-white overflow-hidden shadow-xl shadow-slate-200">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-400 to-blue-400">
                    <img 
                        src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800" 
                    />
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-slate-900 p-1.5 rounded-full shadow-lg active:scale-95 transition-transform">
                    <Camera size={14} strokeWidth={3} />
                </button>
            </div>
            
            <h2 className="text-2xl font-bold mt-3">{formData.name}</h2>
            <p className="text-slate-400 text-sm font-medium">@{formData.name.toLowerCase().replace(' ', '')} • +91 {formData.phone}</p>
            
            {/* Fake Stats Row */}
            <div className="flex gap-6 mt-6 w-full justify-center border-t border-slate-700/50 pt-4">
                <div className="text-center">
                    <p className="text-lg font-bold">98%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Trust Score</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold">14</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Friends</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold">Pro</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Member</p>
                </div>
            </div>
        </div>
      </div>

      {/* 2. EDITABLE DETAILS SECTION */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900">Personal Info</h3>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
            >
                {isEditing ? 'Save' : 'Edit'}
            </button>
        </div>
        
        <div className="space-y-4">
            <div className="group">
                <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
                <div className="flex items-center gap-2 mt-1">
                    <User size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={`w-full font-bold text-slate-900 outline-none transition-all ${isEditing ? 'border-b border-purple-300 pb-1' : 'bg-transparent'}`}
                    />
                </div>
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                <div className="flex items-center gap-2 mt-1">
                    <Edit3 size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        value={formData.bio}
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        className={`w-full font-medium text-slate-600 outline-none transition-all ${isEditing ? 'border-b border-purple-300 pb-1' : 'bg-transparent'}`}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* 3. MENU ACTIONS */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <MenuItem icon={<Settings size={20} />} label="Account Settings" />
        <div className="h-[1px] bg-slate-50 mx-4"></div>
        <MenuItem icon={<Shield size={20} />} label="Security & Privacy" />
        <div className="h-[1px] bg-slate-50 mx-4"></div>
        <MenuItem icon={<HelpCircle size={20} />} label="Help & Support" />
      </div>

      {/* 4. REFERRAL BANNER */}
      <div className="bg-gradient-to-r from-[#BFAEE3] to-[#C3D69B] rounded-3xl p-5 flex items-center justify-between text-slate-900 shadow-sm">
        <div>
            <p className="font-bold text-lg">Invite Friends</p>
            <p className="text-xs opacity-80 font-medium">Get a higher Trust Score!</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-sm">
            <Gift className="w-6 h-6 text-slate-900" />
        </div>
      </div>

      {/* 5. LOGOUT */}
      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Log Out
      </button>

      <div className="text-center text-xs text-slate-300 font-medium pt-2">
        Version 1.0.2 • OweMeNot Inc.
      </div>
    </div>
  );
};

// Helper Component for Menu Items
const MenuItem = ({ icon, label }) => (
    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="text-slate-400 group-hover:text-purple-600 transition-colors">
                {icon}
            </div>
            <span className="font-bold text-slate-700 text-sm">{label}</span>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
    </button>
);

export default ProfilePage;