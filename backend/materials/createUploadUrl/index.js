// materials/createUploadUrl/index.js
import { success, error } from '../../common/response'
import { getUploadSignedUrl, BUCKET_NAME } from '../../common/s3'

export const handler = async (event) => {
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
