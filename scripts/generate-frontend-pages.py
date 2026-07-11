import os

pages = {
    # 1. Auth pages
    "frontend/src/pages/auth/ForgotPassword.jsx": """import { useState } from 'react'
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
""",

    "frontend/src/pages/auth/VerifyCode.jsx": """import { useState } from 'react'
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
              onChange={(e) => setCode(e.target.value.replace(/\\D/g, ''))}
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
""",

    "frontend/src/pages/auth/ResetPassword.jsx": """import { useState } from 'react'
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
""",

    "frontend/src/pages/auth/NewPassword.jsx": """import { useState } from 'react'
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
""",

    # 2. Common pages
    "frontend/src/pages/common/Profile.jsx": """import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getCurrentUserAttributes, getUserRole } from '../../services/authService'

export default function Profile() {
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    phone: '',
    gender: 'Nam',
    major: 'Công nghệ thông tin',
    status: 'Đang học'
  })
  const [loading, setLoading] = useState(true)
  const role = getUserRole() || 'Admin'

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attrs = await getCurrentUserAttributes()
        if (attrs) {
          setProfile(prev => ({
            ...prev,
            email: attrs.email || '',
            name: attrs.name || attrs.email || 'Hệ thống Admin',
            phone: attrs.phone_number || '0987654321'
          }))
        }
      } catch (e) {
        console.error('Lỗi load profile:', e)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Hồ Sơ Cá Nhân" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải thông tin cá nhân...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  margin: '0 auto 12px'
                }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h2>{profile.name}</h2>
                <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{role}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Email:</strong> <span style={{ float: 'right' }}>{profile.email}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Số điện thoại:</strong> <span style={{ float: 'right' }}>{profile.phone}</span>
                </div>
                {role === 'Student' && (
                  <>
                    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                      <strong>Ngành học:</strong> <span style={{ float: 'right' }}>{profile.major}</span>
                    </div>
                    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                      <strong>Trạng thái:</strong> <span style={{ float: 'right' }}>{profile.status}</span>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/profile/edit" className="btn btn-primary">Chỉnh sửa hồ sơ</Link>
                <Link to="/change-password" className="btn btn-outline">Đổi mật khẩu</Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

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
                  <button type="submit" className="btn btn-primary">Lưu thông tin</button>
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

    "frontend/src/pages/common/ChangePassword.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword.length < 8) return setError('Mật khẩu mới phải dài tối thiểu 8 ký tự')
    if (newPassword !== confirmPassword) return setError('Mật khẩu xác nhận không khớp')

    // Simulate Cognito password change
    setMessage('Đổi mật khẩu thành công!')
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
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác nhận đổi mật khẩu</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    "frontend/src/pages/common/Notifications.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockNotifications = [
  { id: 1, title: "Tài liệu mới đã được đăng tải", content: "Tài liệu môn Lập trình Web nâng cao đã được tải lên bởi Giáo viên.", time: "2 giờ trước", read: false },
  { id: 2, title: "Cập nhật điểm thi giữa kỳ", content: "Hệ thống đã cập nhật điểm thi môn Hệ quản trị CSDL cho lớp IT01.", time: "1 ngày trước", read: true },
  { id: 3, title: "Chào mừng tham gia Student Portal", content: "Tài khoản của bạn đã được khởi tạo thành công bởi Admin.", time: "3 ngày trước", read: true },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Thông Báo" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Hộp thư thông báo</h2>
            <button className="btn btn-outline" onClick={markAllAsRead}>Đánh dấu đã đọc tất cả</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(n => (
              <div 
                key={n.id} 
                className="card" 
                style={{ 
                  borderLeft: n.read ? '1px solid var(--color-border)' : '4px solid var(--color-primary)',
                  backgroundColor: n.read ? 'var(--color-surface)' : 'rgba(37, 99, 235, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontWeight: n.read ? '600' : '700' }}>{n.title}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>{n.content}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 3. Student Document page (specific router path `/students/:studentId/documents`)
    "frontend/src/pages/students/StudentDocuments.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudentById } from '../../services/studentService'
import { getStudentDocuments, uploadStudentDocument } from '../../services/documentService'

export default function StudentDocuments() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [student, setStudent] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('transcript')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentRes = await getStudentById(id)
        setStudent(studentRes.data)
        
        const docRes = await getStudentDocuments(id)
        setDocuments(docRes.data || [])
      } catch (err) {
        console.error(err)
        setError('Không thể tải hồ sơ sinh viên.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setError('Vui lòng chọn file cần upload')

    setUploading(true)
    setError('')
    setMessage('')
    try {
      await uploadStudentDocument(id, file, fileType)
      setMessage('Tải hồ sơ lên S3 thành công!')
      setFile(null)
      
      // Reload documents list
      const docRes = await getStudentDocuments(id)
      setDocuments(docRes.data || [])
    } catch (err) {
      console.error(err)
      setError('Upload thất bại: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Quản Lý Hồ Sơ Sinh Viên" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card">
                <h3>Hồ sơ học tập sinh viên: {student?.fullName} ({student?.studentId})</h3>
                <p style={{ margin: 0 }}>Ngành: {student?.major || 'N/A'} | Lớp: {student?.className || 'N/A'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* Upload Form */}
                <div className="card">
                  <h4>Tải lên hồ sơ mới</h4>
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleUpload}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label className="form-label">Chọn tệp (PDF, JPG, PNG)</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label">Loại hồ sơ</label>
                      <select
                        className="form-control"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                      >
                        <option value="transcript">Bảng điểm</option>
                        <option value="id_card">CCCD/CMND</option>
                        <option value="diploma">Bằng tốt nghiệp</option>
                        <option value="other">Hồ sơ khác</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
                      {uploading ? 'Đang tải lên S3...' : 'Tải tài liệu lên'}
                    </button>
                  </form>
                </div>

                {/* Documents List */}
                <div className="card">
                  <h4>Danh sách hồ sơ đã lưu</h4>
                  {documents.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Chưa có tài liệu nào được tải lên cho sinh viên này.</p>
                  ) : (
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '10px' }}>Tên File</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>Loại</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>Ngày Tải Lên</th>
                          <th style={{ textAlign: 'center', padding: '10px' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '10px' }}>{doc.fileName}</td>
                            <td style={{ padding: '10px' }}>
                              <span className="badge badge-info">{doc.fileType || 'other'}</span>
                            </td>
                            <td style={{ padding: '10px' }}>
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline"
                                style={{ display: 'inline-block', textDecoration: 'none' }}
                              >
                                Tải về
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    # 4. Teacher Detail and Edit pages
    "frontend/src/pages/teachers/TeacherDetail.jsx": """import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function TeacherDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const res = await api.get(`/teachers/${id}`)
        setTeacher(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTeacher()
  }, [id])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Giáo Viên" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : !teacher ? (
            <div className="card">Không tìm thấy thông tin giáo viên.</div>
          ) : (
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {teacher.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px 0' }}>{teacher.fullName}</h2>
                  <span className="badge badge-info">{teacher.teacherId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Email:</strong> <span style={{ float: 'right' }}>{teacher.email}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Số điện thoại:</strong> <span style={{ float: 'right' }}>{teacher.phone || 'Chưa cung cấp'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Khoa giảng dạy:</strong> <span style={{ float: 'right' }}>{teacher.department || 'N/A'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <strong>Môn học phụ trách:</strong> <span style={{ float: 'right' }}>{teacher.subject || 'N/A'}</span>
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/teachers')}>Quay lại</button>
                <Link to={`/teachers/${id}/edit`} className="btn btn-primary">Chỉnh sửa</Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    "frontend/src/pages/teachers/TeacherEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function TeacherEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    subject: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const res = await api.get(`/teachers/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error(err)
        setError('Không thể tải thông tin giáo viên')
      } finally {
        setLoading(false)
      }
    }
    loadTeacher()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.put(`/teachers/${id}`, form)
      setMessage('Cập nhật thông tin giáo viên thành công!')
      setTimeout(() => {
        navigate(`/teachers/${id}`)
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Giáo Viên" />
        <main className="main-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    disabled
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Khoa giảng dạy</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Môn học phụ trách</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate(`/teachers/${id}`)}>Hủy</button>
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

    # 5. Grade Edit page
    "frontend/src/pages/grades/GradeEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function GradeEdit() {
  const { id } = useParams() // gradeId
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
      setError('Cập nhật thất bại: ' + (err.response?.data?.message || err.message))
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
                    placeholder="Không bắt buộc"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
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

    # 6. Admin User management pages
    "frontend/src/pages/admin/AdminUsers.jsx": """import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockCognitoUsers = [
  { username: "admin@example.com", email: "admin@example.com", status: "CONFIRMED", groups: ["Admin", "Staff", "Student"], enabled: true },
  { username: "teacher1@example.com", email: "teacher1@example.com", status: "CONFIRMED", groups: ["Staff"], enabled: true },
  { username: "student1@example.com", email: "student1@example.com", status: "FORCE_CHANGE_PASSWORD", groups: ["Student"], enabled: true }
]

export default function AdminUsers() {
  const [users, setUsers] = useState(mockCognitoUsers)
  const [message, setMessage] = useState('')

  const handleToggleEnable = (username) => {
    setUsers(users.map(u => {
      if (u.username === username) {
        const nextState = !u.enabled
        setMessage(`Đã ${nextState ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản ${username} trên Cognito.`)
        return { ...u, enabled: nextState }
      }
      return u
    }))
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Quản Lý Tài Khoản Người Dùng" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Cognito Users</h2>
          </div>

          {message && <div className="alert alert-success">{message}</div>}

          <div className="card">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Email / Username</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Trạng Thái Cognito</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Nhóm Quyền (Groups)</th>
                  <th style={{ textAlign: 'center', padding: '12px' }}>Hoạt Động</th>
                  <th style={{ textAlign: 'center', padding: '12px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${user.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {user.groups.map((g, gIdx) => (
                        <span key={gIdx} className="badge badge-info" style={{ marginRight: '4px' }}>{g}</span>
                      ))}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: user.enabled ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold' }}>
                        {user.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        className={`btn btn-sm ${user.enabled ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => handleToggleEnable(user.username)}
                      >
                        {user.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    "frontend/src/pages/admin/AdminRoles.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockCognitoGroups = [
  { name: "Admin", description: "Quyền quản trị viên cao nhất hệ thống, được phép CRUD tất cả thực thể.", userCount: 1 },
  { name: "Staff", description: "Quyền cán bộ quản lý, được phép CRUD thông tin sinh viên và giáo viên.", userCount: 2 },
  { name: "Student", description: "Quyền sinh viên, chỉ có quyền xem thông tin cá nhân, điểm số, tài liệu và tải hồ sơ.", userCount: 5 }
]

export default function AdminRoles() {
  const [groups] = useState(mockCognitoGroups)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Phân Quyền Nhóm Cognito" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Nhóm Quyền Người Dùng</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {groups.map((g, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-primary)' }}>{g.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{g.description}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Số lượng user: <strong>{g.userCount}</strong></span>
                  <button className="btn btn-sm btn-outline">Xem chi tiết</button>
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

    "frontend/src/pages/admin/AdminLogs.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockCloudWatchLogs = [
  { timestamp: "2026-07-11T11:45:02.124Z", service: "getStudents", type: "INFO", message: "Scan DynamoDB table success. Items returned: 3." },
  { timestamp: "2026-07-11T11:43:55.852Z", service: "docUploadUrl", type: "INFO", message: "Generated presigned PUT url for key: students/SV001/bang-diem.pdf" },
  { timestamp: "2026-07-11T11:43:01.321Z", service: "sendEmailWorker", type: "INFO", message: "SES email sent successfully to nguyenvana@example.com." },
  { timestamp: "2026-07-11T11:41:20.104Z", service: "createStudent", type: "WARN", message: "Validation warning: GPA field is empty, set to null." }
]

export default function AdminLogs() {
  const [logs] = useState(mockCloudWatchLogs)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhật Ký Hoạt Động Hệ Thống" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">CloudWatch Live Logs</h2>
          </div>

          <div className="card" style={{ backgroundColor: '#1E1E1E', color: '#D4D4D4', fontFamily: 'monospace', padding: '20px', borderRadius: '8px' }}>
            <div style={{ borderBottom: '1px solid #3C3C3C', paddingBottom: '10px', marginBottom: '15px', color: '#858585' }}>
              $ aws logs filter-log-events --log-group-name /aws/lambda/student-portal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #2B2B2B', paddingBottom: '8px' }}>
                  <span style={{ color: '#569CD6' }}>[{log.timestamp}]</span>
                  <span style={{ color: log.type === 'WARN' ? '#DCDCAA' : '#4FC1FF', fontWeight: 'bold' }}>{log.service}</span>
                  <span style={{ color: log.type === 'WARN' ? '#CE9178' : '#6A9955' }}>[{log.type}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    "frontend/src/pages/admin/AdminSettings.jsx": """import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    systemName: 'Student Management Portal',
    maxUploadSize: '10MB',
    emailSender: 'noreply@example.com',
    region: 'us-east-1',
    maintenanceMode: false
  })
  const [message, setMessage] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setMessage('Đã lưu cấu hình hệ thống thành công!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Cấu Hình Hệ Thống" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tên cổng thông tin</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Kích thước file upload tối đa S3</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">SES Email gửi thông báo</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.emailSender}
                  disabled
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">AWS Region</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.region}
                  disabled
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="maintenance" className="form-label" style={{ margin: 0 }}>Bật chế độ bảo trì hệ thống</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ float: 'right' }}>
                Lưu cấu hình
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
""",

    # 7. Error utility pages
    "frontend/src/pages/errors/Forbidden.jsx": """import { Link } from 'react-router-dom'

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
""",

    "frontend/src/pages/errors/NotFound.jsx": """import { Link } from 'react-router-dom'

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
"""
}

# Create directories and files
for path, code in pages.items():
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Created file: {path}")
