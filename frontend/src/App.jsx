// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { login, getSessionTokens } from './services/authService'
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

// Demo account - mỗi lần khởi chạy sẽ đăng nhập lại
const DEMO_USERNAME = 'admin@example.com'
const DEMO_PASSWORD = 'Abc12345!'

function AppInit({ children }) {
  const [authState, setAuthState] = useState('initializing') // 'initializing' | 'authenticated' | 'login-needed'

  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('Đang đăng nhập tự động...')
        await login(DEMO_USERNAME, DEMO_PASSWORD)
        await getSessionTokens()
        setAuthState('authenticated')
      } catch (err) {
        console.error('Đăng nhập tự động thất bại:', err)
        setAuthState('login-needed')
      }
    }

    autoLogin()
  }, [])

  if (authState === 'initializing') {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">AWS Student Portal</h1>
          <p className="login-subtitle">Đang khởi tạo...</p>
        </div>
      </div>
    )
  }

  if (authState === 'login-needed') {
    return children
  }

  // authenticated - render protected routes
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
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
      </AppInit>
    </BrowserRouter>
  )
}
