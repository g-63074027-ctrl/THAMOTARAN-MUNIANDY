
import React, { useState, useEffect } from 'react';
import { Student, TestResult } from '../types';
import { CALCULATE_BMI } from '../constants';
import { ClipboardCheck, ArrowLeft, Activity, Ruler, Weight, Gauge, Info, Calculator, AlertTriangle } from 'lucide-react';

interface TestResultFormProps {
  student: Student;
  phase: 1 | 2;
  onSave: (result: TestResult) => void;
  onCancel: () => void;
}

const TestResultForm: React.FC<TestResultFormProps> = ({ student, phase, onSave, onCancel }) => {
  const existingResult = phase === 1 ? student.fasa1 : student.fasa2;

  const [formData, setFormData] = useState<TestResult>({
    tarikhUjian: existingResult?.tarikhUjian || new Date().toISOString().split('T')[0],
    tinggi: existingResult?.tinggi || 0,
    berat: existingResult?.berat || 0,
    bmi: existingResult?.bmi || 0,
    naikTurunBangku: existingResult?.naikTurunBangku || 0,
    tekanTubi: existingResult?.tekanTubi || 0,
    ringkukTubiSepara: existingResult?.ringkukTubiSepara || 0,
    jangkauanMelunjur: existingResult?.jangkauanMelunjur || 0,
  });

  useEffect(() => {
    // Formula BMI: Berat (kg) / [Tinggi (m) * Tinggi (m)]
    const bmi = CALCULATE_BMI(formData.berat, formData.tinggi);
    setFormData(prev => ({ ...prev, bmi }));
  }, [formData.berat, formData.tinggi]);

  const getBMIStatus = (bmi: number) => {
    if (bmi === 0) return { label: '-', color: 'text-gray-400' };
    if (bmi < 18.5) return { label: 'Kurang Berat Badan', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Berat Badan Normal', color: 'text-emerald-500' };
    if (bmi < 30) return { label: 'Berlebihan Berat Badan', color: 'text-orange-500' };
    return { label: 'Obesiti', color: 'text-red-500' };
  };

  const bmiStatus = getBMIStatus(formData.bmi);
  const tinggiDalamMeter = (formData.tinggi / 100).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm uppercase tracking-tight"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Senarai Murid
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 overflow-hidden">
        {/* Header Section */}
        <div className={`${phase === 1 ? 'bg-emerald-900' : 'bg-indigo-900'} p-8 text-white transition-colors duration-500`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${phase === 1 ? 'bg-emerald-500/20' : 'bg-indigo-500/20'} backdrop-blur-md rounded-2xl border border-white/20`}>
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">DATA UJIAN SEGAK</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${phase === 1 ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                    {phase === 1 ? 'FASA 1 (PENGGAL 1)' : 'FASA 2 (PENGGAL 2)'}
                  </span>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">• SESI {student.tahun}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <p className="text-[10px] text-white/60 font-black uppercase mb-1">Maklumat Murid</p>
              <p className="font-bold text-lg uppercase">{student.nama}</p>
              <p className="text-xs font-mono text-white/80">{student.ic} • {student.tingkatan}{student.kelas}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Section 1: Komposisi Badan & BMI Pintar */}
          <section className="space-y-6">
            <div className={`flex items-center gap-2 border-l-4 ${phase === 1 ? 'border-emerald-500' : 'border-indigo-500'} pl-4`}>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">1. Indeks Jisim Badan (BMI) - Kiraan Automatik</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Tarikh Ujian
                </label>
                <input
                  required
                  type="date"
                  value={formData.tarikhUjian}
                  onChange={e => setFormData({ ...formData, tarikhUjian: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <Ruler className="w-3 h-3" /> Tinggi (cm)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={formData.tinggi || ''}
                  onChange={e => setFormData({ ...formData, tinggi: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-black text-lg text-gray-700"
                  placeholder="0.0"
                />
                <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <Calculator className="w-2.5 h-2.5" /> = {tinggiDalamMeter} Meter (m)
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <Weight className="w-3 h-3" /> Berat (kg)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={formData.berat || ''}
                  onChange={e => setFormData({ ...formData, berat: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-black text-lg text-gray-700"
                  placeholder="0.0"
                />
              </div>

              <div className={`${phase === 1 ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'} p-4 rounded-2xl border flex flex-col justify-center relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Gauge className="w-12 h-12" />
                </div>
                <label className={`flex items-center gap-2 text-[9px] font-black ${phase === 1 ? 'text-emerald-600' : 'text-indigo-600'} uppercase tracking-wider mb-1`}>
                   BMI (Pandai Dikira)
                </label>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${phase === 1 ? 'text-emerald-900' : 'text-indigo-900'}`}>{formData.bmi}</span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">kg/m²</span>
                </div>
                <p className={`text-[10px] font-bold mt-1 ${bmiStatus.color}`}>
                  {bmiStatus.label}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-[10px] text-blue-800 font-medium">
                <strong>Sistem Pintar:</strong> Tinggi dalam <strong>CM</strong> ditukar secara automatik kepada <strong>Meter</strong> untuk formula: 
                <span className="bg-blue-100 px-1.5 py-0.5 rounded ml-1 font-bold">Berat / (Tinggi * Tinggi)</span>
              </p>
            </div>
          </section>

          {/* Section 2: Komponen Kecergasan */}
          <section className="space-y-6">
            <div className={`flex items-center gap-2 border-l-4 ${phase === 1 ? 'border-emerald-500' : 'border-indigo-500'} pl-4`}>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">2. Komponen Ujian Kecergasan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wide">Naik Turun Bangku 3 minit</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      value={formData.naikTurunBangku || ''}
                      onChange={e => setFormData({ ...formData, naikTurunBangku: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-2xl"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Kadar Nadi</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between items-center text-[11px] font-black text-gray-600 uppercase tracking-wide">
                    <span>{student.jantina === 'Lelaki' ? 'Tekan Tubi (Lelaki)' : 'Tekan Tubi Ubah Suai (Perempuan)'}</span>
                    <span className="text-[10px] text-red-500 font-bold">Maks: 40</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      max="40"
                      value={formData.tekanTubi || ''}
                      onChange={e => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > 40) val = 40;
                        setFormData({ ...formData, tekanTubi: val });
                      }}
                      className={`w-full px-4 py-4 rounded-xl border focus:ring-2 outline-none font-bold text-2xl transition-all ${formData.tekanTubi === 40 ? 'border-red-200 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-emerald-500'}`}
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Ulangan</span>
                  </div>
                  {formData.tekanTubi === 40 && (
                    <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Angka maksimum dicapai mengikut peraturan SEGAK.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <label className="flex justify-between items-center text-[11px] font-black text-gray-600 uppercase tracking-wide">
                    <span>Ringkuk Tubi Separa</span>
                    <span className="text-[10px] text-red-500 font-bold">Maks: 25</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      max="25"
                      value={formData.ringkukTubiSepara || ''}
                      onChange={e => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > 25) val = 25;
                        setFormData({ ...formData, ringkukTubiSepara: val });
                      }}
                      className={`w-full px-4 py-4 rounded-xl border focus:ring-2 outline-none font-bold text-2xl transition-all ${formData.ringkukTubiSepara === 25 ? 'border-red-200 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-emerald-500'}`}
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Ulangan</span>
                  </div>
                  {formData.ringkukTubiSepara === 25 && (
                    <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Angka maksimum dicapai mengikut peraturan SEGAK.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wide">Jangkauan Melunjur</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      value={formData.jangkauanMelunjur || ''}
                      onChange={e => setFormData({ ...formData, jangkauanMelunjur: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-2xl"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">CM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className={`flex-1 ${phase === 1 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white font-black py-5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest`}
            >
              <Activity className="w-5 h-5" />
              Simpan Rekod {phase === 1 ? 'Penggal 1' : 'Penggal 2'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-10 py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all uppercase text-sm tracking-widest"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestResultForm;
