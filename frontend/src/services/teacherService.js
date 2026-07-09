// src/services/teacherService.js
import api from './api'

export const getTeachers = (params = {}) => api.get('/teachers', { params })
export const getTeacherById = (id) => api.get(`/teachers/${id}`)
export const createTeacher = (data) => api.post('/teachers', data)
export const updateTeacher = (id, data) => api.put(`/teachers/${id}`, data)
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`)

export default { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher }
