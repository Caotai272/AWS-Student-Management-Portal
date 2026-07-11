import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--color-primary)', margin: 0 }}>404</h1>
      <h2>Trang không tồn tại!</h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '24px' }}>
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Quay lại</button>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Về trang chủ</button>
      </div>
    </div>
  )
}
