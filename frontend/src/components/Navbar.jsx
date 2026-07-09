// src/components/Navbar.jsx
import { getCurrentUserAttributes } from '../services/authService'

export default function Navbar({ title }) {
  let name = 'Admin'
  try {
    const attrs = getCurrentUserAttributes
    if (attrs) name = attrs.email || name
  } catch (e) {
    // ignore
  }

  return (
    <header className="navbar">
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-user">
        <div style={{ textAlign: 'right' }}>
          <div className="navbar-user-name">{name}</div>
          <div className="navbar-user-role">Administrator</div>
        </div>
      </div>
    </header>
  )
}
