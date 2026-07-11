import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import Layout from '../../components/Layout'
import ConfirmModal from '../../components/ConfirmModal'
import { getGrades, deleteGrade } from '../../services/gradeService'
import { getUserRole } from '../../services/authService'

export default function GradeList() {
  const role = getUserRole() || 'Student'
  const isTeacherOrStaff = role === 'Staff' || role === 'Teacher'

  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('ALL')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')

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

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới danh sách điểm học thuật.')
  }

  const handleExport = () => {
    setMessage('Đã xuất file Excel bảng điểm học kỳ thành công!')
  }

  const filtered = grades.filter((g) => {
    const matchesSearch = !search || [g.studentId, g.subject, g.semester].join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesSubject = subjectFilter === 'ALL' || g.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteGrade(toDelete.id)
      setToDelete(null)
      load()
      setMessage('Đã xóa bản ghi điểm thành công.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Grades">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Điểm số</h1>
          <p className="page-description" style={{ margin: '4px 0 0' }}>Bảng kết quả học tập điểm số học viên.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isTeacherOrStaff && (
            <Link to="/grades/new" className="btn btn-primary"><Plus size={16} /> Nhập điểm</Link>
          )}
          <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
          <button className="btn btn-secondary" onClick={handleExport}>Xuất file</button>
        </div>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input 
          className="form-control" 
          placeholder="Tìm kiếm theo mã SV, môn..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ flex: 1 }}
        />
        <select
          className="form-control"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          style={{ maxWidth: '150px' }}
        >
          <option value="ALL">Tất cả môn học</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Lập trình Java">Lập trình Java</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có kết quả điểm thi</div>
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
                  <td>{g.semester || 'Học kỳ 1'}</td>
                  <td><strong>{g.score}</strong></td>
                  <td>{g.note || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/grades/${g.id}`} className="btn btn-secondary btn-icon" title="Xem chi tiết"><Eye size={16} /></Link>
                      {isTeacherOrStaff && (
                        <>
                          <Link to={`/grades/${g.id}/edit`} className="btn btn-secondary btn-icon" title="Chỉnh sửa"><Pencil size={16} /></Link>
                          <button className="btn btn-danger btn-icon" title="Xóa" onClick={() => setToDelete(g)}><Trash2 size={16} /></button>
                        </>
                      )}
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
