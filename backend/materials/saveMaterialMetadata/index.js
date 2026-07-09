// materials/saveMaterialMetadata/index.js
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { sendMessage } from '../../common/sqs'

export const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { title, subject, type, fileName, s3Key, fileUrl } = data
    if (!title || !subject || !s3Key) return error('Thiếu title, subject hoặc s3Key', 400)

    const item = {
      id: `${type}-${Date.now()}`,
      title,
      subject,
      type: type || 'other',
      fileName,
      s3Key,
      fileUrl,
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE.MATERIALS, Item: item }))
    await sendMessage({ type: 'MATERIAL_UPLOADED', material: item })

    return success({ message: 'Lưu tài liệu thành công', material: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
