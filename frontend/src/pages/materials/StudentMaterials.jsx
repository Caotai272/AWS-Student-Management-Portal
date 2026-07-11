// src/pages/materials/StudentMaterials.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Plus } from 'lucide-react'
import Layout from '../../components/Layout'
import { getMaterials } from '../../services/materialService'
import { getUserRole } from '../../services/authService'

const TYPE_LABEL = {
  slide: 'Slide bài giảng',
  type: 'Slide bài giảng',
  exercise: 'Bài tập',
  exam: 'Đề thi',
  reference: 'Tài liệu tham khảo',
  other: 'Khác'
}

// Trang dành cho sinh viên: xem & tải tài liệu giáo viên đã đăng.
export default function StudentMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const role = getUserRole() || 'Student'
  const isTeacherOrStaff = role === 'Staff' || role === 'Teacher'

  useEffect(() => {
    getMaterials()
      .then((res) => setMaterials(res.data.materials || res.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Learning Materials">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tài liệu học tập</h1>
          <p className="page-description">Xem và tải tài liệu do giáo viên đăng tải.</p>
        </div>
        {isTeacherOrStaff && (
          <Link to="/materials/upload" className="btn btn-primary">
            <Plus size={16} /> Đăng tài liệu
          </Link>
        )}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : materials.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có tài liệu</div>
          <div className="empty-state-description">Giáo viên chưa đăng tải tài liệu nào.</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Tiêu đề</th><th>Môn</th><th>Loại</th><th>File</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{m.subject}</td>
                  <td>{TYPE_LABEL[m.type] || m.type}</td>
                  <td><FileText size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />{m.fileName}</td>
                  <td>
                    <a className="btn btn-primary btn-icon" href={m.fileUrl} target="_blank" rel="noreferrer" title="Tải xuống"><Download size={16} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
