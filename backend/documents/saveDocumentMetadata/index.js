// backend/documents/saveDocumentMetadata/index.js
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { sendMessage } from '../../common/sqs'

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'StudentDocuments'

export const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    // Support both new /students/:studentId/documents and old /documents/metadata
    // New format: POST /students/:studentId/documents
    // Old format: POST /documents/metadata

    let studentId = data.studentId
    let documentId = data.documentId

    // Support new endpoint format with path parameters
    if (!studentId && event.pathParameters?.studentId) {
      studentId = event.pathParameters.studentId
    }

    if (!studentId) return error('Thiếu studentId', 400)

    // Định nghĩa endpoint thực tế theo README
    // README: POST /students/:studentId/documents
    // Body: { documentId, fileName, fileType, s3Key }

    const {
      documentId: docIdParam,
      fileName,
      fileType,
      s3Key,
      fileUrl,
      bucketName,
      uploadedBy
    } = data

    // Sử dụng documentId từ path parameters nếu có
    const actualDocumentId = docIdParam || documentId || `DOC${Date.now()}`

    if (!fileName || !s3Key) return error('Thiếu fileName hoặc s3Key', 400)

    // Xây dựng object theo thiết kế DynamoDB trong README
    const item = {
      id: `${studentId}-${actualDocumentId}`,  // Composite ID
      studentId,                                 // Partition Key
      documentId: actualDocumentId,              // Sort Key
      fileName,
      fileType: fileType || 'application/octet-stream',
      s3Key,
      bucketName: bucketName || 'student-management-documents',
      fileUrl: fileUrl || `https://${bucketName || 'student-management-documents'}.s3.amazonaws.com/${s3Key}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: uploadedBy || 'unknown'
    }

    // Lưu vào DynamoDB
    await docClient.send(new PutCommand({
      TableName: DOCUMENTS_TABLE,
      Item: item
    }))

    // Gửi thông báo email qua SQS worker
    await sendMessage({
      type: 'DOCUMENT_UPLOADED',
      document: item
    })

    return success({
      message: 'Lưu metadata thành công',
      document: item
    }, 201)

  } catch (err) {
    console.error('saveDocumentMetadata error:', err)
    return error(err.message || 'Lỗi máy chủ khi lưu metadata', 500)
  }
}