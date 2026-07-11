import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    attendance: 10,
    midterm: 0,
    final: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGrade = async () => {
      try {
        const res = await api.get(`/grades/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải thông tin điểm số')
      } finally {
        setLoading(false)
      }
    }
    loadGrade()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const parsedGrade = {
        ...form,
        attendance: Number(form.attendance),
        midterm: Number(form.midterm),
        final: Number(form.final),
        total: Number((Number(form.attendance) * 0.1 + Number(form.midterm) * 0.3 + Number(form.final) * 0.6).toFixed(2))
      }
      
      await api.put(`/grades/${id}`, parsedGrade)
      setMessage('Cập nhật điểm thi thành công!')
      setTimeout(() => {
        navigate('/grades')
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại.')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Điểm Lớp Học" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Mã số sinh viên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.studentId}
                    disabled
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subject}
                    disabled
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
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Cập nhật điểm</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
