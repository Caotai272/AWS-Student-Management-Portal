import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function TeacherEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    subject: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const res = await api.get(`/teachers/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải thông tin giáo viên')
      } finally {
        setLoading(false)
      }
    }
    loadTeacher()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.put(`/teachers/${id}`, form)
      setMessage('Cập nhật thông tin giáo viên thành công!')
      setTimeout(() => {
        navigate(`/teachers/${id}`)
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Giáo Viên" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    disabled
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Khoa giảng dạy</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Môn học phụ trách</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate(`/teachers/${id}`)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
