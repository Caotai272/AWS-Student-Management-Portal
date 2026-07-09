// src/pages/StudentEdit.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StudentForm from '../components/StudentForm'
import { getStudentById, updateStudent } from '../services/studentService'

export default function StudentEdit() {
  const { id } = useParams()
  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getStudentById(id)
      .then((res) => { setFormData(res.data); setLoaded(true) })
      .catch(() => { setError('Không tìm thấy sinh viên.'); setLoaded(true) })
  }, [id])

  const validate = () => {
    const e = {}
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
      await updateStudent(id, formData)
      navigate(`/students/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại.')
    } finally {
      setLoading(false)
    }
  }

  if (!loaded) return <Layout title="Edit Student"><div className="loading-center"><div className="spinner" /><span>Đang tải...</span></div></Layout>

  return (
    <Layout title="Edit Student">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sửa sinh viên</h1>
          <p className="page-description">Cập nhật thông tin sinh viên {formData.studentId}.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <StudentForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/students/${id}`)}
        errors={errors}
        submitText="Cập nhật"
        loading={loading}
        readOnlyId
      />
    </Layout>
  )
}
