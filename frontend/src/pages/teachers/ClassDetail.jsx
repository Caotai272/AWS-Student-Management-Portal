import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function ClassDetail() {
  const { classId } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => {
        const list = res.data.students || res.data || []
        // Lọc sinh viên thuộc lớp học này
        setStudents(list.filter(s => s.className?.toLowerCase() === classId.toLowerCase()))
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [classId])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={`Chi Tiết Lớp ${classId}`} />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Danh sách sinh viên trong lớp</h2>
              <p className="page-description">Lớp: {classId.toUpperCase()}</p>
            </div>
            <Link to="/grades/new" className="btn btn-primary">Nhập điểm lớp</Link>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : students.length === 0 ? (
            <div className="card"><p>Chưa có sinh viên nào được phân vào lớp này.</p></div>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>GPA</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/students/${s.id}`} className="btn btn-sm btn-outline">Hồ sơ</Link>
                          <Link to={`/students/${s.id}/edit`} className="btn btn-sm btn-primary">Sửa thông tin</Link>
                        </div>
                      </td>
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
