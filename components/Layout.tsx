
import React from 'react';
import { ViewState, User as UserType } from '../types';
import { YEAR_OPTIONS } from '../constants';
import { LayoutDashboard, Users, UserPlus, FileText, School, Settings, LogOut, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  currentUser: UserType;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeView, onViewChange, selectedYear, onYearChange, currentUser, onLogout
}) => {
  // Tapis menuItems berdasarkan peranan pengguna
  const menuItems = [
    { id: ViewState.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.StudentList, label: 'Senarai Murid', icon: Users },
    { id: ViewState.AddStudent, label: 'Daftar Murid', icon: UserPlus },
    { id: ViewState.Reports, label: 'Laporan', icon: FileText },
  ];

  // Hanya tambah menu Tetapan jika pengguna adalah Admin
  if (currentUser.role === 'Admin') {
    menuItems.push({ id: ViewState.Settings, label: 'Tetapan & Admin', icon: Settings });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="no-print w-full md:w-64 bg-emerald-950 text-white flex-shrink-0 flex flex-col z-20 shadow-2xl">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-900/40">
            <School className="w-6 h-6 text-white" />
          </div>
          <div className="font-bold text-lg leading-tight">
            SEGAK <br /> <span className="text-xs font-medium text-emerald-300 uppercase tracking-tighter">SMK Sg Karangan</span>
          </div>
        </div>

        <nav className="px-4 space-y-1 flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                ? 'bg-emerald-600 text-white shadow-xl' 
                : 'text-emerald-200/60 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-900/50">
           <div className="bg-emerald-900/50 p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-emerald-400 font-bold uppercase truncate">{currentUser.name}</p>
                <p className="text-[8px] text-emerald-600 font-black uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <button onClick={onLogout} className="text-emerald-500 hover:text-red-400 transition-colors">
                 <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="no-print bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-black text-gray-700 uppercase tracking-widest">
              {menuItems.find(m => m.id === activeView)?.label || 'SEGAK'}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black text-gray-700 uppercase">Sesi:</span>
              <select 
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="bg-transparent text-xs font-black text-gray-900 outline-none cursor-pointer"
              >
                {YEAR_OPTIONS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
