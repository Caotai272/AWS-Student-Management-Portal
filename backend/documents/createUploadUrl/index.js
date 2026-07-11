import { success, error } from '../../common/response'
import { getUploadSignedUrl, BUCKET_NAME } from '../../common/s3'
import { withAuth, requireRole } from '../../common/authMiddleware'

const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { fileName, contentType, studentId, documentId } = data
    if (!fileName || !studentId) return error('Thiếu fileName hoặc studentId', 400)

    const docId = documentId || `DOC${Date.now()}`
    const key = `documents/${studentId}/${docId}-${fileName}`
    const uploadUrl = await getUploadSignedUrl(key, contentType || 'application/octet-stream')

    return success({
      uploadUrl,
      s3Key: key,
      fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
    })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

const authHandler = withAuth(handler)

const StaffOrStudentRoleHandler = async (event, context, callback) => {
  const authorizer = event.requestContext?.authorizer
  if (!authorizer) return callback(null, error('Thiếu authorizer', 401))

  const { claims } = authorizer
  const userGroups = claims?.['cognito:groups'] || []
  const allowedRoles = ['Student', 'Staff']
  const hasRole = userGroups.some(role => allowedRoles.includes(role))
  if (!hasRole) return callback(null, error('Không có quyền truy cập. Chỉ Student hoặc Staff được phép.', 403))

  return await handler(event, context)
}

export const handler = StaffOrStudentRoleHandler