
import React, { useState, useEffect } from 'react';
import { Student, Jantina, TeacherSettings } from '../types';
import { TINGKATAN_OPTIONS, GET_KELAS_BY_TINGKATAN, YEAR_OPTIONS } from '../constants';
import { Save, UserPlus, ListPlus, Info, AlertCircle, CheckCircle2, Edit3, ArrowLeft } from 'lucide-react';

interface StudentFormProps {
  onSave: (student: Omit<Student, 'id'>) => void;
  onSaveBulk: (students: Omit<Student, 'id'>[]) => void;
  onUpdate?: (id: string, updatedData: Partial<Student>) => void;
  studentToEdit?: Student | null;
  teacherSettings: TeacherSettings;
  activeYear: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  onSave, onSaveBulk, onUpdate, studentToEdit, teacherSettings, activeYear 
}) => {
  const [regMode, setRegMode] = useState<'individu' | 'pukal'>('individu');
  
  const isEditMode = !!studentToEdit;

  // Individual Form State
  const [formData, setFormData] = useState({
    nama: '',
    ic: '',
    jantina: 'Lelaki' as Jantina,
    tingkatan: '1',
    kelas: 'A',
    tahun: activeYear,
    namaGuruPJPK: teacherSettings.namaGuru || ''
  });

  // Bulk Form State
  const [bulkText, setBulkText] = useState('');
  const [parsedStudents, setParsedStudents] = useState<any[]>([]);
  const [bulkMeta, setBulkMeta] = useState({
    tingkatan: '1',
    kelas: 'A',
    tahun: activeYear,
  });

  const availableClasses = GET_KELAS_BY_TINGKATAN(formData.tingkatan);
  const bulkAvailableClasses = GET_KELAS_BY_TINGKATAN(bulkMeta.tingkatan);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nama: studentToEdit.nama,
        ic: studentToEdit.ic,
        jantina: studentToEdit.jantina,
        tingkatan: studentToEdit.tingkatan,
        kelas: studentToEdit.kelas,
        tahun: studentToEdit.tahun,
        namaGuruPJPK: studentToEdit.namaGuruPJPK
      });
      setRegMode('individu');
    } else {
      setFormData(prev => ({ ...prev, tahun: activeYear }));
      setBulkMeta(prev => ({ ...prev, tahun: activeYear }));
    }
  }, [studentToEdit, activeYear]);

  // Parsing logic for bulk data
  useEffect(() => {
    if (regMode === 'pukal' && bulkText.trim()) {
      const rows = bulkText.split('\n');
      const detected = rows.map(row => {
        const cols = row.split(/[\t,|\s{2,}]/).map(c => c.trim()).filter(c => c !== "");
        if (cols.length >= 2) {
          const nama = cols[0].toUpperCase();
          const ic = cols[1].replace(/\D/g, '');
          let jantina: Jantina = 'Lelaki';
          
          if (cols[2]) {
            const g = cols[2].toUpperCase();
            if (g.startsWith('P') || g === 'PEREMPUAN') jantina = 'Perempuan';
          } else if (ic.length === 12) {
            const lastDigit = parseInt(ic.slice(-1));
            jantina = lastDigit % 2 === 0 ? 'Perempuan' : 'Lelaki';
          }

          return { nama, ic, jantina };
        }
        return null;
      }).filter(item => item !== null);
      
      setParsedStudents(detected);
    } else {
      setParsedStudents([]);
    }
  }, [bulkText, regMode]);

  const handleSubmitIndividu = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nama && formData.ic) {
      if (isEditMode && onUpdate && studentToEdit) {
        onUpdate(studentToEdit.id, formData);
      } else {
        onSave(formData);
        setFormData(prev => ({ ...prev, nama: '', ic: '' }));
      }
    }
  };

  const handleSubmitBulk = () => {
    if (parsedStudents.length > 0) {
      const studentsToSave = parsedStudents.map(s => ({
        ...s,
        tingkatan: bulkMeta.tingkatan,
        kelas: bulkMeta.kelas,
        tahun: bulkMeta.tahun,
        namaGuruPJPK: teacherSettings.namaGuru || 'GURU PJPK'
      }));
      onSaveBulk(studentsToSave);
      setBulkText('');
      setParsedStudents([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Switcher - Hidden in Edit Mode */}
      {!isEditMode && (
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-6 max-w-md mx-auto">
          <button
            onClick={() => setRegMode('individu')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
              regMode === 'individu' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Daftar Individu
          </button>
          <button
            onClick={() => setRegMode('pukal')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
              regMode === 'pukal' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ListPlus className="w-4 h-4" /> Daftar Pukal (Excel)
          </button>
        </div>
      )}

      {regMode === 'individu' ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-3 ${isEditMode ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'} rounded-full`}>
                {isEditMode ? <Edit3 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                  {isEditMode ? 'Kemas Kini Profil Murid' : 'Daftar Murid Individu'}
                </h2>
                {isEditMode && <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Meminda rekod pangkalan data</p>}
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 uppercase">
              SESI {formData.tahun}
            </div>
          </div>

          <form onSubmit={handleSubmitIndividu} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Penuh Murid</label>
              <input
                required
                type="text"
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold uppercase transition-all"
                placeholder="NAMA MENURUT KAD PENGENALAN"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. Kad Pengenalan</label>
                <input
                  required
                  type="text"
                  maxLength={12}
                  value={formData.ic}
                  onChange={e => setFormData({ ...formData, ic: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold"
                  placeholder="08051202XXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jantina</label>
                <select
                  value={formData.jantina}
                  onChange={e => setFormData({ ...formData, jantina: e.target.value as Jantina })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold bg-white"
                >
                  <option value="Lelaki">Lelaki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tingkatan</label>
                <select
                  value={formData.tingkatan}
                  onChange={e => setFormData({ ...formData, tingkatan: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold bg-white"
                >
                  {TINGKATAN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kelas</label>
                <select
                  value={formData.kelas}
                  onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none font-bold bg-white"
                >
                  {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                className={`flex-1 ${isEditMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'} text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest`}
              >
                {isEditMode ? <Save className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isEditMode ? 'Simpan Perubahan Profil' : `Daftar Murid Sesi ${activeYear}`}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-8 py-5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <ListPlus className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Daftar Pukal (Copy & Paste)</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Salin dari Excel dan tampal di bawah</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tingkatan</label>
                  <select 
                    value={bulkMeta.tingkatan} 
                    onChange={e => setBulkMeta({...bulkMeta, tingkatan: e.target.value})}
                    className="text-sm font-black bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 outline-none"
                  >
                    {TINGKATAN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kelas</label>
                  <select 
                    value={bulkMeta.kelas} 
                    onChange={e => setBulkMeta({...bulkMeta, kelas: e.target.value})}
                    className="text-sm font-black bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 outline-none"
                  >
                    {bulkAvailableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6 flex gap-3">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-[10px] text-emerald-800 leading-relaxed font-bold uppercase tracking-tight">
                <strong>Format Data:</strong> Nama [Tab] No. KP [Tab] Jantina (L/P). <br />
                Sistem akan mengesan jantina secara automatik jika tidak dinyatakan.
              </p>
            </div>

            <textarea
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              className="w-full h-48 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none font-mono text-sm leading-relaxed"
              placeholder="Contoh:&#10;AHMAD BIN ALI	080101015543	L&#10;SITI BINTI ABU	080202026654	P"
            />

            {parsedStudents.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Pra-paparan ({parsedStudents.length} murid dikesan)
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left text-[10px] uppercase font-bold">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 border-b tracking-widest">Nama</th>
                        <th className="px-4 py-3 border-b tracking-widest">No. KP</th>
                        <th className="px-4 py-3 border-b tracking-widest text-center">Jantina</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {parsedStudents.map((s, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-black">{s.nama}</td>
                          <td className="px-4 py-3 font-mono text-gray-500">{s.ic}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${s.jantina === 'Lelaki' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                              {s.jantina[0]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleSubmitBulk}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <Save className="w-5 h-5" /> Sahkan & Daftar Semua {parsedStudents.length} Murid
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
