
import React from 'react';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, UserMinus, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const activeStudents = students.filter(s => s.status === 'Aktif');
  const inactiveStudents = students.filter(s => s.status !== 'Aktif');
  const fasa1Completed = activeStudents.filter(s => !!s.fasa1).length;
  const fasa2Completed = activeStudents.filter(s => !!s.fasa2).length;

  const dataFasa = [
    { name: 'Penggal 1', Lengkap: fasa1Completed, Belum: activeStudents.length - fasa1Completed },
    { name: 'Penggal 2', Lengkap: fasa2Completed, Belum: activeStudents.length - fasa2Completed },
  ];

  const statusDist = [
    { name: 'Aktif', value: activeStudents.length, color: '#10b981' },
    { name: 'Pindah/Lain-lain', value: inactiveStudents.length, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Enrolmen Aktif</p>
            <h3 className="text-2xl font-black text-gray-800">{activeStudents.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selesai Fasa 1</p>
            <h3 className="text-2xl font-black text-emerald-600">{fasa1Completed}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selesai Fasa 2</p>
            <h3 className="text-2xl font-black text-indigo-600">{fasa2Completed}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <UserMinus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rekod Pengecualian</p>
            <h3 className="text-2xl font-black text-orange-600">{inactiveStudents.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black uppercase text-gray-700 tracking-widest mb-10 border-l-4 border-emerald-500 pl-4">Analisis Pengisian Data</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataFasa}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Bar dataKey="Lengkap" name="Sudah Isi" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                <Bar dataKey="Belum" name="Belum Isi" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black uppercase text-gray-700 tracking-widest mb-10 border-l-4 border-blue-500 pl-4">Status Keberadaan Murid</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                  {statusDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
