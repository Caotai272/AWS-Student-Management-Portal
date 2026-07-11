import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { getMaterials } from '../../services/materialService'
import { getUserRole } from '../../services/authService'
import api from '../../services/api'

const TYPE_LABEL = {
  slide: 'Slide bài giảng',
  exercise: 'Bài tập',
  exam: 'Đề thi',
  reference: 'Tài liệu tham khảo',
  other: 'Khác'
}

export default function StudentMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const role = getUserRole() || 'Student'
  const isTeacherOrStaff = role === 'Staff' || role === 'Teacher'

  const load = () => {
    setLoading(true)
    getMaterials()
      .then((res) => setMaterials(res.data.materials || res.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới danh sách tài liệu.')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materials/${id}`)
      setMessage('Đã xóa tài liệu thành công.')
      load()
    } catch (e) {
      setMessage('Lỗi khi xóa tài liệu.')
    }
  }

  const filtered = materials.filter(m => {
    const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <Layout title="Learning Materials">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Tài liệu học tập</h1>
          <p className="page-description">Tải xuống các slide bài giảng và tài liệu môn học.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isTeacherOrStaff && (
            <Link to="/materials/upload" className="btn btn-primary">
              <Plus size={16} /> Đăng tài liệu
            </Link>
          )}
          <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
        </div>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm tài liệu (môn học, tên...)"
          style={{ flex: 1 }}
        />
        <select
          className="form-control"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ maxWidth: '180px' }}
        >
          <option value="ALL">Tất cả loại tài liệu</option>
          <option value="slide">Slide bài giảng</option>
          <option value="exercise">Bài tập</option>
          <option value="exam">Đề thi</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có tài liệu</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Tiêu đề</th><th>Môn</th><th>Loại</th><th>File</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{m.subject}</td>
                  <td>{TYPE_LABEL[m.type] || m.type}</td>
                  <td><FileText size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />{m.fileName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a className="btn btn-primary btn-icon" href={m.fileUrl} target="_blank" rel="noreferrer" title="Tải xuống"><Download size={16} />Tải xuống</a>
                      <Link to={`/materials/${m.id}`} className="btn btn-sm btn-outline" title="Xem chi tiết"><Eye size={14} />Xem chi tiết</Link>
                      {isTeacherOrStaff && (
                        <>
                          <Link to={`/materials/${m.id}/edit`} className="btn btn-sm btn-secondary" title="Sửa tài liệu"><Pencil size={14} />Chỉnh sửa</Link>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}><Trash2 size={14} />Xóa</button>
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
    </Layout>
  )
}
