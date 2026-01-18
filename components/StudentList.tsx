
import React, { useState } from 'react';
import { Student, StudentStatus } from '../types';
import { Search, Trash2, CheckCircle2, Clock, UserMinus, FileText, Upload, X, ChevronRight, Edit3, Eye, FileCheck, Stethoscope, AlertCircle } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onRecordTest: (student: Student, phase: 1 | 2) => void;
  onEditProfile: (student: Student) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: StudentStatus, evidence?: string, targetPhase?: 1 | 2 | 'Kekal') => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onRecordTest, onEditProfile, onDelete, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForm, setFilterForm] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState<'Semua' | StudentStatus>('Semua');
  const [statusModal, setStatusModal] = useState<Student | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<StudentStatus>('Masalah Kesihatan');
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 'Kekal'>(1);
  const [previewEvidence, setPreviewEvidence] = useState<string | null>(null);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.ic.includes(searchTerm);
    const matchesForm = filterForm === 'Semua' || s.tingkatan === filterForm;
    const matchesStatus = filterStatus === 'Semua' || s.status === filterStatus;
    return matchesSearch && matchesForm && matchesStatus;
  });

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!statusModal) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateStatus(statusModal.id, selectedNewStatus, reader.result as string, selectedPhase);
        setStatusModal(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status?: StudentStatus) => {
    if (!status || status === 'Aktif') return 'bg-emerald-500';
    switch (status) {
      case 'Pindah Masuk': return 'bg-blue-500';
      case 'Pindah Keluar': return 'bg-orange-500';
      case 'Dibuang': return 'bg-red-500';
      case 'Masalah Kesihatan': return 'bg-rose-500';
      case 'Lain-lain': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const renderPhaseStatus = (student: Student, phase: 1 | 2) => {
    const pStatus = phase === 1 ? (student.statusFasa1 || student.status) : (student.statusFasa2 || student.status);
    const pEvidence = phase === 1 ? (student.suratBuktiFasa1 || student.suratBukti) : (student.suratBuktiFasa2 || student.suratBukti);
    const pData = phase === 1 ? student.fasa1 : student.fasa2;
    
    if (pStatus === 'Aktif') {
      return (
        <button 
          onClick={() => onRecordTest(student, phase)}
          className={`group/btn relative px-4 py-2 rounded-xl border font-black text-[10px] uppercase transition-all flex items-center gap-2 mx-auto ${
            pData 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
            : 'bg-white border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600'
          }`}
        >
          {pData ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {pData ? 'Lengkap' : 'Belum'}
          <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-4px] group-hover/btn:translate-x-0" />
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center gap-1 group/status">
        <span className={`px-2 py-1 rounded-lg font-black text-[8px] text-white uppercase shadow-sm ${getStatusColor(pStatus)}`}>
          {pStatus}
        </span>
        {pEvidence && (
          <button 
            onClick={() => setPreviewEvidence(pEvidence)}
            className="flex items-center gap-1 text-[8px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-tighter transition-colors"
          >
            <FileCheck className="w-2.5 h-2.5" /> Lihat Bukti
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama atau IC..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <select 
            value={filterForm}
            onChange={e => setFilterForm(e.target.value)}
            className="flex-1 lg:flex-none px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white font-medium"
          >
            <option value="Semua">Tingkatan (Semua)</option>
            {[1,2,3,4,5].map(t => <option key={t} value={t.toString()}>Tingkatan {t}</option>)}
          </select>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="flex-1 lg:flex-none px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Masalah Kesihatan">Masalah Kesihatan</option>
            <option value="Pindah Keluar">Pindah Keluar</option>
            <option value="Dibuang">Dibuang</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profil Murid</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ujian Fasa 1</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ujian Fasa 2</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${s.jantina === 'Lelaki' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                        {s.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 uppercase text-xs tracking-tight flex items-center gap-2">
                          {s.nama}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{s.ic}</span>
                          <span className="bg-gray-200 text-gray-600 px-1 rounded font-black">{s.tingkatan}{s.kelas}</span>
                          {s.status !== 'Aktif' && (
                            <span className={`px-1.5 py-0.5 rounded font-black text-[8px] text-white uppercase ${getStatusColor(s.status)}`}>
                              {s.status} (G)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderPhaseStatus(s, 1)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderPhaseStatus(s, 2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditProfile(s)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Kemas Kini Profil"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setStatusModal(s);
                          setSelectedPhase(1);
                        }}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Tukar Status / Masalah Kesihatan"
                      >
                        <Stethoscope className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-sm font-bold uppercase tracking-widest">Tiada data murid.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Status Management Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">STATUS & PENGECUALIAN UJIAN</h3>
              <button onClick={() => setStatusModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-black uppercase mb-1">Nama Murid:</p>
                <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">{statusModal.nama}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih Fasa Terlibat</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 'Kekal'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPhase(p as any)}
                        className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                          selectedPhase === p 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white text-gray-400 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {p === 'Kekal' ? 'Kekal / Semua' : `Fasa ${p}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sebab Pengecualian / Status</label>
                  <select 
                    value={selectedNewStatus}
                    onChange={(e) => setSelectedNewStatus(e.target.value as StudentStatus)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Aktif">AKTIF (Normal)</option>
                    <option value="Masalah Kesihatan">MASALAH KESIHATAN</option>
                    <option value="Pindah Keluar">PINDAH KELUAR</option>
                    <option value="Pindah Masuk">PINDAH MASUK</option>
                    <option value="Dibuang">DIBUANG SEKOLAH</option>
                    <option value="Lain-lain">LAIN-LAIN SEBAB</option>
                  </select>
                </div>

                {selectedNewStatus !== 'Aktif' ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <p className="text-[9px] text-orange-800 font-bold uppercase leading-tight">Muat naik surat bukti rasmi untuk fasa yang dipilih.</p>
                    </div>
                    <label className="w-full flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-emerald-200 bg-emerald-50 text-emerald-700 rounded-3xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-emerald-100 transition-all group">
                      <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      Muat Naik Surat Bukti
                      <input type="file" accept="image/*,application/pdf" onChange={handleEvidenceUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <button 
                    onClick={() => { onUpdateStatus(statusModal.id, 'Aktif', undefined, selectedPhase); setStatusModal(null); }}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mt-4"
                  >
                    Set Semula Sebagai Aktif
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal */}
      {previewEvidence && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8">
           <button 
             onClick={() => setPreviewEvidence(null)} 
             className="absolute top-8 right-8 text-white hover:text-red-500 transition-colors"
           >
             <X className="w-10 h-10" />
           </button>
           <div className="bg-white p-4 rounded-3xl shadow-2xl max-w-4xl w-full h-full overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-4 p-2 border-b">
                 <FileText className="w-6 h-6 text-emerald-600" />
                 <h4 className="font-black text-sm uppercase tracking-widest text-gray-800">Paparan Surat Bukti</h4>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                 {previewEvidence.startsWith('data:image') ? (
                    <img src={previewEvidence} alt="Evidence" className="max-w-full max-h-full object-contain shadow-lg" />
                 ) : (
                    <div className="text-center p-12">
                       <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                       <p className="font-bold text-gray-500 uppercase tracking-widest">Dokumen Dikesan</p>
                       <a href={previewEvidence} download="SuratBukti.pdf" className="mt-4 inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Muat Turun Fail</a>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
