import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', color: 'var(--color-primary)', margin: 0 }}>404</h1>
        <h2 style={{ marginTop: 0 }}>Trang Không Tồn Tại!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi cấu trúc liên kết.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Quay lại Trang Chủ
        </Link>
      </div>
    </div>
  )
}
