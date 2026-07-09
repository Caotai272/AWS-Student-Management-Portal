// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentList from './pages/students/StudentList'
import StudentCreate from './pages/students/StudentCreate'
import StudentEdit from './pages/students/StudentEdit'
import StudentDetail from './pages/students/StudentDetail'
import UploadDocument from './pages/students/UploadDocument'
import TeacherList from './pages/teachers/TeacherList'
import TeacherCreate from './pages/teachers/TeacherCreate'
import GradeList from './pages/grades/GradeList'
import TeacherGrades from './pages/grades/TeacherGrades'
import UploadMaterial from './pages/materials/UploadMaterial'
import StudentMaterials from './pages/materials/StudentMaterials'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/new" element={<StudentCreate />} />
                <Route path="/students/:id" element={<StudentDetail />} />
                <Route path="/students/:id/edit" element={<StudentEdit />} />
                <Route path="/documents/upload" element={<UploadDocument />} />
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/teachers/new" element={<TeacherCreate />} />
                <Route path="/grades" element={<GradeList />} />
                <Route path="/grades/new" element={<GradeList />} />
                <Route path="/teacher-grades" element={<TeacherGrades />} />
                <Route path="/materials/upload" element={<UploadMaterial />} />
                <Route path="/materials" element={<StudentMaterials />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
