// src/pages/teachers/TeacherList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2, Search } from 'lucide-react'
import Layout from '../../components/Layout'
import ConfirmModal from '../../components/ConfirmModal'
import { getTeachers, deleteTeacher } from '../../services/testTeacherService'

export default function TeacherList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTeachers()
      setTeachers(res.data.teachers || res.data || [])
    } catch (e) {
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = teachers.filter((t) =>
    !search ||
    [t.teacherId, t.fullName, t.email, t.department].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteTeacher(toDelete.id || toDelete.teacherId)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Teachers">
      <div className="page-header">
        <div>
          <h1 className="page-title">Giáo viên</h1>
          <p className="page-description">Quản lý thông tin giáo viên trong hệ thống.</p>
        </div>
        <Link to="/teachers/new" className="btn btn-primary"><Plus size={16} /> Thêm giáo viên</Link>
      </div>

      <div className="toolbar">
        <input className="form-input" placeholder="Tìm kiếm theo tên, mã, email, bộ môn..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có giáo viên nào</div>
          <div className="empty-state-description">Nhấn "Thêm giáo viên" để tạo mới.</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Mã GV</th><th>Họ tên</th><th>Email</th><th>Bộ môn</th><th>Học vị</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id || t.teacherId}>
                  <td>{t.teacherId}</td>
                  <td><Link to={`/teachers/${t.id || t.teacherId}`} style={{ color: 'var(--color-primary)' }}>{t.fullName}</Link></td>
                  <td>{t.email}</td>
                  <td>{t.department}</td>
                  <td>{t.degree}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/teachers/${t.id || t.teacherId}`} className="btn btn-secondary btn-icon" title="Xem"><Eye size={16} /></Link>
                      <Link to={`/teachers/${t.id || t.teacherId}/edit`} className="btn btn-secondary btn-icon" title="Sửa"><Pencil size={16} /></Link>
                      <button className="btn btn-danger btn-icon" title="Xóa" onClick={() => setToDelete(t)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!toDelete} title="Xác nhận xóa" description={`Xóa giáo viên "${toDelete?.fullName || ''}"?`} confirmText="Xóa" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </Layout>
  )
}
