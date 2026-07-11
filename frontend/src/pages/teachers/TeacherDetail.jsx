import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function TeacherDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const res = await api.get(`/teachers/${id}`)
        setTeacher(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTeacher()
  }, [id])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Giáo Viên" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : !teacher ? (
            <div className="card">Không tìm thấy thông tin giáo viên.</div>
          ) : (
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {teacher.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px 0' }}>{teacher.fullName}</h2>
                  <span className="badge badge-info">{teacher.teacherId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Email:</strong> <span style={{ float: 'right' }}>{teacher.email}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Số điện thoại:</strong> <span style={{ float: 'right' }}>{teacher.phone || 'Chưa cung cấp'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Khoa giảng dạy:</strong> <span style={{ float: 'right' }}>{teacher.department || 'N/A'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Môn học phụ trách:</strong> <span style={{ float: 'right' }}>{teacher.subject || 'N/A'}</span>
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/teachers')}>Quay lại</button>
                <Link to={`/teachers/${id}/edit`} className="btn btn-primary">Chỉnh sửa</Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
