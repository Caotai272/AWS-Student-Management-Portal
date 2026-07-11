import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword.length < 8) return setError('Mật khẩu mới phải dài tối thiểu 8 ký tự')
    if (newPassword !== confirmPassword) return setError('Mật khẩu xác nhận không khớp')

    // Simulate Cognito password change
    setMessage('Đổi mật khẩu thành công!')
    setError('')
    setTimeout(() => {
      navigate('/profile')
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Đổi Mật Khẩu" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác nhận đổi mật khẩu</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
