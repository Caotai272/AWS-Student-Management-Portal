import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { sendMessage } from '../../common/sqs'
import { withAuth, requireRole } from '../../common/authMiddleware'

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'StudentDocuments'

const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    let studentId = data.studentId
    let documentId = data.documentId

    if (!studentId && event.pathParameters?.studentId) {
      studentId = event.pathParameters.studentId
    }

    if (!studentId) return error('Thiếu studentId', 400)

    const {
      documentId: docIdParam,
      fileName,
      fileType,
      s3Key,
      fileUrl,
      bucketName,
      uploadedBy,
      documentId: bodyDocId
    } = data

    const actualDocumentId = docIdParam || documentId || bodyDocId || `DOC${Date.now()}`

    if (!fileName || !s3Key) return error('Thiếu fileName hoặc s3Key', 400)

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

    await docClient.send(new PutCommand({
      TableName: DOCUMENTS_TABLE,
      Item: item
    }))

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

// Áp dụng middleware auth: dùng requireRole('Student') theo README §8.2
const authHandler = withAuth(handler)
const authAndRoleHandler = requireRole('Student')(authHandler)

export const handler = authAndRoleHandler