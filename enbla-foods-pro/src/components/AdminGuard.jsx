import React, { useState } from 'react';

const AdminGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const securePassword = import.meta.env.VITE_ADMIN_PASSWORD;
    // Use a professional, strong secret key
    if (password === 'securePassword') { 
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Unauthorized Access Denied');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🔐</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Kitchen Access</h2>
            <p className="text-slate-500 text-xs font-bold uppercase mt-2 tracking-widest">Authorized Personnel Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="ENTER STAFF PIN"
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-orange-600 text-white font-mono text-center tracking-[0.5em] transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-600/20">
              Verify Identity
            </button>
          </form>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminGuard;