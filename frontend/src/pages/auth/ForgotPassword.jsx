import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return setError('Vui lòng nhập email')
    
    // Simulate AWS Cognito forgotPassword call
    setMessage('Mã xác thực OTP đã được gửi đến email của bạn.')
    setError('')
    setTimeout(() => {
      navigate('/verify-code', { state: { email } })
    }, 2000)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Quên Mật Khẩu</h1>
        <p className="login-subtitle">Nhập email để nhận mã xác thực OTP</p>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Email đăng ký</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Gửi mã OTP
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '14px' }}>
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
