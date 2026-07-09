// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentList from './pages/StudentList'
import StudentCreate from './pages/StudentCreate'
import StudentEdit from './pages/StudentEdit'
import StudentDetail from './pages/StudentDetail'
import UploadDocument from './pages/UploadDocument'

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<StudentList />} />
                  <Route path="/students/new" element={<StudentCreate />} />
                  <Route path="/students/:id" element={<StudentDetail />} />
                  <Route path="/students/:id/edit" element={<StudentEdit />} />
                  <Route path="/documents/upload" element={<UploadDocument />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
