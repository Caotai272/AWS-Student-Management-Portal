import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const mockCloudWatchLogs = [
  { timestamp: "2026-07-11T11:45:02.124Z", service: "getStudents", type: "INFO", message: "Scan DynamoDB table success. Items returned: 3." },
  { timestamp: "2026-07-11T11:43:55.852Z", service: "docUploadUrl", type: "INFO", message: "Generated presigned PUT url for key: students/SV001/bang-diem.pdf" },
  { timestamp: "2026-07-11T11:43:01.321Z", service: "sendEmailWorker", type: "INFO", message: "SES email sent successfully to nguyenvana@example.com." },
  { timestamp: "2026-07-11T11:41:20.104Z", service: "createStudent", type: "WARN", message: "Validation warning: GPA field is empty, set to null." }
]

export default function AdminLogs() {
  const [logs] = useState(mockCloudWatchLogs)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Nhật Ký Hoạt Động Hệ Thống" />
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">CloudWatch Live Logs</h2>
          </div>

          <div className="card" style={{ backgroundColor: '#1E1E1E', color: '#D4D4D4', fontFamily: 'monospace', padding: '20px', borderRadius: '8px' }}>
            <div style={{ borderBottom: '1px solid #3C3C3C', paddingBottom: '10px', marginBottom: '15px', color: '#858585' }}>
              $ aws logs filter-log-events --log-group-name /aws/lambda/student-portal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #2B2B2B', paddingBottom: '8px' }}>
                  <span style={{ color: '#569CD6' }}>[{log.timestamp}]</span>
                  <span style={{ color: log.type === 'WARN' ? '#DCDCAA' : '#4FC1FF', fontWeight: 'bold' }}>{log.service}</span>
                  <span style={{ color: log.type === 'WARN' ? '#CE9178' : '#6A9955' }}>[{log.type}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
