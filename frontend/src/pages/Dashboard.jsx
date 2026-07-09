// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getStudents } from '../services/studentService'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data.students || res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [])

  const total = students.length
  const active = students.filter((s) => s.status === 'Active').length
  const documents = students.reduce((sum, s) => sum + (s.documents || 0), 0)
  const recent = students.slice(0, 5)

  const stats = [
    { label: 'Total Students', value: total },
    { label: 'Active Students', value: active },
    { label: 'Documents', value: documents },
    { label: 'Notifications', value: 0 }
  ]

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="card-title">Sinh viên gần đây</h2>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">Chưa có sinh viên nào</div>
                <div className="empty-state-description">
                  Nhấn <Link to="/students/new" className="btn btn-link" style={{ color: 'var(--color-primary)' }}>Thêm sinh viên</Link> để bắt đầu.
                </div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã SV</th>
                      <th>Họ tên</th>
                      <th>Ngành</th>
                      <th>Lớp</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((s) => (
                      <tr key={s.id || s.studentId}>
                        <td>{s.studentId}</td>
                        <td><Link to={`/students/${s.id || s.studentId}`} style={{ color: 'var(--color-primary)' }}>{s.fullName}</Link></td>
                        <td>{s.major}</td>
                        <td>{s.className}</td>
                        <td><StatusBadge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
