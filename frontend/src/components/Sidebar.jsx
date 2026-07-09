// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Danh sách sinh viên' },
  { to: '/students/new', label: 'Thêm sinh viên' },
  { to: '/documents/upload', label: 'Upload tài liệu' }
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        {links.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
