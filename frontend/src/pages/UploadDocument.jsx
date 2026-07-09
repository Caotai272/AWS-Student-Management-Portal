// src/pages/UploadDocument.jsx
import { useState } from 'react'
import { createUploadUrl, saveDocumentMetadata } from '../services/documentService'

export default function UploadDocument() {
  const [file, setFile] = useState(null)
  const [studentId, setStudentId] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async () => {
    setError('')
    setStatus('Đang tải lên...')
    if (!file || !studentId) {
      setError('Chọn file và nhập mã sinh viên')
      return
    }
    try {
      // 1. Lấy presigned URL từ backend (Lambda -> S3).
      const { data } = await createUploadUrl({
        fileName: file.name,
        contentType: file.type,
        studentId
      })

      // 2. PUT file trực tiếp lên S3 bằng presigned URL.
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      // 3. Lưu metadata vào DynamoDB và kích hoạt gửi email (SQS).
      await saveDocumentMetadata({
        studentId,
        fileName: file.name,
        s3Key: data.s3Key,
        fileUrl: data.fileUrl
      })

      setStatus('Tải lên thành công! Email xác nhận đang được gửi.')
    } catch (err) {
      setError(err.message || 'Tải lên thất bại')
      setStatus('')
    }
  }

  return (
    <div className="page">
      <h1>Upload tài liệu</h1>
      {error && <p className="error">{error}</p>}
      {status && <p className="success">{status}</p>}
      <div className="upload-form">
        <label>
          Mã sinh viên
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </label>
        <label>
          Chọn file
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button className="btn btn-primary" onClick={handleUpload}>Tải lên</button>
      </div>
    </div>
  )
}
