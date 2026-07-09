// src/pages/grades/GradeList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2, Search } from 'lucide-react'
import Layout from '../../components/Layout'
import ConfirmModal from '../../components/ConfirmModal'
import { getGrades, deleteGrade } from '../../services/gradeService'

export default function GradeList() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getGrades()
      setGrades(res.data.grades || res.data || [])
    } catch (e) {
      setGrades([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = grades.filter((g) =>
    !search ||
    [g.studentId, g.teacherId, g.subject, g.semester].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteGrade(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Grades">
      <div className="page-header">
        <div>
          <h1 className="page-title">Điểm số</h1>
          <p className="page-description">Quản lý điểm của sinh viên.</p>
        </div>
        <Link to="/grades/new" className="btn btn-primary"><Plus size={16} /> Thêm điểm</Link>
      </div>

      <div className="toolbar">
        <input className="form-input" placeholder="Tìm kiếm theo mã SV, môn, học kỳ..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có điểm nào</div>
          <div className="empty-state-description">Nhấn "Thêm điểm" để nhập điểm đầu tiên.</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Mã SV</th><th>Môn học</th><th>Học kỳ</th><th>Điểm</th><th>Ghi chú</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>{g.studentId}</td>
                  <td>{g.subject}</td>
                  <td>{g.semester}</td>
                  <td><strong>{g.score}</strong></td>
                  <td>{g.note}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/grades/${g.id}`} className="btn btn-secondary btn-icon" title="Xem"><Eye size={16} /></Link>
                      <Link to={`/grades/${g.id}/edit`} className="btn btn-secondary btn-icon" title="Sửa"><Pencil size={16} /></Link>
                      <button className="btn btn-danger btn-icon" title="Xóa" onClick={() => setToDelete(g)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!toDelete} title="Xác nhận xóa" description="Xóa bản ghi điểm này?" confirmText="Xóa" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </Layout>
  )
}
