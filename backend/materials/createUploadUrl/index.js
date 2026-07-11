// materials/createUploadUrl/index.js
import { success, error } from '../../common/response.js'
import { getUploadSignedUrl, BUCKET_NAME } from '../../common/s3.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { fileName, contentType, type } = data
    if (!fileName || !type) return error('Thiếu fileName hoặc type', 400)

    const key = `materials/${type}/${Date.now()}-${fileName}`
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

// Áp dụng middleware auth và RBAC: chỉ Student được upload tài liệu
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Student')(authHandler)

export const handler = authAndRoleHandler
