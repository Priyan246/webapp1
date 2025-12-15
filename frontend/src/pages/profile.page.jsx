import React, { useState } from 'react';
import { User, EyeOff, LogOut, ArrowUpRight } from 'lucide-react';

const ProfilePage = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name, phone: user?.phone });

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#BFAEE3] shadow-lg">
             <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold mt-3 text-slate-900">{formData.name}</h3>
      </div>
      
      {/* Settings List */}
      <div className="space-y-2">
        <button onClick={onLogout} className="w-full bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-600">Log Out</span>
            </div>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;