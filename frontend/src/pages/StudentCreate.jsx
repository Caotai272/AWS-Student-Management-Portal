// src/pages/StudentCreate.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentForm from '../components/StudentForm'
import { createStudent } from '../services/studentService'

export default function StudentCreate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    setLoading(true)
    setError('')
    try {
      await createStudent(form)
      navigate('/students')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Thêm thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Thêm sinh viên</h1>
      {error && <p className="error">{error}</p>}
      <StudentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
