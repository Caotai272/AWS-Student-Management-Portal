// src/pages/StudentDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Pencil, Upload } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { getStudentById } from '../services/studentService'

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudentById(id)
      .then((res) => setStudent(res.data))
      .catch(() => setStudent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Layout title="Student Detail"><div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div></Layout>
  if (!student) return <Layout title="Student Detail"><div className="card"><div className="empty-state"><div className="empty-state-title">Không tìm thấy sinh viên</div></div></div></Layout>

  const fields = [
    ['Mã sinh viên', student.studentId],
    ['Họ tên', student.fullName],
    ['Email', student.email],
    ['Số điện thoại', student.phone],
    ['Giới tính', student.gender],
    ['Ngày sinh', student.dateOfBirth],
    ['Ngành', student.major],
    ['Lớp', student.className]
  ]

  const documents = student.documents || []

  return (
    <Layout title="Student Detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">{student.fullName}</h1>
          <p className="page-description">Mã sinh viên: {student.studentId}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={student.status} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-title">Thông tin cơ bản</h2>
        <div className="detail-grid">
          {fields.map(([label, value]) => (
            <div className="detail-item" key={label}>
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value || '—'}</span>
            </div>
          ))}
        </div>
        <div className="page-actions">
          <Link to={`/students/${id}/edit`} className="btn btn-primary"><Pencil size={16} /> Sửa thông tin</Link>
          <Link to="/documents/upload" className="btn btn-secondary"><Upload size={16} /> Upload hồ sơ</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Danh sách hồ sơ</h2>
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Chưa có hồ sơ</div>
            <div className="empty-state-description">Sinh viên này chưa upload tài liệu nào.</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Tên file</th><th>Loại</th><th>Ngày</th></tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={i}>
                    <td>{d.fileName}</td>
                    <td>{d.type}</td>
                    <td>{d.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
