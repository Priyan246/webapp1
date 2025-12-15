// src/components/Navbar.jsx
import React from 'react';
import { Home, Users, Activity, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <NavButton icon={<Home />} label="Home" active={isActive('/home')} onClick={() => navigate('/home')} />
      <NavButton icon={<Users />} label="Split" active={isActive('/split')} onClick={() => navigate('/split')} />
      <NavButton icon={<Activity />} label="Debts" active={isActive('/debts')} onClick={() => navigate('/debts')} />
      <NavButton icon={<User />} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} />
    </nav>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#8A70BE]' : 'text-slate-400 hover:text-slate-600'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Navbar;