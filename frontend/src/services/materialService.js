// src/services/materialService.js
import api from './api'

export const getMaterials = (params = {}) => api.get('/materials', { params })
export const getMaterialById = (id) => api.get(`/materials/${id}`)
export const createUploadUrl = (data) => api.post('/materials/upload-url', data)
export const saveMaterialMetadata = (data) => api.post('/materials/metadata', data)

export default { getMaterials, getMaterialById, createUploadUrl, saveMaterialMetadata }
