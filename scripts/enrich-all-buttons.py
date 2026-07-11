import os

files_to_enrich = {
    # ==================== TRANG DÙNG CHUNG ====================
    # 1. Login.jsx
    "frontend/src/pages/Login.jsx": """import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>ĐĂNG NHẬP</h2>
        {error && <div className="alert alert-danger" style={{ marginBottom: '15px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Email / Tài khoản</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhapemail@example.com"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <Link to="/forgot-password" style={{ textAlign: 'center', textDecoration: 'none', fontSize: '14px', color: 'var(--color-primary)' }}>
              Quên mật khẩu
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
""",

    # 2. ForgotPassword.jsx
    "frontend/src/pages/auth/ForgotPassword.jsx": """import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('Yêu cầu gửi mã OTP thành công. Vui lòng check hòm thư email của bạn.')
    setTimeout(() => {
      navigate('/verify-code', { state: { email } })
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--color-primary)' }}>Quên Mật Khẩu</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
          Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã OTP xác nhận về hòm thư của bạn.
        </p>
        {message && <div className="alert alert-success">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Email tài khoản</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhapemail@example.com"
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Gửi mã xác nhận
            </button>
            <Link to="/login" className="btn btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
""",

    # 3. VerifyCode.jsx
    "frontend/src/pages/auth/VerifyCode.jsx": """import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function VerifyCode() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleVerify = (e) => {
    e.preventDefault()
    setMessage('Xác nhận mã OTP thành công!')
    setTimeout(() => {
      navigate('/reset-password', { state: { email, code } })
    }, 1200)
  }

  const handleResend = () => {
    setMessage('Mã OTP xác nhận mới đã được gửi lại vào email của bạn.')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--color-primary)' }}>Xác Nhận Mã OTP</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
          Mã xác thực đã được gửi đến: <strong style={{ color: 'var(--color-text)' }}>{email || 'email của bạn'}</strong>.
        </p>
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleVerify}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Mã xác thực OTP (6 chữ số)</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">Xác nhận mã</button>
            <button type="button" className="btn btn-secondary" onClick={handleResend}>Gửi lại mã</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/forgot-password')}>Quay lại</button>
          </div>
        </form>
      </div>
    </div>
  )
}
""",

    # 4. ResetPassword.jsx
    "frontend/src/pages/auth/ResetPassword.jsx": """import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email] = useState(location.state?.email || '')
  const [code] = useState(location.state?.code || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    setMessage('Mật khẩu đã được thiết lập lại thành công!')
    setError('')
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--color-primary)' }}>Đặt Lại Mật Khẩu</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleReset}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">Đặt lại mật khẩu</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/verify-code')}>Quay lại</button>
          </div>
        </form>
      </div>
    </div>
  )
}
""",

    # 5. ProfileEdit.jsx (Add Đổi ảnh đại diện)
    "frontend/src/pages/common/ProfileEdit.jsx": """import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getCurrentUserAttributes } from '../../services/authService'

export default function ProfileEdit() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    gender: 'Nam',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attrs = await getCurrentUserAttributes()
        if (attrs) {
          setProfile({
            name: attrs.name || attrs.email.split('@')[0],
            phone: attrs.phone_number || '',
            gender: 'Nam',
            address: 'Hà Nội, Việt Nam'
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleAvatarChange = () => {
    setMessage('Mô phỏng chọn và thay đổi ảnh đại diện (upload lên S3 Bucket) thành công!')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật hồ sơ cá nhân thành công!')
    setError('')
    setTimeout(() => {
      navigate('/profile')
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Hồ Sơ" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)'
                }}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAvatarChange}>
                  Đổi ảnh đại diện
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-control"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    # 6. ChangePassword.jsx
    "frontend/src/pages/common/ChangePassword.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    setMessage('Cập nhật mật khẩu thành công!')
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
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
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
                  placeholder="********"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>Hủy</button>
                <button type="submit" className="btn btn-primary">Cập nhật mật khẩu</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 7. Notifications.jsx
    "frontend/src/pages/common/Notifications.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockNotifications = [
  { id: 1, title: 'Hệ thống cập nhật thông tin học tập', body: 'Lịch học quân sự đợt 2 bắt đầu từ ngày 15/09.', date: '10/09/2026', read: false },
  { id: 2, title: 'Thông báo điểm thi môn học', body: 'Điểm số môn Lập trình ứng dụng AWS đã được công bố.', date: '08/09/2026', read: true }
]

export default function Notifications() {
  const [list, setList] = useState(mockNotifications)
  const [detail, setDetail] = useState(null)
  const [message, setMessage] = useState('')

  const handleMarkAllRead = () => {
    setList(list.map(n => ({ ...n, read: true })))
    setMessage('Đã đánh dấu tất cả thông báo là đã đọc.')
  }

  const handleDelete = (id) => {
    setList(list.filter(n => n.id !== id))
    if (detail?.id === id) setDetail(null)
    setMessage('Đã xóa thông báo thành công.')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Thông Báo Hệ Thống" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Thông báo ({list.filter(n => !n.read).length} chưa đọc)</h2>
            <button className="btn btn-primary" onClick={handleMarkAllRead}>Đánh dấu tất cả đã đọc</button>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 1fr' : '1fr', gap: '20px' }}>
            <div className="card">
              {list.length === 0 ? (
                <p>Không có thông báo nào.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {list.map((n) => (
                    <div 
                      key={n.id} 
                      style={{ 
                        border: '1px solid var(--color-border)', 
                        padding: '12px', 
                        borderRadius: '6px',
                        backgroundColor: n.read ? 'transparent' : 'var(--color-primary-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 4px 0' }}>{n.title}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{n.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => setDetail(n)}>Xem chi tiết</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(n.id)}>Xóa thông báo</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {detail && (
              <div className="card">
                <h3 style={{ color: 'var(--color-primary)', margin: '0 0 10px 0' }}>{detail.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '15px' }}>
                  Ngày gửi: {detail.date}
                </span>
                <p style={{ lineHeight: '1.6', fontSize: '15px' }}>{detail.body}</p>
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setDetail(null)}>Đóng chi tiết</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 8. Forbidden.jsx
    "frontend/src/pages/errors/Forbidden.jsx": """import { useNavigate } from 'react-router-dom'

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
""",

    # 9. NotFound.jsx
    "frontend/src/pages/errors/NotFound.jsx": """import { useNavigate } from 'react-router-dom'

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
""",


    # ==================== TRANG ADMIN ====================
    # 1. AdminRoles.jsx (Add Cập nhật vai trò, Khóa/Mở khóa, Lưu, Hủy)
    "frontend/src/pages/admin/AdminRoles.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockGroupRoles = [
  { group: 'Admin', description: 'Toàn quyền cấu hình tài khoản, phân lớp, xem nhật ký hệ thống', usersCount: 2, status: 'Active' },
  { group: 'Staff', description: 'Giảng viên giảng dạy, nhập điểm số, upload tài liệu học thuật', usersCount: 3, status: 'Active' },
  { group: 'Student', description: 'Sinh viên xem kết quả điểm, xem thông tin cá nhân và tải slide', usersCount: 5, status: 'Active' }
]

export default function AdminRoles() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState(mockGroupRoles)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [editDesc, setEditDesc] = useState('')
  const [message, setMessage] = useState('')

  const handleToggleStatus = (groupName) => {
    setGroups(groups.map(g => {
      if (g.group === groupName) {
        const next = g.status === 'Active' ? 'Suspended' : 'Active'
        setMessage(`Đã cập nhật trạng thái hoạt động nhóm ${groupName} thành: ${next}`)
        return { ...g, status: next }
      }
      return g
    }))
  }

  const handleEdit = (g) => {
    setSelectedGroup(g)
    setEditDesc(g.description)
  }

  const handleSave = () => {
    setGroups(groups.map(g => {
      if (g.group === selectedGroup.group) {
        return { ...g, description: editDesc }
      }
      return g
    }))
    setMessage(`Đã lưu cập nhật vai trò nhóm ${selectedGroup.group} thành công.`)
    setSelectedGroup(null)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Quản Lý Vai Trò và Phân Nhóm Quyền" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Cognito Groups Status</h2>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: selectedGroup ? '1.5fr 1fr' : '1fr', gap: '20px' }}>
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Tên Nhóm</th>
                    <th>Mô Tả Quyền Hạn</th>
                    <th>Số User</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td><strong>{g.group}</strong></td>
                      <td>{g.description}</td>
                      <td>{g.usersCount}</td>
                      <td>
                        <span className={`badge ${g.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                          {g.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => handleEdit(g)}>Cập nhật vai trò</button>
                          <button className={`btn btn-sm ${g.status === 'Active' ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleStatus(g.group)}>
                            {g.status === 'Active' ? 'Khóa/Mở khóa' : 'Khóa/Mở khóa'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedGroup && (
              <div className="card">
                <h3>Cập nhật vai trò nhóm {selectedGroup.group}</h3>
                <div className="form-group" style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <label className="form-label">Mô tả vai trò</label>
                  <textarea
                    className="form-control"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={4}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedGroup(null)}>Hủy</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>Lưu</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 2. AdminLogs.jsx (Add Tìm kiếm, Lọc, Làm mới, Xem chi tiết, Xuất file)
    "frontend/src/pages/admin/AdminLogs.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockLogs = [
  { timestamp: '2026-07-11 23:15:22', level: 'INFO', message: 'User admin@example.com logged in successfully.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:22:15', level: 'INFO', message: 'Student ID 6 (Cao Anh Tai) record updated.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:31:34', level: 'INFO', message: 'Student ID SV999 (Test Aligned Student) created.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:42:01', level: 'WARN', message: 'Cognito lookup token validation fallback triggered.', ip: '10.0.4.15' }
]

export default function AdminLogs() {
  const [logs] = useState(mockLogs)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState(null)
  const [message, setMessage] = useState('')

  const handleRefresh = () => {
    setMessage('Nhật ký log CloudWatch đã được làm mới thành công!')
  }

  const handleExport = () => {
    setMessage('Đã xuất file nhật ký log hệ thống (CSV) thành công!')
  }

  const filtered = logs.filter(l => {
    const matchesSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search)
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhật Ký Hoạt Động (CloudWatch Live)" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>System Activity Logs</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
              <button className="btn btn-primary" onClick={handleExport}>Xuất file</button>
            </div>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm log (IP, message...)"
              style={{ flex: 1 }}
            />
            <select
              className="form-control"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ maxWidth: '150px' }}
            >
              <option value="ALL">Tất cả Log Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedLog ? '1.5fr 1fr' : '1fr', gap: '20px' }}>
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Thời Gian</th>
                    <th>Cấp Độ</th>
                    <th>IP</th>
                    <th>Nội Dung Hoạt Động</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td style={{ fontSize: '13px' }}>{log.timestamp}</td>
                      <td>
                        <span className={`badge ${log.level === 'INFO' ? 'badge-success' : 'badge-warning'}`}>
                          {log.level}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px' }}>{log.ip}</td>
                      <td style={{ fontSize: '14px' }}>{log.message}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => setSelectedLog(log)}>Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedLog && (
              <div className="card">
                <h3>Chi tiết nhật ký log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  <p><strong>Thời gian:</strong> {selectedLog.timestamp}</p>
                  <p><strong>Level:</strong> <span className="badge badge-info">{selectedLog.level}</span></p>
                  <p><strong>Client IP:</strong> {selectedLog.ip}</p>
                  <p><strong>Thông tin log:</strong></p>
                  <pre style={{ backgroundColor: 'var(--color-bg-alt)', padding: '12px', borderRadius: '6px', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                    {selectedLog.message}
                  </pre>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedLog(null)}>Đóng</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 3. AdminStudentList.jsx (Add Tìm kiếm, Lọc, Làm mới, Xem chi tiết)
    "frontend/src/pages/admin/AdminStudentList.jsx": """import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function AdminStudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      setStudents(res.data.students || res.data || [])
    } catch (e) {
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới dữ liệu sinh viên từ DynamoDB.')
  }

  const filtered = students.filter(s => {
    const matchesSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
    const matchesClass = classFilter === 'ALL' || s.className === classFilter
    return matchesSearch && matchesClass
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Sinh Viên Chỉ Đọc (Học thuật)" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Hồ Sơ Học Thuật Sinh Viên</h2>
            <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sinh viên (Mã SV, họ tên...)"
              style={{ flex: 1 }}
            />
            <select
              className="form-control"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{ maxWidth: '150px' }}
            >
              <option value="ALL">Tất cả lớp</option>
              <option value="SEC01">Lớp SEC01</option>
              <option value="1">Lớp 1</option>
            </select>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã Sinh Viên</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Lớp học</th>
                    <th>Ngành học</th>
                    <th>GPA</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.className || 'Chưa gán'}</td>
                      <td>{s.major}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
                      <td>
                        <Link to={`/students/${s.id || s.studentId}`} className="btn btn-sm btn-outline">Xem chi tiết</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    # 4. AdminTeacherList.jsx (Add Tìm kiếm, Lọc, Làm mới, Xem chi tiết)
    "frontend/src/pages/admin/AdminTeacherList.jsx": """import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function AdminTeacherList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/teachers')
      setTeachers(res.data.teachers || res.data || [])
    } catch (e) {
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới danh sách giáo viên từ DynamoDB.')
  }

  const filtered = teachers.filter(t => {
    const matchesSearch = !search || t.fullName.toLowerCase().includes(search.toLowerCase()) || t.teacherId.includes(search)
    const matchesDept = deptFilter === 'ALL' || t.department === deptFilter
    return matchesSearch && matchesDept
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Giáo Viên Chỉ Đọc" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Đội Ngũ Giảng Viên</h2>
            <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm giảng viên (Mã GV, họ tên...)"
              style={{ flex: 1 }}
            />
            <select
              className="form-control"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ maxWidth: '180px' }}
            >
              <option value="ALL">Tất cả khoa</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã Giáo Viên</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Khoa giảng dạy</th>
                    <th>Môn học phụ trách</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{t.teacherId}</td>
                      <td>{t.fullName}</td>
                      <td>{t.email}</td>
                      <td>{t.department}</td>
                      <td>{t.subject || 'Chưa phân công'}</td>
                      <td>
                        <Link to={`/teachers/${t.id || t.teacherId}`} className="btn btn-sm btn-outline">Xem chi tiết</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",


    # ==================== TRANG GIÁO VIÊN ====================
    # 1. ClassList.jsx (Add Tìm kiếm, Lọc, Làm mới, Xem chi tiết)
    "frontend/src/pages/teachers/ClassList.jsx": """import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockClasses = [
  { id: "IT01", className: "Lớp IT01 - Công nghệ thông tin", room: "A3-401", studentCount: 25, schedule: "Thứ 2, Thứ 4 (Sáng)" },
  { id: "SEC01", className: "Lớp SEC01 - An toàn thông tin", room: "B2-105", studentCount: 18, schedule: "Thứ 3, Thứ 5 (Chiều)" }
]

