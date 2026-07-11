import { useNavigate } from 'react-router-dom'

export default function Forbidden() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--color-danger)', margin: 0 }}>403</h1>
      <h2>Quyền truy cập bị từ chối!</h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '24px' }}>
        Bạn không có quyền hạn truy cập vào trang này. Vui lòng quay lại hoặc liên hệ quản trị viên.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Quay lại</button>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Về trang chủ</button>
      </div>
    </div>
  )
}
