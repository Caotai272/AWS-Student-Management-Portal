import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grade, setGrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/grades/${id}`)
      .then(res => setGrade(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handlePrint = () => {
    setMessage('Đang kết nối máy in và xuất bản ghi điểm dạng PDF...')
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Điểm Học Tập" />
        <main className="main-content">
          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          {loading ? (
            <p>Đang tải...</p>
          ) : !grade ? (
            <div className="card">Không tìm thấy bản ghi điểm số.</div>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3>Môn học: {grade.subject}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Mã sinh viên: <strong>{grade.studentId}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Chuyên cần (10%):</strong> <span style={{ float: 'right' }}>{grade.details?.attendance || 10}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Giữa kỳ (30%):</strong> <span style={{ float: 'right' }}>{grade.details?.midterm || 0}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Cuối kỳ (60%):</strong> <span style={{ float: 'right' }}>{grade.details?.final || 0}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontSize: '18px' }}>
                  <strong>Điểm tổng kết:</strong> 
                  <span style={{ float: 'right', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    {grade.score}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/grades')}>Quay lại</button>
                <button className="btn btn-primary" onClick={handlePrint}>In hoặc xuất PDF</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
