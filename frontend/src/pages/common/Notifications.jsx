import { useState } from 'react'
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
