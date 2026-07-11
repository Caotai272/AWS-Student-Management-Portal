import { Link } from 'react-router-dom'

export default function Forbidden() {
  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', color: 'var(--color-danger)', margin: 0 }}>403</h1>
        <h2 style={{ marginTop: 0 }}>Không Có Quyền Truy Cập!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Tài khoản của bạn không đủ quyền hạn để xem trang web này. Vui lòng liên hệ Admin để nâng cấp quyền truy cập.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Quay lại Trang Chủ
        </Link>
      </div>
    </div>
  )
}
