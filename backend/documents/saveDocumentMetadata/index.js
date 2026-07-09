// documents/saveDocumentMetadata/index.js
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { sendMessage } from '../../common/sqs'

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'Documents'

export const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { studentId, fileName, s3Key, fileUrl } = data
    if (!studentId || !s3Key) return error('Thiếu studentId hoặc s3Key', 400)

    const item = {
      id: `${studentId}-${Date.now()}`,
      studentId,
      fileName,
      s3Key,
      fileUrl,
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: DOCUMENTS_TABLE, Item: item }))

    // Gửi thông báo (SQS) để worker gửi email xác nhận tài liệu qua SES.
    await sendMessage({ type: 'DOCUMENT_UPLOADED', document: item })

    return success({ message: 'Lưu metadata thành công', document: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
