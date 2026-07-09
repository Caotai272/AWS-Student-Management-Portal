// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Student Portal</div>
      <div className="navbar-actions">
        <button onClick={handleLogout} className="btn btn-logout">Đăng xuất</button>
      </div>
    </nav>
  )
}
