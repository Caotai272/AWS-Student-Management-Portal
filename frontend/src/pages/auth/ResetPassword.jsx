import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const code = location.state?.code || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Mật khẩu mới phải dài tối thiểu 8 ký tự')
    if (password !== confirmPassword) return setError('Mật khẩu xác nhận không khớp')

    setMessage('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.')
    setError('')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Đặt lại mật khẩu</h1>
        <p className="login-subtitle">Tạo mật khẩu mới cho tài khoản: {email}</p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  )
}
