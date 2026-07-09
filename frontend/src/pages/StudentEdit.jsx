// src/pages/StudentEdit.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StudentForm from '../components/StudentForm'
import { getStudentById, updateStudent } from '../services/studentService'

export default function StudentEdit() {
  const { id } = useParams()
  const [initial, setInitial] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getStudentById(id)
      .then((res) => { setInitial(res.data); setLoaded(true) })
      .catch(() => setError('Không tìm thấy sinh viên'))
  }, [id])

  const handleSubmit = async (form) => {
    setLoading(true)
    try {
      await updateStudent(id, form)
      navigate(`/students/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!loaded) return <div className="page">Đang tải...</div>

  return (
    <div className="page">
      <h1>Sửa sinh viên</h1>
      {error && <p className="error">{error}</p>}
      <StudentForm initialData={initial} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
