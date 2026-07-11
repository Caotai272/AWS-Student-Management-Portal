// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Users, GraduationCap, FileText, Bell, 
  Settings, LogOut, User, Shield, UserCheck, Terminal 
} from 'lucide-react'
import { logout, getUserRole } from '../services/authService'

export default function Sidebar() {
  const navigate = useNavigate()
  const role = getUserRole() || 'Admin'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Khởi tạo danh sách link dựa trên role
  const menuLinks = [
    { to: role === 'Admin' ? '/admin/dashboard' : '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/profile', label: 'Hồ sơ cá nhân', icon: User }
  ]

  // Phân quyền truy cập quản lý Sinh viên / Giáo viên / Điểm số
  if (role === 'Staff' || role === 'Teacher') {
    menuLinks.push({ to: '/students', label: 'Sinh viên', icon: Users })
    menuLinks.push({ to: '/classes', label: 'Lớp phụ trách', icon: Users })
    menuLinks.push({ to: '/grades', label: 'Điểm số', icon: FileText })
    menuLinks.push({ to: '/teacher-grades', label: 'Điểm tôi quản lý', icon: FileText })
  } else if (role === 'Admin') {
    // Admin xem danh sách sinh viên & giáo viên ở chế độ chỉ đọc như tài liệu thiết kế
    menuLinks.push({ to: '/admin/students', label: 'Sinh viên (Xem)', icon: Users })
    menuLinks.push({ to: '/admin/teachers', label: 'Giáo viên (Xem)', icon: GraduationCap })
    menuLinks.push({ to: '/grades', label: 'Xem Điểm số', icon: FileText })
  } else if (role === 'Student') {
    menuLinks.push({ to: '/grades', label: 'Xem điểm số', icon: FileText })
  }

  // Tài liệu học tập và thông báo (Mọi người)
  menuLinks.push({ to: '/materials', label: 'Tài liệu học tập', icon: FileText })
  menuLinks.push({ to: '/notifications', label: 'Thông báo', icon: Bell })

  // Chức năng quản trị hệ thống (Chỉ Admin)
  if (role === 'Admin') {
    menuLinks.push({ to: '/admin/users', label: 'Tài khoản', icon: UserCheck })
    menuLinks.push({ to: '/admin/roles', label: 'Nhóm quyền', icon: Shield })
    menuLinks.push({ to: '/admin/logs', label: 'Nhật ký log', icon: Terminal })
    menuLinks.push({ to: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Student Portal</div>
      </div>

      <nav className="sidebar-menu" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
        {menuLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={handleLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
