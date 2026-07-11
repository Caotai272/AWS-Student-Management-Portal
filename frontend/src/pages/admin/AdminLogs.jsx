import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockLogs = [
  { timestamp: '2026-07-11 23:15:22', level: 'INFO', message: 'User admin@example.com logged in successfully.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:22:15', level: 'INFO', message: 'Student ID 6 (Cao Anh Tai) record updated.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:31:34', level: 'INFO', message: 'Student ID SV999 (Test Aligned Student) created.', ip: '192.168.1.5' },
  { timestamp: '2026-07-11 23:42:01', level: 'WARN', message: 'Cognito lookup token validation fallback triggered.', ip: '10.0.4.15' }
]

export default function AdminLogs() {
  const [logs] = useState(mockLogs)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState(null)
  const [message, setMessage] = useState('')

  const handleRefresh = () => {
    setMessage('Nhật ký log CloudWatch đã được làm mới thành công!')
  }

  const handleExport = () => {
    setMessage('Đã xuất file nhật ký log hệ thống (CSV) thành công!')
  }

  const filtered = logs.filter(l => {
    const matchesSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search)
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhật Ký Hoạt Động (CloudWatch Live)" />
        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>System Activity Logs</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={handleRefresh}>Làm mới</button>
              <button className="btn btn-primary" onClick={handleExport}>Xuất file</button>
            </div>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: '15px' }}>{message}</div>}

          <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm log (IP, message...)"
              style={{ flex: 1 }}
            />
            <select
              className="form-control"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ maxWidth: '150px' }}
            >
              <option value="ALL">Tất cả Log Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedLog ? '1.5fr 1fr' : '1fr', gap: '20px' }}>
            <div className="card">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Thời Gian</th>
                    <th>Cấp Độ</th>
                    <th>IP</th>
                    <th>Nội Dung Hoạt Động</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td style={{ fontSize: '13px' }}>{log.timestamp}</td>
                      <td>
                        <span className={`badge ${log.level === 'INFO' ? 'badge-success' : 'badge-warning'}`}>
                          {log.level}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px' }}>{log.ip}</td>
                      <td style={{ fontSize: '14px' }}>{log.message}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => setSelectedLog(log)}>Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedLog && (
              <div className="card">
                <h3>Chi tiết nhật ký log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  <p><strong>Thời gian:</strong> {selectedLog.timestamp}</p>
                  <p><strong>Level:</strong> <span className="badge badge-info">{selectedLog.level}</span></p>
                  <p><strong>Client IP:</strong> {selectedLog.ip}</p>
                  <p><strong>Thông tin log:</strong></p>
                  <pre style={{ backgroundColor: 'var(--color-bg-alt)', padding: '12px', borderRadius: '6px', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                    {selectedLog.message}
                  </pre>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedLog(null)}>Đóng</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
