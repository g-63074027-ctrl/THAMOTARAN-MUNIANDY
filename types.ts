
export type Jantina = 'Lelaki' | 'Perempuan';
export type StudentStatus = 'Aktif' | 'Pindah Masuk' | 'Pindah Keluar' | 'Dibuang' | 'Masalah Kesihatan' | 'Lain-lain';
export type UserRole = 'Admin' | 'Guru';

export interface User {
  id: string;
  userId: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface TestResult {
  tarikhUjian: string;
  tinggi: number;
  berat: number;
  bmi: number;
  naikTurunBangku: number;
  tekanTubi: number;
  ringkukTubiSepara: number;
  jangkauanMelunjur: number;
}

export interface TeacherSettings {
  namaGuru: string;
  namaGuruKelas: string;
  namaSetiausaha: string;
  tingkatanDiajar: string;
  kelasDiajar: string;
  logo?: string;
  cloudKey?: string;
  autoSync?: boolean;
}

export interface Student {
  id: string;
  nama: string;
  ic: string;
  jantina: Jantina;
  tingkatan: string;
  kelas: string;
  tahun: string;
  namaGuruPJPK: string;
  status: StudentStatus;
  suratBukti?: string;
  statusFasa1?: StudentStatus;
  suratBuktiFasa1?: string;
  statusFasa2?: StudentStatus;
  suratBuktiFasa2?: string;
  fasa1?: TestResult;
  fasa2?: TestResult;
  lastUpdated: number;
}

export enum ViewState {
  Dashboard = 'dashboard',
  AddStudent = 'add-student',
  EditStudent = 'edit-student',
  StudentList = 'student-list',
  EditTest = 'edit-test',
  Reports = 'reports',
  Settings = 'settings',
  UserManagement = 'user-management'
}
