import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function AdminTeacherList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teachers')
      .then((res) => setTeachers(res.data.teachers || res.data || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Giáo Viên Chỉ Đọc" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Đội Ngũ Giảng Viên</h2>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã Giáo Viên</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Khoa giảng dạy</th>
                    <th>Môn học phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{t.teacherId}</td>
                      <td>{t.fullName}</td>
                      <td>{t.email}</td>
                      <td>{t.department}</td>
                      <td>{t.subject || 'Chưa phân công'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
