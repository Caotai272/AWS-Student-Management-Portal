import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Mật khẩu phải dài tối thiểu 8 ký tự')
    if (password !== confirmPassword) return setError('Mật khẩu xác nhận không khớp')

    setMessage('Đổi mật khẩu lần đầu thành công! Đang chuyển hướng đến Dashboard...')
    setError('')
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Đổi mật khẩu lần đầu</h1>
        <p className="login-subtitle">Tài khoản của bạn được khởi tạo bởi Admin, vui lòng đổi mật khẩu để tiếp tục</p>

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
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Xác nhận đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}
