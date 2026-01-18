
import React, { useState, useEffect } from 'react';
import { Student, ViewState, TeacherSettings, User, StudentStatus } from './types';
import { INITIAL_STUDENTS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import TestResultForm from './components/TestResultForm';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Auth from './components/Auth';

const App: React.FC = () => {
  // --- AUTH & USER STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('segak_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('segak_users');
    if (saved) return JSON.parse(saved);
    // Default Admin
    return [{ id: 'admin-1', userId: 'admin', name: 'PENTADBIR SISTEM', password: 'admin5068', role: 'Admin' }];
  });

  // --- SETTINGS STATE ---
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(() => {
    const saved = localStorage.getItem('segak_settings');
    if (saved) return JSON.parse(saved);
    return {
      namaGuru: '', namaGuruKelas: '', namaSetiausaha: '',
      tingkatanDiajar: '1', kelasDiajar: 'A', logo: ''
    };
  });

  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return localStorage.getItem('segak_active_year') || new Date().getFullYear().toString();
  });

  // --- DATA STATE ---
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('segak_data_v3');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS.map(s => ({ ...s, status: 'Aktif', lastUpdated: Date.now() }));
  });

  // --- NAVIGATION STATE ---
  const [activeView, setActiveView] = useState<ViewState>(ViewState.Dashboard);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('segak_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('segak_data_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('segak_active_year', selectedYear);
  }, [selectedYear]);

  // Jaminan Keselamatan: Jika pengguna bukan Admin cuba akses Settings, hantar ke Dashboard
  useEffect(() => {
    if (activeView === ViewState.Settings && currentUser?.role !== 'Admin') {
      setActiveView(ViewState.Dashboard);
    }
  }, [activeView, currentUser]);

  // --- ACTIONS ---
  const handleUpdateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData, lastUpdated: Date.now() } : s));
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'status' | 'lastUpdated'>) => {
    const studentWithId: Student = { ...newStudent, id: Date.now().toString(), status: 'Aktif', lastUpdated: Date.now() };
    setStudents(prev => [...prev, studentWithId]);
    setActiveView(ViewState.StudentList);
  };

  const handleAddStudentsBulk = (newStudentsData: Omit<Student, 'id' | 'status' | 'lastUpdated'>[]) => {
    const now = Date.now();
    const studentsWithIds = newStudentsData.map((s, i) => ({ 
      ...s, 
      id: (now + i).toString(), 
      status: 'Aktif' as StudentStatus, 
      lastUpdated: now 
    }));
    setStudents(prev => [...prev, ...studentsWithIds]);
    setActiveView(ViewState.StudentList);
  };

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const userWithId = { ...newUser, id: Date.now().toString() };
    setUsers(prev => [...prev, userWithId]);
  };

  const handleDeleteUser = (id: string) => {
    if (users.find(u => u.id === id)?.role === 'Admin') {
      alert("Akaun Admin tidak boleh dipadam!");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const [editingStudent, setEditingStudent] = useState<{ student: Student; phase: 1 | 2 } | null>(null);
  const [studentToEditProfile, setStudentToEditProfile] = useState<Student | null>(null);

  if (!currentUser) {
    return <Auth onLogin={(u, p) => {
      const user = users.find(x => x.userId === u && x.password === p);
      if (user) { 
        setCurrentUser(user); 
        localStorage.setItem('segak_session', JSON.stringify(user)); 
        return true; 
      }
      return false;
    }} />;
  }

  const filteredStudents = students.filter(s => s.tahun === selectedYear);

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView}
      selectedYear={selectedYear}
      onYearChange={setSelectedYear}
      currentUser={currentUser}
      onLogout={() => { setCurrentUser(null); localStorage.removeItem('segak_session'); }}
    >
      {editingStudent ? (
        <TestResultForm 
          student={editingStudent.student} phase={editingStudent.phase} 
          onSave={(res) => {
            const field = editingStudent.phase === 1 ? 'fasa1' : 'fasa2';
            handleUpdateStudent(editingStudent.student.id, { [field]: res });
            setEditingStudent(null);
          }}
          onCancel={() => setEditingStudent(null)}
        />
      ) : activeView === ViewState.Dashboard ? (
        <Dashboard students={filteredStudents} />
      ) : activeView === ViewState.AddStudent ? (
        <StudentForm onSave={handleAddStudent} onSaveBulk={handleAddStudentsBulk} teacherSettings={teacherSettings} activeYear={selectedYear} />
      ) : activeView === ViewState.EditStudent ? (
        <StudentForm onUpdate={(id, data) => {
          handleUpdateStudent(id, data);
          setStudentToEditProfile(null);
          setActiveView(ViewState.StudentList);
        }} studentToEdit={studentToEditProfile} teacherSettings={teacherSettings} activeYear={selectedYear} onSave={()=>{}} onSaveBulk={()=>{}} />
      ) : activeView === ViewState.StudentList ? (
        <StudentList 
          students={filteredStudents} 
          onRecordTest={(s, p) => setEditingStudent({ student: s, phase: p })}
          onEditProfile={(s) => { setStudentToEditProfile(s); setActiveView(ViewState.EditStudent); }}
          onDelete={(id) => setStudents(prev => prev.filter(s => s.id !== id))}
          onUpdateStatus={(id, st) => handleUpdateStudent(id, { status: st })}
        />
      ) : activeView === ViewState.Reports ? (
        <Reports students={filteredStudents} teacherSettings={teacherSettings} />
      ) : activeView === ViewState.Settings && currentUser.role === 'Admin' ? (
        <Settings 
          settings={teacherSettings} 
          onSave={(s) => { 
            setTeacherSettings(s); 
            localStorage.setItem('segak_settings', JSON.stringify(s));
          }}
          users={users}
          currentUser={currentUser}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
          onRestoreData={(data) => {
             if (data && Array.isArray(data)) {
               setStudents(data);
               alert("Data berjaya dipulihkan!");
             }
          }}
          students={students}
        />
      ) : (
        <Dashboard students={filteredStudents} />
      )}
    </Layout>
  );
};

export default App;
