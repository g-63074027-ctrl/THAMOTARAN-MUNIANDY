
import React, { useState } from 'react';
import { TeacherSettings, User, Student } from '../types';
import { Save, UserCog, CheckCircle, Users, Trash2, ShieldCheck, Download, Upload, UserPlus } from 'lucide-react';

interface SettingsProps {
  settings: TeacherSettings;
  onSave: (settings: TeacherSettings) => void;
  users: User[];
  students: Student[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (id: string) => void;
  onRestoreData: (data: any) => void;
  currentUser: User;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, users, onAddUser, onDeleteUser, onRestoreData, currentUser, students }) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'users' | 'backup'>('users');
  const [formData, setFormData] = useState<TeacherSettings>({...settings});
  const [newUser, setNewUser] = useState({ name: '', userId: '', password: '', role: 'Guru' as const });
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.userId && newUser.password) {
      onAddUser(newUser);
      setNewUser({ name: '', userId: '', password: '', role: 'Guru' });
    }
  };

  const downloadBackup = () => {
    const data = JSON.stringify(students, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_segak_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          onRestoreData(data);
        } catch (err) {
          alert("Format fail tidak sah!");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
            activeTab === 'users' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" /> Pengguna
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
            activeTab === 'profil' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <UserCog className="w-4 h-4" /> Profil Sekolah
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
            activeTab === 'backup' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <Download className="w-4 h-4" /> Sandaran Data
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          {currentUser.role === 'Admin' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-black uppercase text-gray-700 tracking-widest mb-6 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" /> Daftar Pengguna Baharu
              </h3>
              <form onSubmit={handleAddUserSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Nama Guru</label>
                  <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value.toUpperCase()})} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">User ID</label>
                  <input type="text" value={newUser.userId} onChange={e => setNewUser({...newUser, userId: e.target.value.toLowerCase()})} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">No. IC (Password)</label>
                  <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs" />
                </div>
                <button type="submit" className="bg-emerald-600 text-white py-2 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-700 transition-all">Daftar</button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Pengguna</th>
                  <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Peranan</th>
                  <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-xs text-gray-800 uppercase">{u.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono">ID: {u.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {currentUser.role === 'Admin' && u.role !== 'Admin' && (
                        <button onClick={() => onDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'profil' ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Guru PJPK (Utama)</label>
                <input type="text" value={formData.namaGuru} onChange={e => setFormData({ ...formData, namaGuru: e.target.value.toUpperCase() })} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Guru Kelas</label>
                <input type="text" value={formData.namaGuruKelas} onChange={e => setFormData({ ...formData, namaGuruKelas: e.target.value.toUpperCase() })} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Setiausaha SEGAK</label>
                <input type="text" value={formData.namaSetiausaha} onChange={e => setFormData({ ...formData, namaSetiausaha: e.target.value.toUpperCase() })} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-bold uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo Sekolah (URL Base64)</label>
                <input type="text" value={formData.logo || ''} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none font-mono text-[9px]" placeholder="data:image/png;base64,..." />
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-3">
              {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Berjaya Disimpan' : 'Simpan Profil Sekolah'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center space-y-8">
           <div className="inline-flex p-6 bg-blue-50 text-blue-600 rounded-[32px]">
              <ShieldCheck className="w-12 h-12" />
           </div>
           <div>
              <h3 className="text-xl font-black uppercase text-gray-800">Sandaran & Pulihan Data</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-sm mx-auto">Memandangkan sistem ini menyimpan data secara lokal, anda dinasihatkan membuat sandaran fail secara berkala.</p>
           </div>
           <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={downloadBackup} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                 <Download className="w-5 h-5" /> Simpan Fail Sandaran
              </button>
              <label className="px-10 py-5 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-200 transition-all cursor-pointer">
                 <Upload className="w-5 h-5" /> Pulihkan Data Fail
                 <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
              </label>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
