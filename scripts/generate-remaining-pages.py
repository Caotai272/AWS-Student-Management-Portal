import os

files = {
    # 1. AdminUserCreate.jsx
    "frontend/src/pages/admin/AdminUserCreate.jsx": """import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminUserCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', role: 'Student', password: 'Abc12345!' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      // Simulate calling Cognito AdminCreateUser + Group association
      setMessage(`Đã gửi yêu cầu khởi tạo tài khoản ${form.email} (Quyền: ${form.role}) lên Amazon Cognito thành công!`)
      setTimeout(() => {
        navigate('/admin/users')
      }, 1500)
    } catch (err) {
      setError(err.message || 'Khởi tạo tài khoản thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Thêm Tài Khoản Mới" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>Tạo tài khoản đăng nhập trên Cognito</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Mật khẩu tạm thời sẽ được tự động gửi qua email đăng ký. Người dùng phải thay đổi mật khẩu ở lần đăng nhập đầu tiên.
            </p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Email tài khoản</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Vai trò / Nhóm quyền</label>
                <select
                  className="form-control"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Student">Sinh viên (Student group)</option>
                  <option value="Staff">Giáo viên / Cán bộ (Staff group)</option>
                  <option value="Admin">Quản trị viên (Admin group)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Mật khẩu tạm thời</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.password}
                  disabled
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/users')}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
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

    # 2. AdminUserDetail.jsx
    "frontend/src/pages/admin/AdminUserDetail.jsx": """import { useState, useEffect } from 'react'
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
""",

    # 3. AdminUserEdit.jsx
    "frontend/src/pages/admin/AdminUserEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminUserEdit() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', role: 'Student', enabled: true })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setForm({
      email: username,
      role: username.includes('teacher') || username.includes('staff') ? 'Staff' : username.includes('admin') ? 'Admin' : 'Student',
      enabled: true
    })
  }, [username])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật quyền và trạng thái hoạt động trên Cognito thành công!')
    setTimeout(() => {
      navigate(`/admin/users/${username}`)
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Sửa Trạng Thái và Nhóm Quyền" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Email tài khoản</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  disabled
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Nhóm quyền hạn (Role)</label>
                <select
                  className="form-control"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Student">Sinh viên (Student)</option>
                  <option value="Staff">Giáo viên / Cán bộ (Staff)</option>
                  <option value="Admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="enabled"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="enabled" className="form-label" style={{ margin: 0 }}>Cho phép hoạt động (Enabled)</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate(`/admin/users/${username}`)}>Hủy</button>
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

    # 4. AdminStudentList.jsx
    "frontend/src/pages/admin/AdminStudentList.jsx": """import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function AdminStudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data.students || res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Sinh Viên Chỉ Đọc (Học thuật)" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Hồ Sơ Học Thuật Sinh Viên</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.className || 'Chưa gán'}</td>
                      <td>{s.major}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
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

    # 5. AdminTeacherList.jsx
    "frontend/src/pages/admin/AdminTeacherList.jsx": """import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function AdminTeacherList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teachers')
      .then((res) => setTeachers(res.data.teachers || res.data || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Danh Sách Giáo Viên Chỉ Đọc" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Đội Ngũ Giảng Viên</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{t.teacherId}</td>
                      <td>{t.fullName}</td>
                      <td>{t.email}</td>
                      <td>{t.department}</td>
                      <td>{t.subject || 'Chưa phân công'}</td>
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

    # 6. ClassList.jsx
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

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Lớp Học Phụ Trách" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Danh sách lớp giảng dạy</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {classes.map((c) => (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-primary)' }}>{c.className}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Phòng học: <strong>{c.room}</strong></p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Lịch học: {c.schedule}</p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-text-muted)' }}>Sĩ số: {c.studentCount} sinh viên</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/classes/${c.id}`} className="btn btn-sm btn-primary">Vào lớp</Link>
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

    # 7. ClassDetail.jsx
    "frontend/src/pages/teachers/ClassDetail.jsx": """import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { getStudents } from '../../services/studentService'

export default function ClassDetail() {
  const { classId } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((res) => {
        const list = res.data.students || res.data || []
        // Lọc sinh viên thuộc lớp học này
        setStudents(list.filter(s => s.className?.toLowerCase() === classId.toLowerCase()))
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [classId])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={`Chi Tiết Lớp ${classId}`} />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Danh sách sinh viên trong lớp</h2>
              <p className="page-description">Lớp: {classId.toUpperCase()}</p>
            </div>
            <Link to="/grades/new" className="btn btn-primary">Nhập điểm lớp</Link>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : students.length === 0 ? (
            <div className="card"><p>Chưa có sinh viên nào được phân vào lớp này.</p></div>
          ) : (
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>GPA</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td>{s.studentId}</td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td><strong>{s.gpa || '—'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/students/${s.id}`} className="btn btn-sm btn-outline">Hồ sơ</Link>
                          <Link to={`/students/${s.id}/edit`} className="btn btn-sm btn-primary">Sửa thông tin</Link>
                        </div>
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

    # 8. GradeCreate.jsx
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
      const payload = {
        studentId: form.studentId,
        teacherId: 'TEACHER01', // Mock teacher ID
        subject: form.subject,
        score: Number((Number(form.attendance) * 0.1 + Number(form.midterm) * 0.3 + Number(form.final) * 0.6).toFixed(2)),
        details: {
          attendance: Number(form.attendance),
          midterm: Number(form.midterm),
          final: Number(form.final)
        },
        notes: form.notes
      }
      
      await api.post('/grades', payload)
      setMessage('Nhập điểm sinh viên thành công!')
      setTimeout(() => {
        navigate('/grades')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Nhập điểm thất bại. Vui lòng kiểm tra lại thông tin.')
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
                  placeholder="Nhập mã số sinh viên"
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
                  placeholder="Lập trình Java, Cơ sở dữ liệu..."
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
                  placeholder="Ghi chú thêm (nếu có)"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/grades')}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Nhập điểm'}
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

    # 9. GradeDetail.jsx
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

  useEffect(() => {
    api.get(`/grades/${id}`)
      .then(res => setGrade(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chi Tiết Điểm Học Tập" />
        <main className="main-content">
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
                {grade.notes && (
                  <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    <strong>Ghi chú:</strong> {grade.notes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/grades')}>Quay lại</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
""",

    # 10. MaterialEdit.jsx
    "frontend/src/pages/materials/MaterialEdit.jsx": """import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function MaterialEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', subject: '', type: 'slide' })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật siêu dữ liệu tài liệu thành công!')
    setTimeout(() => {
      navigate('/materials')
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Sửa Siêu Dữ Liệu Tài Liệu" />
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
                <label className="form-label">Tên môn học</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Loại tài liệu</label>
                <select
                  className="form-control"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="slide">Slide bài giảng</option>
                  <option value="exercise">Bài tập</option>
                  <option value="exam">Đề thi</option>
                  <option value="reference">Tài liệu tham khảo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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

    # 11. MaterialDetail.jsx
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
                  <strong>Ngày đăng tải:</strong> <span style={{ float: 'right' }}>{material.uploadedAt ? new Date(material.uploadedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => navigate('/materials')}>Quay lại</button>
                <a href={material.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Tải xuống tài liệu
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

    # 12. Dynamic Dashboard.jsx
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                  <div className="card">
                    <h3 className="card-title">Giảng viên mới thêm</h3>
                    <table className="table" style={{ width: '100%' }}>
                      <thead>
                        <tr><th>Mã GV</th><th>Họ tên</th><th>Khoa</th></tr>
                      </thead>
                      <tbody>
                        {teachers.slice(0, 3).map((t, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                            <td>{t.teacherId}</td>
                            <td>{t.fullName}</td>
                            <td>{t.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <h3 className="card-title">Thao tác nhanh Admin</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Link to="/admin/users/create" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Tạo tài khoản mới (Cognito)
                      </Link>
                      <Link to="/admin/users" className="btn btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Xem tất cả tài khoản
                      </Link>
                      <Link to="/admin/logs" className="btn btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        Xem CloudWatch Live Logs
                      </Link>
                    </div>
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
                  <h3 className="card-title font-semibold">Phím tắt giảng dạy</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/classes" className="btn btn-primary" style={{ textDecoration: 'none' }}>Quản lý lớp học</Link>
                    <Link to="/grades/new" className="btn btn-outline" style={{ textDecoration: 'none' }}>Nhập điểm thi</Link>
                    <Link to="/materials/upload" className="btn btn-outline" style={{ textDecoration: 'none' }}>Upload slide tài liệu</Link>
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

          <div className="stats-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="stat-card">
              <div className="stat-label">Kết Quả Học Tập</div>
              <Link to="/grades" className="btn btn-link" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                Xem bảng điểm
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tài Liệu Học Tập</div>
              <Link to="/materials" className="btn btn-link" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                Tải slide bài giảng
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
"""
}

# Generate all pages
for path, content in files.items():
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created/Updated file: {path}")
