import { useState } from 'react'
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
