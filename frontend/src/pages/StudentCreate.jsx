// src/pages/StudentCreate.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StudentForm from '../components/StudentForm'
import { createStudent } from '../services/studentService'

const EMPTY = {
  studentId: '',
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  major: '',
  className: '',
  status: 'Active'
}

export default function StudentCreate() {
  const [formData, setFormData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!formData.studentId || formData.studentId.includes(' ')) e.studentId = 'Vui lòng nhập mã sinh viên (không chứa khoảng trắng).'
    if (!formData.fullName || formData.fullName.trim().length < 2) e.fullName = 'Vui lòng nhập họ tên.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email không hợp lệ.'
    if (formData.phone && !/^\d{9,11}$/.test(formData.phone)) e.phone = 'Số điện thoại không hợp lệ.'
    if (!formData.major) e.major = 'Vui lòng chọn ngành học.'
    if (!formData.className) e.className = 'Vui lòng nhập lớp.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      await createStudent(formData)
      navigate('/students')
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm sinh viên thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Create Student">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thêm sinh viên</h1>
          <p className="page-description">Điền thông tin sinh viên mới vào form bên dưới.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <StudentForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/students')}
        errors={errors}
        submitText="Lưu"
        loading={loading}
      />
    </Layout>
  )
}
