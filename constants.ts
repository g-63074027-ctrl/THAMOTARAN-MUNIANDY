
export const TINGKATAN_OPTIONS = ['1', '2', '3', '4', '5'];

export const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

export const GET_KELAS_BY_TINGKATAN = (tingkatan: string): string[] => {
  if (['1', '2', '3'].includes(tingkatan)) {
    return ['A', 'B', 'C', 'D', 'E'];
  }
  if (['4', '5'].includes(tingkatan)) {
    return ['ST', 'A', 'B', 'C', 'D'];
  }
  return [];
};

export const CALCULATE_BMI = (weight: number, heightCm: number): number => {
  if (weight <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(2));
};

export const INITIAL_STUDENTS: any[] = [
  {
    id: '1',
    nama: 'AHMAD BIN ZULKIFLI',
    ic: '080101025543',
    jantina: 'Lelaki',
    tingkatan: '3',
    kelas: 'A',
    tahun: '2025',
    namaGuruPJPK: 'Cikgu Razak',
    fasa1: {
      tarikhUjian: '2025-03-15',
      tinggi: 165,
      berat: 55,
      bmi: 20.2,
      naikTurunBangku: 90,
      tekanTubi: 25,
      ringkukTubiSepara: 20,
      jangkauanMelunjur: 35
    }
  }
];
