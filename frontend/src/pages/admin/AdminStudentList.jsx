import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function AdminStudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data.students || res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Sinh Viên Chỉ Đọc (Học thuật)" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Hồ Sơ Học Thuật Sinh Viên</h2>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã Sinh Viên</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Lớp học</th>
                    <th>Ngành học</th>
                    <th>GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.className || 'Chưa gán'}</td>
                      <td>{s.major}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
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
