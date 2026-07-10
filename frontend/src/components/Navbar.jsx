// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { getCurrentUserAttributes, logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ title }) {
  const navigate = useNavigate()
  const [name, setName] = useState('Admin')
  const [loading, setLoading] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const attrs = await getCurrentUserAttributes()
        if (attrs) setName(attrs.email || name)
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (e) {
      console.error('Đăng xuất thất bại:', e)
      // vẫn điều hướng về login cho chắc
      navigate('/login')
    }
  }

  return (
    <header className="navbar">
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-user">
        <div style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div className="navbar-user-name">{loading ? 'Loading...' : name}</div>
          <div className="navbar-user-role">Administrator</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Nhấp để đăng xuất</div>
        </div>
        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '60px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  )
}
