import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { THEME } from './theme';

// Imports
import Navbar from './components/navbar';
import LoginPage from './pages/login.page';
import HomePage from './pages/home.page';
import SplitBillPage from './pages/split.page';
import DebtsPage from './pages/debts.page';
import ProfilePage from './pages/profile.page';

// Layout Component (Header + Bottom Nav)
const MainLayout = ({ children, user }) => {
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.textMain} font-sans`}>
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
        <button className="p-2 bg-white shadow-sm border border-slate-100 rounded-full relative">
           <Bell className="w-5 h-5 text-slate-400" />
           <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Page Content */}
      <main className="px-6 py-2">
        {children}
      </main>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  // Handle Login
  const handleLogin = async (phone, pin) => {
    try {
      const response = await fetch(`http://localhost:8080/api/login?phone=${phone}`);
      if (!response.ok) throw new Error("User not found");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  // Handle Logout
  const handleLogout = () => setUser(null);

  // Handle Balance Updates (Top Up, Payment, Splitting)
  const updateUserBalance = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  return (
    <Router>
      <Routes>
        {/* If not logged in, show Login, else redirect to home */}
        <Route path="/" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/home" />} />
        
        {/* Authenticated Routes */}
        {user && (
          <>
            <Route path="/home" element={
              <MainLayout user={user}>
                <HomePage user={user} onBalanceUpdate={updateUserBalance} />
              </MainLayout>
            } />
            
            <Route path="/split" element={
              <MainLayout user={user}>
                {/* ✅ CRITICAL: Passing onBalanceUpdate here ensures Header updates after split */}
                <SplitBillPage user={user} onBalanceUpdate={updateUserBalance} />
              </MainLayout>
            } />
            
            <Route path="/debts" element={
              <MainLayout user={user}>
                <DebtsPage user={user} onBalanceUpdate={updateUserBalance} />
              </MainLayout>
            } />
            
            <Route path="/profile" element={
              <MainLayout user={user}>
                <ProfilePage user={user} onLogout={handleLogout} />
              </MainLayout>
            } />
          </>
        )}

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;