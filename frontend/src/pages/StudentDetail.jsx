// src/pages/StudentDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStudentById } from '../services/studentService'

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudentById(id)
      .then((res) => setStudent(res.data))
      .catch(() => setStudent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page">Đang tải...</div>
  if (!student) return <div className="page">Không tìm thấy sinh viên</div>

  return (
    <div className="page">
      <h1>Chi tiết sinh viên</h1>
      <dl className="detail">
        <dt>Mã SV</dt><dd>{student.studentId}</dd>
        <dt>Họ tên</dt><dd>{student.fullName}</dd>
        <dt>Email</dt><dd>{student.email}</dd>
        <dt>SĐT</dt><dd>{student.phone}</dd>
        <dt>Ngành</dt><dd>{student.major}</dd>
        <dt>GPA</dt><dd>{student.gpa}</dd>
      </dl>
      <Link to={`/students/${id}/edit`} className="btn btn-primary">Sửa</Link>
    </div>
  )
}
