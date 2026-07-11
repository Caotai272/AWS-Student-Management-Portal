import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function VerifyCode() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.length < 6) return setError('Mã xác thực gồm 6 chữ số')

    setMessage('Xác nhận thành công! Chuyển hướng đến trang đặt lại mật khẩu.')
    setError('')
    setTimeout(() => {
      navigate('/reset-password', { state: { email, code } })
    }, 1500)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Nhập mã OTP</h1>
        <p className="login-subtitle">Mã xác thực đã được gửi đến: <strong>{email}</strong></p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Mã xác thực OTP</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="######"
              maxLength={6}
              style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  )
}
