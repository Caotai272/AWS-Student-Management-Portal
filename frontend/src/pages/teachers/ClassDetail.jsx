import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      const list = res.data.students || res.data || []
      setStudents(list.filter(s => s.className?.toLowerCase() === classId.toLowerCase()))
    } catch (e) {
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [classId])

  const handleRefresh = () => {
    load()
    setMessage('Đã đồng bộ lại danh sách sinh viên lớp.')
  }

  const filtered = students.filter(s => {
    const matchesSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
    const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter
    return matchesSearch && matchesGender
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={`Chi Tiết Lớp ${classId.toUpperCase()}`} />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 className="page-title" style={{ margin: 0 }}>Lớp Học {classId.toUpperCase()}</h2>
              <p className="page-description" style={{ margin: '4px 0 0' }}>Quản lý hoạt động học tập giảng dạy của lớp.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/grades" className="btn btn-outline">Xem điểm</Link>
              <Link to="/materials/upload" className="btn btn-outline">Đăng tài liệu</Link>
              <button className="btn btn-secondary" onClick={() => navigate('/classes')}>Quay lại</button>
            </div>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          {/* Subview: Danh sách sinh viên trong lớp */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Danh sách sinh viên trong lớp</h3>
              <button className="btn btn-outline btn-sm" onClick={handleRefresh}>Làm mới</button>
            </div>

            <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sinh viên..."
                style={{ flex: 1 }}
              />
              <select
                className="form-control"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{ maxWidth: '150px' }}
              >
                <option value="ALL">Tất cả giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>

            {loading ? (
              <p>Đang tải...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>Chưa có sinh viên nào khớp bộ lọc.</p>
            ) : (
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Giới tính</th>
                    <th>GPA</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.gender || '—'}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/students/${s.id || s.studentId}`} className="btn btn-sm btn-outline">Xem chi tiết</Link>
                          <Link to={`/students/${s.id || s.studentId}/edit`} className="btn btn-sm btn-primary">Chỉnh sửa</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
