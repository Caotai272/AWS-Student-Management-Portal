import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getStudents } from '../services/studentService'
import { getUserRole, getUserEmail } from '../services/authService'
import api from '../services/api'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const role = getUserRole() || 'Admin'
  const email = getUserEmail() || 'User'

  useEffect(() => {
    const loadStats = async () => {
      try {
        const studentRes = await getStudents()
        setStudents(studentRes.data.students || studentRes.data || [])

        if (role === 'Admin') {
          const teacherRes = await api.get('/teachers')
          setTeachers(teacherRes.data.teachers || teacherRes.data || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [role])

  // 1. Giao diện Dashboard cho Admin
  if (role === 'Admin') {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar title="Tổng Quan Hệ Thống (Admin)" />
          <main className="main-content">
            {loading ? (
              <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Tổng Số Sinh Viên</div>
                    <div className="stat-value">{students.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tổng Số Giáo Viên</div>
                    <div className="stat-value">{teachers.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tài khoản Cognito</div>
                    <div className="stat-value">Đang đồng bộ</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Nhóm Quyền Cognito</div>
                    <div className="stat-value">3 Groups</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                  <div className="card">
                    <h3 className="card-title">Giảng viên mới thêm</h3>
                    <table className="table" style={{ width: '100%' }}>
                      <thead>
                        <tr><th>Mã GV</th><th>Họ tên</th><th>Khoa</th></tr>
                      </thead>
                      <tbody>
                        {teachers.slice(0, 3).map((t, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                            <td>{t.teacherId}</td>
                            <td>{t.fullName}</td>
                            <td>{t.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Thao tác nhanh Admin</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Link to="/admin/users/create" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Tạo tài khoản mới (Cognito)
                      </Link>
                      <Link to="/admin/users" className="btn btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Xem tất cả tài khoản
                      </Link>
                      <Link to="/admin/logs" className="btn btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Xem CloudWatch Live Logs
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    )
  }

  // 2. Giao diện Dashboard cho Giáo viên (Staff)
  if (role === 'Staff' || role === 'Teacher') {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar title="Cổng Thông Tin Giáo Viên" />
          <main className="main-content">
            {loading ? (
              <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Lớp Phụ Trách</div>
                    <div className="stat-value">2</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tổng Sinh Viên Của Lớp</div>
                    <div className="stat-value">{students.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Bài Đăng Tài Liệu</div>
                    <div className="stat-value">4</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Thông Báo Mới</div>
                    <div className="stat-value">1</div>
                  </div>
                </div>

                <div className="card" style={{ marginTop: '24px' }}>
                  <h3 className="card-title font-semibold">Phím tắt giảng dạy</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/classes" className="btn btn-primary" style={{ textDecoration: 'none' }}>Quản lý lớp học</Link>
                    <Link to="/grades/new" className="btn btn-outline" style={{ textDecoration: 'none' }}>Nhập điểm thi</Link>
                    <Link to="/materials/upload" className="btn btn-outline" style={{ textDecoration: 'none' }}>Upload slide tài liệu</Link>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    )
  }

  // 3. Giao diện Dashboard cho Sinh viên
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Trang Tin Học Tập Sinh Viên" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
            <h2>Chào mừng quay trở lại, {email}!</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Bạn đang đăng nhập với quyền hạn Sinh viên.</p>
          </div>

          <div className="stats-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="stat-card">
              <div className="stat-label">Kết Quả Học Tập</div>
              <Link to="/grades" className="btn btn-link" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                Xem bảng điểm
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tài Liệu Học Tập</div>
              <Link to="/materials" className="btn btn-link" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                Tải slide bài giảng
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
