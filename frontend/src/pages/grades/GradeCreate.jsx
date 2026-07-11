import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    attendance: 10,
    midterm: 0,
    final: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        studentId: form.studentId,
        teacherId: 'TEACHER01', // Mock teacher ID
        subject: form.subject,
        score: Number((Number(form.attendance) * 0.1 + Number(form.midterm) * 0.3 + Number(form.final) * 0.6).toFixed(2)),
        details: {
          attendance: Number(form.attendance),
          midterm: Number(form.midterm),
          final: Number(form.final)
        },
        notes: form.notes
      }
      
      await api.post('/grades', payload)
      setMessage('Nhập điểm sinh viên thành công!')
      setTimeout(() => {
        navigate('/grades')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Nhập điểm thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhập Điểm Học Tập" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mã số sinh viên (SV...)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="Nhập mã số sinh viên"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tên môn học</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Lập trình Java, Cơ sở dữ liệu..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Chuyên cần (10%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.attendance}
                    onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giữa kỳ (30%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.midterm}
                    onChange={(e) => setForm({ ...form, midterm: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cuối kỳ (60%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.final}
                    onChange={(e) => setForm({ ...form, final: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Ghi chú</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ghi chú thêm (nếu có)"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Nhập điểm'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
