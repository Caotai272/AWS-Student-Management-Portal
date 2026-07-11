import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminUserEdit() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', role: 'Student', enabled: true })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setForm({
      email: username,
      role: username.includes('teacher') || username.includes('staff') ? 'Staff' : username.includes('admin') ? 'Admin' : 'Student',
      enabled: true
    })
  }, [username])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật quyền và trạng thái hoạt động trên Cognito thành công!')
    setTimeout(() => {
      navigate(`/admin/users/${username}`)
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Sửa Trạng Thái và Nhóm Quyền" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Email tài khoản</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  disabled
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Nhóm quyền hạn (Role)</label>
                <select
                  className="form-control"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Student">Sinh viên (Student)</option>
                  <option value="Staff">Giáo viên / Cán bộ (Staff)</option>
                  <option value="Admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="enabled"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="enabled" className="form-label" style={{ margin: 0 }}>Cho phép hoạt động (Enabled)</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate(`/admin/users/${username}`)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
