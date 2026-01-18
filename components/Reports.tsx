
import React, { useState } from 'react';
import { Student, TeacherSettings, StudentStatus } from '../types';
import { TINGKATAN_OPTIONS, GET_KELAS_BY_TINGKATAN } from '../constants';
import { Printer, Filter, School, FileDown, ShieldCheck, Loader2, Info, FileCheck } from 'lucide-react';

interface ReportsProps {
  students: Student[];
  teacherSettings: TeacherSettings;
}

const Reports: React.FC<ReportsProps> = ({ students, teacherSettings }) => {
  const [reportType, setReportType] = useState<'Kelas' | 'Tingkatan' | 'Sekolah'>('Kelas');
  const [targetForm, setTargetForm] = useState('1');
  const [targetClass, setTargetClass] = useState('A');
  const [targetPhase, setTargetPhase] = useState<'Fasa 1' | 'Fasa 2'>('Fasa 1');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredStudents = students.filter(s => {
    if (reportType === 'Sekolah') return true;
    if (reportType === 'Tingkatan') return s.tingkatan === targetForm;
    return s.tingkatan === targetForm && s.kelas === targetClass;
  }).sort((a, b) => a.nama.localeCompare(b.nama));

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const html2pdf = (window as any).html2pdf;
    
    if (!html2pdf) {
      alert("Sistem penjanaan PDF sedang dimuatkan. Sila tunggu sebentar.");
      setIsGenerating(false);
      return;
    }

    const element = document.getElementById('report-container-main');
    const filename = `LAPORAN_SEGAK_${targetPhase.replace(/\s/g, '')}_${targetForm}${reportType === 'Kelas' ? targetClass : ''}.pdf`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
      html2pdf().from(element).set(opt).save().then(() => {
        setIsGenerating(false);
      }).catch((err: any) => {
        console.error(err);
        setIsGenerating(false);
      });
    }, 500);
  };

  const getStatusShortCode = (status: StudentStatus) => {
    switch (status) {
      case 'Aktif': return '';
      case 'Masalah Kesihatan': return 'MK';
      case 'Pindah Keluar': return 'PK';
      case 'Pindah Masuk': return 'PM';
      case 'Dibuang': return 'DS';
      case 'Lain-lain': return 'LL';
      default: return 'TB';
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="no-print bg-white p-8 rounded-3xl shadow-xl border border-emerald-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Penjana Laporan & Arkib</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Status MK (Masalah Kesihatan) akan terpapar dalam laporan rasmi</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jenis Laporan</label>
            <select 
              value={reportType}
              onChange={e => setReportType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 font-bold text-gray-700"
            >
              <option value="Kelas">MENGIKUT KELAS</option>
              <option value="Tingkatan">MENGIKUT TINGKATAN</option>
              <option value="Sekolah">KESELURUHAN SEKOLAH</option>
            </select>
          </div>

          {reportType !== 'Sekolah' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tingkatan</label>
              <select 
                value={targetForm}
                onChange={e => setTargetForm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 font-bold text-gray-700"
              >
                {TINGKATAN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {reportType === 'Kelas' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kelas</label>
              <select 
                value={targetClass}
                onChange={e => setTargetClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 font-bold text-gray-700"
              >
                {GET_KELAS_BY_TINGKATAN(targetForm).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fasa Ujian</label>
            <select 
              value={targetPhase}
              onChange={e => setTargetPhase(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 font-bold text-gray-700"
            >
              <option value="Fasa 1">FASA 1 (PENGGAL 1)</option>
              <option value="Fasa 2">FASA 2 (PENGGAL 2)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`flex items-center justify-center gap-3 ${isGenerating ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest`}
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Menjana PDF...</>
            ) : (
              <><FileDown className="w-5 h-5" /> Muat Turun PDF (Automatik)</>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
          >
            <Printer className="w-5 h-5" /> Cetak Salinan
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div id="report-container-main" className="p-8 bg-white">
          <div className="flex items-center gap-8 mb-6 pb-6 border-b-4 border-double border-black">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
               {teacherSettings.logo ? (
                  <img src={teacherSettings.logo} alt="School Logo" className="w-full h-full object-contain" />
               ) : (
                  <School className="w-16 h-16 text-gray-300" />
               )}
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-black uppercase leading-tight">SMK SUNGAI KARANGAN</h1>
              <p className="text-[9px] font-bold uppercase text-gray-600 italic tracking-widest mt-1">09410 PADANG SERAI, KEDAH DARUL AMAN</p>
              <div className="mt-4 inline-block px-6 py-1.5 border-2 border-black bg-gray-50">
                <h2 className="text-sm font-black uppercase">LAPORAN ANALISIS UJIAN SEGAK - {targetPhase.toUpperCase()}</h2>
              </div>
            </div>
            <div className="w-20 h-20 invisible"></div>
          </div>

          <table className="w-full text-[9px] border-collapse border border-black mb-10">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-1 text-center w-[30px]" rowSpan={2}>BIL</th>
                <th className="border border-black p-1 text-left" rowSpan={2}>NAMA MURID & NO. KAD PENGENALAN</th>
                <th className="border border-black p-1 text-center w-[50px]" rowSpan={2}>STATUS</th>
                <th className="border border-black p-1 text-center" colSpan={7}>KOMPONEN UJIAN SEGAK</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-center w-[40px] text-[7px]">TINGGI(m)</th>
                <th className="border border-black p-1 text-center w-[40px] text-[7px]">BERAT(kg)</th>
                <th className="border border-black p-1 text-center w-[35px] text-[7px]">BMI</th>
                <th className="border border-black p-1 text-center text-[7px]">NAIK TURUN</th>
                <th className="border border-black p-1 text-center text-[7px]">TEKAN TUBI</th>
                <th className="border border-black p-1 text-center text-[7px]">RINGKUK TUBI</th>
                <th className="border border-black p-1 text-center text-[7px]">JANGKAUAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => {
                const phaseStatus = targetPhase === 'Fasa 1' ? (s.statusFasa1 || s.status) : (s.statusFasa2 || s.status);
                const data = targetPhase === 'Fasa 1' ? s.fasa1 : s.fasa2;
                const isNormal = phaseStatus === 'Aktif';
                
                return (
                  <tr key={s.id} className={`h-9 ${!isNormal ? 'bg-gray-50 italic' : ''}`}>
                    <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                    <td className="border border-black p-1 px-2 uppercase font-bold text-[8px]">
                      <div className="leading-tight">{s.nama}</div>
                      <div className="text-[7px] font-mono text-gray-500">{s.ic} ({s.jantina[0]})</div>
                    </td>
                    <td className="border border-black p-1 text-center font-black text-[7px] uppercase">
                      {phaseStatus}
                    </td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data ? (data.tinggi / 100).toFixed(2) : '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data?.berat || '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center font-black">{isNormal ? (data?.bmi || '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data?.naikTurunBangku || '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data?.tekanTubi || '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data?.ringkukTubiSepara || '-') : getStatusShortCode(phaseStatus)}</td>
                    <td className="border border-black p-1 text-center">{isNormal ? (data?.jangkauanMelunjur || '-') : getStatusShortCode(phaseStatus)}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={10} className="border border-black p-10 text-center italic text-gray-400 font-bold uppercase text-[9px]">Tiada rekod murid ditemui.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-8 text-[7px] font-black uppercase text-gray-500 grid grid-cols-3 gap-4 border p-2 border-dashed">
             <div>Kod Laporan:</div>
             <div className="grid grid-cols-2 gap-x-2">
                <span>MK: Masalah Kesihatan</span>
                <span>PK: Pindah Keluar</span>
                <span>PM: Pindah Masuk</span>
                <span>DS: Dibuang Sekolah</span>
             </div>
             <div className="text-right italic">Sila sertakan surat bukti dalam arkib fail SEGAK.</div>
          </div>

          <div className="mt-12 flex justify-between gap-10">
            <div className="flex-1 text-left border-t-2 border-black pt-2">
              <p className="font-black uppercase text-[8px]">DISEDIAKAN OLEH GURU PJPK</p>
              <p className="text-[10px] font-bold mt-4">( {teacherSettings.namaGuru || '................................................'} )</p>
            </div>
            <div className="flex-1 text-left border-t-2 border-black pt-2">
              <p className="font-black uppercase text-[8px]">DISEMAK OLEH GURU KELAS</p>
              <p className="text-[10px] font-bold mt-4">( {teacherSettings.namaGuruKelas || '................................................'} )</p>
            </div>
            <div className="flex-1 text-left border-t-2 border-black pt-2">
              <p className="font-black uppercase text-[8px]">DISAHKAN OLEH SETIAUSAHA SEGAK</p>
              <p className="text-[10px] font-bold mt-4">( {teacherSettings.namaSetiausaha || '................................................'} )</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
