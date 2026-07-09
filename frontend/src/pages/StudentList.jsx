// src/pages/StudentList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, deleteStudent } from '../services/studentService'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      setStudents(res.data.students || res.data || [])
    } catch (err) {
      setError(err.message || 'Lỗi tải danh sách')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa sinh viên này?')) return
    await deleteStudent(id)
    load()
  }

  if (loading) return <div className="page">Đang tải...</div>

  return (
    <div className="page">
      <h1>Danh sách sinh viên</h1>
      {error && <p className="error">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Ngành</th>
            <th>GPA</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id || s.studentId}>
              <td>{s.studentId}</td>
              <td><Link to={`/students/${s.id || s.studentId}`}>{s.fullName}</Link></td>
              <td>{s.email}</td>
              <td>{s.major}</td>
              <td>{s.gpa}</td>
              <td>
                <Link to={`/students/${s.id || s.studentId}/edit`} className="btn">Sửa</Link>
                <button onClick={() => handleDelete(s.id || s.studentId)} className="btn btn-danger">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
