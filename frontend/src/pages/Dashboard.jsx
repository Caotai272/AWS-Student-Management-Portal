// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="cards">
        <Link to="/students" className="card">
          <h3>Sinh viên</h3>
          <p>Quản lý danh sách sinh viên</p>
        </Link>
        <Link to="/students/new" className="card">
          <h3>Thêm mới</h3>
          <p>Thêm sinh viên vào hệ thống</p>
        </Link>
        <Link to="/documents/upload" className="card">
          <h3>Tài liệu</h3>
          <p>Upload tài liệu lên S3</p>
        </Link>
      </div>
    </div>
  )
}
