// src/components/TeacherForm.jsx
export default function TeacherForm({ formData, onChange, onSubmit, onCancel, submitText = 'Lưu', loading = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2 className="card-title">Thông tin giáo viên</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Mã giáo viên *</label>
          <input className="form-input" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} placeholder="T001" />
        </div>
        <div className="form-group">
          <label className="form-label">Họ tên *</label>
          <input className="form-input" name="fullName" value={formData.fullName || ''} onChange={handleChange} placeholder="Tran Van B" />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="teacher@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input className="form-input" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="0909123456" />
        </div>
        <div className="form-group">
          <label className="form-label">Bộ môn *</label>
          <input className="form-input" name="department" value={formData.department || ''} onChange={handleChange} placeholder="Công nghệ thông tin" />
        </div>
        <div className="form-group">
          <label className="form-label">Học vị</label>
          <select className="form-select" name="degree" value={formData.degree || ''} onChange={handleChange}>
            <option value="">-- Chọn --</option>
            <option value="Cử nhân">Cử nhân</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : submitText}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Hủy</button>}
      </div>
    </form>
  )
}
