// src/components/StudentForm.jsx
const GENDERS = ['Male', 'Female', 'Other']
const STATUSES = [
  { value: 'Active', label: 'Đang học' },
  { value: 'Inactive', label: 'Tạm ngưng' },
  { value: 'Graduated', label: 'Đã tốt nghiệp' },
  { value: 'Warning', label: 'Cần bổ sung hồ sơ' }
]

export default function StudentForm({ formData, onChange, onSubmit, onCancel, errors = {}, submitText = 'Lưu', loading = false, readOnlyId = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2 className="card-title">Thông tin sinh viên</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Mã sinh viên *</label>
          <input
            className="form-input"
            name="studentId"
            value={formData.studentId || ''}
            onChange={handleChange}
            placeholder="SV001"
            readOnly={readOnlyId}
          />
          {errors.studentId && <span className="form-error">{errors.studentId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Họ tên *</label>
          <input
            className="form-input"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            placeholder="Nguyen Van A"
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            className="form-input"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="student@example.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input
            className="form-input"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="0909123456"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Giới tính</label>
          <select className="form-select" name="gender" value={formData.gender || ''} onChange={handleChange}>
            <option value="">-- Chọn --</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Ngày sinh</label>
          <input
            className="form-input"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ngành học *</label>
          <input
            className="form-input"
            name="major"
            value={formData.major || ''}
            onChange={handleChange}
            placeholder="Information Technology"
          />
          {errors.major && <span className="form-error">{errors.major}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Lớp *</label>
          <input
            className="form-input"
            name="className"
            value={formData.className || ''}
            onChange={handleChange}
            placeholder="IT01"
          />
          {errors.className && <span className="form-error">{errors.className}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Trạng thái *</label>
          <select className="form-select" name="status" value={formData.status || 'Active'} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : submitText}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
        )}
      </div>
    </form>
  )
}
