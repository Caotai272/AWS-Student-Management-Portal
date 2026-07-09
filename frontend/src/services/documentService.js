// src/services/documentService.js
import api from './api'

export const createUploadUrl = (data) => api.post('/documents/upload-url', data)

export const saveDocumentMetadata = (data) => api.post('/documents/metadata', data)

export default { createUploadUrl, saveDocumentMetadata }
