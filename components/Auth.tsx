
import React, { useState } from 'react';
import { School, Lock, User, ShieldAlert, ChevronRight } from 'lucide-react';

interface AuthProps {
  onLogin: (userId: string, pass: string) => boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(userId, password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-3xl mb-6 shadow-inner">
              <School className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Sistem SEGAK</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">SMK Sungai Karangan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <User className="w-3 h-3" /> User ID / No. IC
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-700 ${
                    error ? 'border-red-200 bg-red-50' : 'border-gray-100 focus:border-emerald-500 focus:bg-white'
                  }`}
                  placeholder="Masukkan User ID..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Kata Laluan
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-700 ${
                    error ? 'border-red-200 bg-red-50' : 'border-gray-100 focus:border-emerald-500 focus:bg-white'
                  }`}
                  placeholder="********"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldAlert className="w-5 h-5" />
                <p className="text-xs font-bold">User ID atau Kata Laluan Salah!</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 uppercase tracking-widest group"
            >
              Log Masuk Sistem
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed">
              SILA HUBUNGI PENTADBIR SISTEM JIKA<br /> ANDA TERLUPA KATA LALUAN.
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-emerald-400/60 font-medium uppercase tracking-widest">
          SISTEM DATA SEGAK v1.2 • © 2025
        </p>
      </div>
    </div>
  );
};

export default Auth;
