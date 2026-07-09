// src/pages/grades/TeacherGrades.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import Layout from '../../components/Layout'
import { getGrades } from '../../services/gradeService'

// Trang dành cho giáo viên: xem & đăng điểm của sinh viên.
// (teacherId lấy từ user đăng nhập; ở demo dùng input lọc tạm.)
export default function TeacherGrades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [teacherId, setTeacherId] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getGrades(teacherId ? { teacherId } : {})
      setGrades(res.data.grades || res.data || [])
    } catch (e) {
      setGrades([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const filtered = grades.filter((g) =>
    !search ||
    [g.studentId, g.subject, g.semester].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="Teacher Grades">
      <div className="page-header">
        <div>
          <h1 className="page-title">Điểm của tôi</h1>
          <p className="page-description">Đăng và quản lý điểm sinh viên theo bộ môn của bạn.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/grades/new')}><Plus size={16} /> Đăng điểm</button>
      </div>

      <div className="toolbar">
        <input className="form-input" placeholder="Mã giáo viên (lọc)" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} style={{ maxWidth: 200 }} />
        <input className="form-input" placeholder="Tìm kiếm mã SV, môn..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có điểm nào</div>
          <div className="empty-state-description">Nhấn "Đăng điểm" để thêm bản ghi điểm.</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Mã SV</th><th>Môn học</th><th>Học kỳ</th><th>Điểm</th><th>Ghi chú</th></tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>{g.studentId}</td>
                  <td>{g.subject}</td>
                  <td>{g.semester}</td>
                  <td><strong>{g.score}</strong></td>
                  <td>{g.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
