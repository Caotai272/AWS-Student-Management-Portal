// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { login, getSessionTokens } from './services/authService'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyCode from './pages/auth/VerifyCode'
import ResetPassword from './pages/auth/ResetPassword'
import NewPassword from './pages/auth/NewPassword'

import Dashboard from './pages/Dashboard'
import Profile from './pages/common/Profile'
import ProfileEdit from './pages/common/ProfileEdit'
import ChangePassword from './pages/common/ChangePassword'
import Notifications from './pages/common/Notifications'

import StudentList from './pages/students/StudentList'
import StudentCreate from './pages/students/StudentCreate'
import StudentEdit from './pages/students/StudentEdit'
import StudentDetail from './pages/students/StudentDetail'
import UploadDocument from './pages/students/UploadDocument'
import StudentDocuments from './pages/students/StudentDocuments'

import TeacherList from './pages/teachers/TeacherList'
import TeacherCreate from './pages/teachers/TeacherCreate'
import TeacherDetail from './pages/teachers/TeacherDetail'
import TeacherEdit from './pages/teachers/TeacherEdit'

import GradeList from './pages/grades/GradeList'
import TeacherGrades from './pages/grades/TeacherGrades'
import GradeEdit from './pages/grades/GradeEdit'

import UploadMaterial from './pages/materials/UploadMaterial'
import StudentMaterials from './pages/materials/StudentMaterials'

import AdminUsers from './pages/admin/AdminUsers'
import AdminRoles from './pages/admin/AdminRoles'
import AdminLogs from './pages/admin/AdminLogs'
import AdminSettings from './pages/admin/AdminSettings'

import Forbidden from './pages/errors/Forbidden'
import NotFound from './pages/errors/NotFound'

// Demo account - mỗi lần khởi chạy sẽ đăng nhập lại
const DEMO_USERNAME = 'admin@example.com'
const DEMO_PASSWORD = 'Abc12345!'

function AppInit({ children }) {
  const [authState, setAuthState] = useState('initializing') // 'initializing' | 'authenticated' | 'login-needed'

  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('Đang đăng nhập tự động...')
        const result = await login(DEMO_USERNAME, DEMO_PASSWORD)
        if (result && result.isAlreadyAuthenticated) {
          console.log('✅ Đã đăng nhập sẵn')
        } else {
          console.log('✅ Đã đăng nhập thành công')
        }
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

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/notifications" element={<Notifications />} />
                  
                  <Route path="/students" element={<StudentList />} />
                  <Route path="/students/new" element={<StudentCreate />} />
                  <Route path="/students/:id" element={<StudentDetail />} />
                  <Route path="/students/:id/edit" element={<StudentEdit />} />
                  <Route path="/students/:id/documents" element={<StudentDocuments />} />
                  <Route path="/documents/upload" element={<UploadDocument />} />
                  
                  <Route path="/teachers" element={<TeacherList />} />
                  <Route path="/teachers/new" element={<TeacherCreate />} />
                  <Route path="/teachers/:id" element={<TeacherDetail />} />
                  <Route path="/teachers/:id/edit" element={<TeacherEdit />} />
                  
                  <Route path="/grades" element={<GradeList />} />
                  <Route path="/grades/:id/edit" element={<GradeEdit />} />
                  <Route path="/teacher-grades" element={<TeacherGrades />} />
                  
                  <Route path="/materials/upload" element={<UploadMaterial />} />
                  <Route path="/materials" element={<StudentMaterials />} />
                  
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/roles" element={<AdminRoles />} />
                  <Route path="/admin/logs" element={<AdminLogs />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  <Route path="/403" element={<Forbidden />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppInit>
    </BrowserRouter>
  )
}
