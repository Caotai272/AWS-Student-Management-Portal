// src/pages/StudentList.jsx
import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { getStudents, deleteStudent } from '../../services/studentService'

const STATUS_FILTERS = ['All', 'Active', 'Inactive', 'Graduated', 'Warning']

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getStudents()
      setStudents(res.data.students || res.data || [])
    } catch (err) {
      console.error('Error loading students:', err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Bạn không có quyền truy cập danh sách sinh viên. Vui lòng đăng nhập lại.')
      } else {
        setError('Không thể tải danh sách sinh viên. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        [s.studentId, s.fullName, s.email, s.className]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [students, search, statusFilter])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteStudent(toDelete.id || toDelete.studentId)
      setToDelete(null)
      load()
    } catch (err) {
      console.error('Error deleting student:', err)
      setError('Không thể xóa sinh viên. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Students">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sinh viên</h1>
          <p className="page-description">Quản lý thông tin sinh viên trong hệ thống.</p>
        </div>
        <Link to="/students/new" className="btn btn-primary"><Plus size={16} /> Thêm sinh viên</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="toolbar">
        <input
          className="form-input"
          placeholder="Tìm kiếm theo tên, mã, email, lớp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: 180 }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'Tất cả trạng thái' : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-title">Chưa có sinh viên nào</div>
            <div className="empty-state-description">Nhấn "Thêm sinh viên" để tạo sinh viên đầu tiên.</div>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Lớp</th>
                <th>Ngành</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id || s.studentId}>
                  <td>{s.studentId}</td>
                  <td><Link to={`/students/${s.id || s.studentId}`} style={{ color: 'var(--color-primary)' }}>{s.fullName}</Link></td>
                  <td>{s.email}</td>
                  <td>{s.className}</td>
                  <td>{s.major}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/students/${s.id || s.studentId}`} className="btn btn-secondary btn-icon" title="Xem"><Eye size={16} /></Link>
                      <Link to={`/students/${s.id || s.studentId}/edit`} className="btn btn-secondary btn-icon" title="Sửa"><Pencil size={16} /></Link>
                      <button className="btn btn-danger btn-icon" title="Xóa" onClick={() => setToDelete(s)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa sinh viên "${toDelete?.fullName || ''}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </Layout>
  )
}
