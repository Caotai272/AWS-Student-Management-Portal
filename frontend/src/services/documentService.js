// src/services/documentService.js
import api from './api'

export const createUploadUrl = (data) => api.post('/documents/upload-url', data)

export const saveDocumentMetadata = (data, studentId = null) => {
  // Support both old and new endpoint formats
  // New format: POST /students/:studentId/documents (the README standard)
  // Old format: POST /documents/metadata (for backward compatibility)
  if (studentId) {
    return api.post(`/students/${studentId}/documents`, data)
  }
  return api.post('/documents/metadata', data)
}

export const getStudentDocuments = (studentId) => {
  // Support both old and new endpoint formats
  // New format: GET /students/:studentId/documents
  // Old format: GET /documents/metadata?studentId=:studentId
  if (studentId) {
    return api.get(`/students/${studentId}/documents`)
  }
  return api.get('/documents/metadata')
}

export default { createUploadUrl, saveDocumentMetadata, getStudentDocuments }
