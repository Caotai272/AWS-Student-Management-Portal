import { useState, useEffect } from 'react'
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
