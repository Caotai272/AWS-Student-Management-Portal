import { useState } from 'react'
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
