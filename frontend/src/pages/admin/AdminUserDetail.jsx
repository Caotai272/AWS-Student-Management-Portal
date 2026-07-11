import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminUserDetail() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Mock get user details
    setUser({
      username,
      email: username,
      status: 'CONFIRMED',
      groups: username.includes('teacher') || username.includes('staff') ? ['Staff'] : username.includes('admin') ? ['Admin'] : ['Student'],
      enabled: true,
      userCreateDate: new Date().toLocaleDateString(),
      userLastModifiedDate: new Date().toLocaleDateString()
    })
  }, [username])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Tài Khoản" />
        <main className="main-content">
          {user ? (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Thông tin tài khoản Cognito</h3>
                <span className={`badge ${user.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {user.enabled ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Email đăng nhập:</strong> <span style={{ float: 'right' }}>{user.email}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Trạng thái Cognito:</strong> <span style={{ float: 'right' }} className="badge badge-info">{user.status}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Nhóm quyền gắn liền:</strong> 
                  <span style={{ float: 'right' }}>
                    {user.groups.map((g, i) => (
                      <span key={i} className="badge badge-success" style={{ marginLeft: '4px' }}>{g}</span>
                    ))}
                  </span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Ngày khởi tạo:</strong> <span style={{ float: 'right' }}>{user.userCreateDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/admin/users')}>Quay lại</button>
                <Link to={`/admin/users/${username}/edit`} className="btn btn-primary">Chỉnh sửa</Link>
              </div>
            </div>
          ) : <p>Đang tải...</p>}
        </main>
      </div>
    </div>
  )
}