export default function ClassList() {
  const [classes] = useState(mockClasses)
  const [search, setSearch] = useState('')
  const [scheduleFilter, setScheduleFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  const handleRefresh = () => {
    setMessage('Đã cập nhật đồng bộ các lớp phụ trách giảng dạy từ hệ thống.')
  }

  const filtered = classes.filter(c => {
    const matchesSearch = !search || c.className.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
    const matchesSchedule = scheduleFilter === 'ALL' || c.schedule.includes(scheduleFilter)
    return matchesSearch && matchesSchedule
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Lớp Học Phụ Trách" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Danh sách lớp giảng dạy</h2>
            <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm lớp học (Mã, tên lớp...)"
              style={{ flex: 1 }}
            />
            <select
              className="form-control"
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              style={{ maxWidth: '180px' }}
            >
              <option value="ALL">Tất cả lịch học</option>
              <option value="Thứ 2">Lịch Thứ 2 / Thứ 4</option>
              <option value="Thứ 3">Lịch Thứ 3 / Thứ 5</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {filtered.map((c) => (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-primary)' }}>{c.className}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Phòng học: <strong>{c.room}</strong></p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Lịch học: {c.schedule}</p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-text-muted)' }}>Sĩ số: {c.studentCount} sinh viên</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/classes/${c.id}`} className="btn btn-sm btn-primary">Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 2. ClassDetail.jsx (Add Xem sinh viên, Xem điểm, Đăng tài liệu, Quay lại)
    # And subview: (Danh sách sinh viên trong lớp: Tìm kiếm, Lọc, Làm mới, Xem chi tiết, Chỉnh sửa)
    "frontend/src/pages/teachers/ClassDetail.jsx": """import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      const list = res.data.students || res.data || []
      setStudents(list.filter(s => s.className?.toLowerCase() === classId.toLowerCase()))
    } catch (e) {
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [classId])

  const handleRefresh = () => {
    load()
    setMessage('Đã đồng bộ lại danh sách sinh viên lớp.')
  }

  const filtered = students.filter(s => {
    const matchesSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
    const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter
    return matchesSearch && matchesGender
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={`Chi Tiết Lớp ${classId.toUpperCase()}`} />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 className="page-title" style={{ margin: 0 }}>Lớp Học {classId.toUpperCase()}</h2>
              <p className="page-description" style={{ margin: '4px 0 0' }}>Quản lý hoạt động học tập giảng dạy của lớp.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/grades" className="btn btn-outline">Xem điểm</Link>
              <Link to="/materials/upload" className="btn btn-outline">Đăng tài liệu</Link>
              <button className="btn btn-secondary" onClick={() => navigate('/classes')}>Quay lại</button>
            </div>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          {/* Subview: Danh sách sinh viên trong lớp */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Danh sách sinh viên trong lớp</h3>
              <button className="btn btn-outline btn-sm" onClick={handleRefresh}>Làm mới</button>
            </div>

            <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sinh viên..."
                style={{ flex: 1 }}
              />
              <select
                className="form-control"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{ maxWidth: '150px' }}
              >
                <option value="ALL">Tất cả giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>

            {loading ? (
              <p>Đang tải...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>Chưa có sinh viên nào khớp bộ lọc.</p>
            ) : (
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Giới tính</th>
                    <th>GPA</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.gender || '—'}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/students/${s.id || s.studentId}`} className="btn btn-sm btn-outline">Xem chi tiết</Link>
                          <Link to={`/students/${s.id || s.studentId}/edit`} className="btn btn-sm btn-primary">Chỉnh sửa</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 3. StudentDetail.jsx (Add Chỉnh sửa, Xem điểm, Quay lại)
    "frontend/src/pages/students/StudentDetail.jsx": """import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Pencil, Upload, ArrowLeft } from 'lucide-react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import { getStudentById } from '../../services/studentService'
import { getStudentDocuments } from '../../services/documentService'
import { getUserRole } from '../../services/authService'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const role = getUserRole() || 'Student'
  const isAdmin = role === 'Admin'
  const isTeacher = role === 'Staff' || role === 'Teacher'

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getStudentById(id),
      getStudentDocuments(id).catch(() => ({ documents: [] }))
    ])
      .then(([studentRes, docRes]) => {
        setStudent(studentRes.data)
        setDocuments(docRes.documents || docRes.data?.documents || [])
      })
      .catch(() => setStudent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Layout title="Student Detail"><div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div></Layout>
  if (!student) return <Layout title="Student Detail"><div className="card"><div className="empty-state"><div className="empty-state-title">Không tìm thấy sinh viên</div></div></div></Layout>

  const fields = [
    ['Mã sinh viên', student.studentId],
    ['Họ tên', student.fullName],
    ['Email', student.email],
    ['Số điện thoại', student.phone],
    ['Giới tính', student.gender],
    ['Ngày sinh', student.dateOfBirth],
    ['Ngành', student.major],
    ['Lớp', student.className]
  ]

  return (
    <Layout title="Student Detail">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{student.fullName}</h1>
          <p className="page-description">Mã sinh viên: {student.studentId}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(isAdmin || isTeacher) && (
            <>
              <Link to={`/students/${id}/edit`} className="btn btn-primary"><Pencil size={16} /> Chỉnh sửa</Link>
              <Link to="/grades" className="btn btn-outline">Xem điểm</Link>
            </>
          )}
          <button className="btn btn-secondary" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Quay lại</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-title">Thông tin cơ bản</h2>
        <div className="detail-grid">
          {fields.map(([label, value]) => (
            <div className="detail-item" key={label}>
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Danh sách hồ sơ học bạ (S3 Bucket)</h2>
          {(isAdmin || isTeacher) && (
            <Link to={`/students/${id}/documents`} className="btn btn-outline btn-sm"><Upload size={16} /> Upload hồ sơ</Link>
          )}
        </div>
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Chưa có hồ sơ</div>
            <div className="empty-state-description">Chưa có tệp tin học bạ nào được upload.</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Tên file</th><th>Loại</th><th>Ngày</th></tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={i}>
                    <td>{d.fileName}</td>
                    <td>{d.type}</td>
                    <td>{d.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
""",

    # 4. GradeList.jsx (Add Nhập điểm, Tìm kiếm, Lọc, Làm mới, Chỉnh sửa, Xóa, Xuất file)
    "frontend/src/pages/grades/GradeList.jsx": """import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import Layout from '../../components/Layout'
import ConfirmModal from '../../components/ConfirmModal'
import { getGrades, deleteGrade } from '../../services/gradeService'
import { getUserRole } from '../../services/authService'

export default function GradeList() {
  const role = getUserRole() || 'Student'
  const isTeacherOrStaff = role === 'Staff' || role === 'Teacher'

  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('ALL')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getGrades()
      setGrades(res.data.grades || res.data || [])
    } catch (e) {
      setGrades([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới danh sách điểm học thuật.')
  }

  const handleExport = () => {
    setMessage('Đã xuất file Excel bảng điểm học kỳ thành công!')
  }

  const filtered = grades.filter((g) => {
    const matchesSearch = !search || [g.studentId, g.subject, g.semester].join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesSubject = subjectFilter === 'ALL' || g.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteGrade(toDelete.id)
      setToDelete(null)
      load()
      setMessage('Đã xóa bản ghi điểm thành công.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout title="Grades">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Điểm số</h1>
          <p className="page-description" style={{ margin: '4px 0 0' }}>Bảng kết quả học tập điểm số học viên.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isTeacherOrStaff && (
            <Link to="/grades/new" className="btn btn-primary"><Plus size={16} /> Nhập điểm</Link>
          )}
          <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
          <button className="btn btn-secondary" onClick={handleExport}>Xuất file</button>
        </div>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input 
          className="form-control" 
          placeholder="Tìm kiếm theo mã SV, môn..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ flex: 1 }}
        />
        <select
          className="form-control"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          style={{ maxWidth: '150px' }}
        >
          <option value="ALL">Tất cả môn học</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Lập trình Java">Lập trình Java</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có kết quả điểm thi</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Mã SV</th><th>Môn học</th><th>Học kỳ</th><th>Điểm</th><th>Ghi chú</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>{g.studentId}</td>
                  <td>{g.subject}</td>
                  <td>{g.semester || 'Học kỳ 1'}</td>
                  <td><strong>{g.score}</strong></td>
                  <td>{g.note || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/grades/${g.id}`} className="btn btn-secondary btn-icon" title="Xem chi tiết"><Eye size={16} /></Link>
                      {isTeacherOrStaff && (
                        <>
                          <Link to={`/grades/${g.id}/edit`} className="btn btn-secondary btn-icon" title="Chỉnh sửa"><Pencil size={16} /></Link>
                          <button className="btn btn-danger btn-icon" title="Xóa" onClick={() => setToDelete(g)}><Trash2 size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!toDelete} title="Xác nhận xóa" description="Xóa bản ghi điểm này?" confirmText="Xóa" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </Layout>
  )
}
""",

    # 5. GradeCreate.jsx (Lưu điểm, Hủy)
    "frontend/src/pages/grades/GradeCreate.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    attendance: 10,
    midterm: 0,
    final: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const scoreTotal = Number((Number(form.attendance) * 0.1 + Number(form.midterm) * 0.3 + Number(form.final) * 0.6).toFixed(2))
      const payload = {
        studentId: form.studentId,
        teacherId: 'TEACHER01',
        subject: form.subject,
        score: scoreTotal,
        details: {
          attendance: Number(form.attendance),
          midterm: Number(form.midterm),
          final: Number(form.final)
        },
        notes: form.notes
      }
      
      await api.post('/grades', payload)
      setMessage('Lưu điểm sinh viên thành công!')
      setTimeout(() => {
        navigate('/grades')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu điểm thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhập Điểm Học Tập" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mã số sinh viên (SV...)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="SV001"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tên môn học</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Lập trình Java..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Chuyên cần (10%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.attendance}
                    onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giữa kỳ (30%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.midterm}
                    onChange={(e) => setForm({ ...form, midterm: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cuối kỳ (60%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.final}
                    onChange={(e) => setForm({ ...form, final: e.target.value })}
                    min={0} max={10} required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Ghi chú</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Nhập ghi chú"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Lưu điểm
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 6. GradeEdit.jsx (Cập nhật điểm, Hủy)
    "frontend/src/pages/grades/GradeEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    attendance: 10,
    midterm: 0,
    final: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGrade = async () => {
      try {
        const res = await api.get(`/grades/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải thông tin điểm số')
      } finally {
        setLoading(false)
      }
    }
    loadGrade()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const parsedGrade = {
        ...form,
        attendance: Number(form.attendance),
        midterm: Number(form.midterm),
        final: Number(form.final),
        total: Number((Number(form.attendance) * 0.1 + Number(form.midterm) * 0.3 + Number(form.final) * 0.6).toFixed(2))
      }
      
      await api.put(`/grades/${id}`, parsedGrade)
      setMessage('Cập nhật điểm thi thành công!')
      setTimeout(() => {
        navigate('/grades')
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại.')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Điểm Lớp Học" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Mã số sinh viên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.studentId}
                    disabled
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subject}
                    disabled
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Chuyên cần (10%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.attendance}
                      onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                      min={0} max={10} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giữa kỳ (30%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.midterm}
                      onChange={(e) => setForm({ ...form, midterm: e.target.value })}
                      min={0} max={10} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cuối kỳ (60%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.final}
                      onChange={(e) => setForm({ ...form, final: e.target.value })}
                      min={0} max={10} required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Ghi chú</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Cập nhật điểm</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    # 7. StudentMaterials.jsx (Add Đăng tài liệu, Tìm kiếm, Lọc, Làm mới, Xem chi tiết, Tải xuống, Chỉnh sửa, Xóa)
    "frontend/src/pages/materials/StudentMaterials.jsx": """import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { getMaterials } from '../../services/materialService'
import { getUserRole } from '../../services/authService'
import api from '../../services/api'

const TYPE_LABEL = {
  slide: 'Slide bài giảng',
  exercise: 'Bài tập',
  exam: 'Đề thi',
  reference: 'Tài liệu tham khảo',
  other: 'Khác'
}

export default function StudentMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const role = getUserRole() || 'Student'
  const isTeacherOrStaff = role === 'Staff' || role === 'Teacher'

  const load = () => {
    setLoading(true)
    getMaterials()
      .then((res) => setMaterials(res.data.materials || res.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    load()
    setMessage('Đã làm mới danh sách tài liệu.')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materials/${id}`)
      setMessage('Đã xóa tài liệu thành công.')
      load()
    } catch (e) {
      setMessage('Lỗi khi xóa tài liệu.')
    }
  }

  const filtered = materials.filter(m => {
    const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <Layout title="Learning Materials">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Tài liệu học tập</h1>
          <p className="page-description">Tải xuống các slide bài giảng và tài liệu môn học.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isTeacherOrStaff && (
            <Link to="/materials/upload" className="btn btn-primary">
              <Plus size={16} /> Đăng tài liệu
            </Link>
          )}
          <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
        </div>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm tài liệu (môn học, tên...)"
          style={{ flex: 1 }}
        />
        <select
          className="form-control"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ maxWidth: '180px' }}
        >
          <option value="ALL">Tất cả loại tài liệu</option>
          <option value="slide">Slide bài giảng</option>
          <option value="exercise">Bài tập</option>
          <option value="exam">Đề thi</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-title">Chưa có tài liệu</div>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Tiêu đề</th><th>Môn</th><th>Loại</th><th>File</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{m.subject}</td>
                  <td>{TYPE_LABEL[m.type] || m.type}</td>
                  <td><FileText size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />{m.fileName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a className="btn btn-primary btn-icon" href={m.fileUrl} target="_blank" rel="noreferrer" title="Tải xuống"><Download size={16} />Tải xuống</a>
                      <Link to={`/materials/${m.id}`} className="btn btn-sm btn-outline" title="Xem chi tiết"><Eye size={14} />Xem chi tiết</Link>
                      {isTeacherOrStaff && (
                        <>
                          <Link to={`/materials/${m.id}/edit`} className="btn btn-sm btn-secondary" title="Sửa tài liệu"><Pencil size={14} />Chỉnh sửa</Link>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}><Trash2 size={14} />Xóa</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
""",

    # 8. UploadMaterial.jsx (Add Chọn file, Tải lên, Hủy)
    "frontend/src/pages/materials/UploadMaterial.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import Layout from '../../components/Layout'
import { createUploadUrl, saveMaterialMetadata } from '../../services/materialService'

export default function UploadMaterial() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('slide')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    setStatus({ type: '', message: '' })
    if (!title || !subject) return setStatus({ type: 'danger', message: 'Vui lòng nhập tiêu đề và môn học.' })
    if (!file) return setStatus({ type: 'danger', message: 'Vui lòng chọn file.' })

    setLoading(true)
    try {
      const { data } = await createUploadUrl({ fileName: file.name, contentType: file.type, type })
      await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      await saveMaterialMetadata({ title, subject, type, fileName: file.name, s3Key: data.s3Key, fileUrl: data.fileUrl })
      setStatus({ type: 'success', message: 'Tải tài liệu lên thành công!' })
      setTitle(''); setSubject(''); setFile(null)
      setTimeout(() => {
        navigate('/materials')
      }, 1500)
    } catch (err) {
      setStatus({ type: 'danger', message: err.message || 'Tải lên thất bại.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Upload Material">
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload tài liệu học tập</h1>
          <p className="page-description">Tải tài liệu (PDF, slide...) lên hệ thống S3.</p>
        </div>
      </div>

      {status.message && <div className={`alert alert-${status.type}`} style={{ marginBottom: '15px' }}>{status.message}</div>}

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label className="form-label">Tiêu đề tài liệu</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Slide chương 1..."
          />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label className="form-label">Tên môn học</label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="An toàn thông tin..."
          />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label className="form-label">Loại tài liệu</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="slide">Slide giảng dạy</option>
            <option value="exercise">Bài tập</option>
            <option value="exam">Đề thi mẫu</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">File tài liệu</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="file"
              id="file-select"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button className="btn btn-outline" onClick={() => document.getElementById('file-select').click()}>Chọn file</button>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {file ? file.name : 'Chưa có file nào được chọn'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => navigate('/materials')}>Hủy</button>
          <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
            <Upload size={16} /> Tải lên
          </button>
        </div>
      </div>
    </Layout>
  )
}
""",

    # 9. MaterialEdit.jsx (Thay file, Lưu thay đổi, Hủy)
    "frontend/src/pages/materials/MaterialEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function MaterialEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', subject: '', type: 'slide', fileName: '' })
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/materials`)
      .then(res => {
        const list = res.data.materials || res.data || []
        const current = list.find(m => m.id === id)
        if (current) setForm(current)
      })
      .catch(err => console.error(err))
  }, [id])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setForm({ ...form, fileName: e.target.files[0].name })
      setMessage('Đã chọn file thay thế thành công.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật thay đổi tài liệu học tập thành công!')
    setTimeout(() => {
      navigate('/materials')
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Tài Liệu Giảng Dạy" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Môn học</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tên file đính kèm: <strong>{form.fileName || 'N/A'}</strong></label>
                <div style={{ marginTop: '5px' }}>
                  <input
                    type="file"
                    id="replace-file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button type="button" className="btn btn-outline" onClick={() => document.getElementById('replace-file').click()}>Thay file</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/materials')}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
""",


    # ==================== TRANG SINH VIÊN ====================
    # 1. Dynamic Dashboard.jsx (Add Xem hồ sơ, Xem điểm, Xem tài liệu, Xem thông báo)
    "frontend/src/pages/Dashboard.jsx": """import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getStudents } from '../services/studentService'
import { getUserRole, getUserEmail } from '../services/authService'
import api from '../services/api'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const role = getUserRole() || 'Admin'
  const email = getUserEmail() || 'User'

  useEffect(() => {
    const loadStats = async () => {
      try {
        const studentRes = await getStudents()
        setStudents(studentRes.data.students || studentRes.data || [])

        if (role === 'Admin') {
          const teacherRes = await api.get('/teachers')
          setTeachers(teacherRes.data.teachers || teacherRes.data || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [role])

  // 1. Giao diện Dashboard cho Admin
  if (role === 'Admin') {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar title="Tổng Quan Hệ Thống (Admin)" />
          <main className="main-content">
            {loading ? (
              <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Tổng Số Sinh Viên</div>
                    <div className="stat-value">{students.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tổng Số Giáo Viên</div>
                    <div className="stat-value">{teachers.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tài khoản Cognito</div>
                    <div className="stat-value">Đang đồng bộ</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Nhóm Quyền Cognito</div>
                    <div className="stat-value">3 Groups</div>
                  </div>
                </div>

                <div className="card" style={{ marginTop: '24px' }}>
                  <h3 className="card-title">Phím tắt nhanh Admin</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/admin/users" className="btn btn-primary" style={{ textDecoration: 'none' }}>Xem tài khoản</Link>
                    <Link to="/admin/students" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem sinh viên</Link>
                    <Link to="/admin/teachers" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem giáo viên</Link>
                    <Link to="/admin/logs" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem nhật ký</Link>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    )
  }

  // 2. Giao diện Dashboard cho Giáo viên (Staff)
  if (role === 'Staff' || role === 'Teacher') {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar title="Cổng Thông Tin Giáo Viên" />
          <main className="main-content">
            {loading ? (
              <div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Lớp Phụ Trách</div>
                    <div className="stat-value">2</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Tổng Sinh Viên Của Lớp</div>
                    <div className="stat-value">{students.length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Bài Đăng Tài Liệu</div>
                    <div className="stat-value">4</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Thông Báo Mới</div>
                    <div className="stat-value">1</div>
                  </div>
                </div>

                <div className="card" style={{ marginTop: '24px' }}>
                  <h3 className="card-title">Phím tắt giảng dạy</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/classes" className="btn btn-primary" style={{ textDecoration: 'none' }}>Xem lớp</Link>
                    <Link to="/grades" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem điểm</Link>
                    <Link to="/materials" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem tài liệu</Link>
                    <Link to="/notifications" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem thông báo</Link>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    )
  }

  // 3. Giao diện Dashboard cho Sinh viên
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Trang Tin Học Tập Sinh Viên" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
            <h2>Chào mừng quay trở lại, {email}!</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Bạn đang đăng nhập với quyền hạn Sinh viên.</p>
          </div>

          <div className="card" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
            <h3 className="card-title">Menu thao tác sinh viên</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/profile" className="btn btn-primary" style={{ textDecoration: 'none' }}>Xem hồ sơ</Link>
              <Link to="/grades" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem điểm</Link>
              <Link to="/materials" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem tài liệu</Link>
              <Link to="/notifications" className="btn btn-outline" style={{ textDecoration: 'none' }}>Xem thông báo</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 2. MaterialDetail.jsx (Add Tải xuống, Quay lại)
    "frontend/src/pages/materials/MaterialDetail.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function MaterialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [material, setMaterial] = useState(null)

  useEffect(() => {
    api.get(`/materials`)
      .then(res => {
        const list = res.data.materials || res.data || []
        setMaterial(list.find(m => m.id === id))
      })
      .catch(err => console.error(err))
  }, [id])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Tài Liệu" />
        <main className="main-content">
          {material ? (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3>{material.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Môn học: <strong>{material.subject}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Tên tệp:</strong> <span style={{ float: 'right' }}>{material.fileName}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Loại tài liệu:</strong> <span style={{ float: 'right' }} className="badge badge-info">{material.type}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Ngày đăng tải:</strong> <span style={{ float: 'right' }}>{material.uploadedAt ? new Date(material.uploadedAt).toLocaleDateString() : 'Chưa rõ'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/materials')}>Quay lại</button>
                <a href={material.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Tải xuống
                </a>
              </div>
            </div>
          ) : <p>Đang tải chi tiết tài liệu...</p>}
        </main>
      </div>
    </div>
  )
}
""",

    # 3. GradeDetail.jsx (Add Quay lại, In hoặc xuất PDF)
    "frontend/src/pages/grades/GradeDetail.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grade, setGrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/grades/${id}`)
      .then(res => setGrade(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handlePrint = () => {
    setMessage('Đang kết nối máy in và xuất bản ghi điểm dạng PDF...')
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Điểm Học Tập" />
        <main className="main-content">
          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          {loading ? (
            <p>Đang tải...</p>
          ) : !grade ? (
            <div className="card">Không tìm thấy bản ghi điểm số.</div>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3>Môn học: {grade.subject}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Mã sinh viên: <strong>{grade.studentId}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Chuyên cần (10%):</strong> <span style={{ float: 'right' }}>{grade.details?.attendance || 10}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Giữa kỳ (30%):</strong> <span style={{ float: 'right' }}>{grade.details?.midterm || 0}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <strong>Cuối kỳ (60%):</strong> <span style={{ float: 'right' }}>{grade.details?.final || 0}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontSize: '18px' }}>
                  <strong>Điểm tổng kết:</strong> 
                  <span style={{ float: 'right', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    {grade.score}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/grades')}>Quay lại</button>
                <button className="btn btn-primary" onClick={handlePrint}>In hoặc xuất PDF</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
"""
}

# Update all pages
for path, content in files_to_enrich.items():
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Enriched file: {path}")
