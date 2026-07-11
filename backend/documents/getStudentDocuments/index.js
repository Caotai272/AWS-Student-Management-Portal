// backend/documents/getStudentDocuments/index.js
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../../common/dynamodb'
import { success, error } from '../../common/response'

const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'StudentDocuments'

export const handler = async (event) => {
  try {
    // Extract studentId from path parameters (based on new endpoint: /students/{studentId}/documents)
    let studentId = event.pathParameters?.studentId

    // Also support old endpoint: /documents/metadata with studentId in body
    if (!studentId && event.body) {
      const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
      studentId = data.studentId
    }

    if (!studentId) {
      return error('Thiếu studentId trong path parameters hoặc body', 400)
    }

    // Query documents for the specific student
    const queryParams = {
      TableName: DOCUMENTS_TABLE,
      KeyConditionExpression: 'studentId = :studentId',
      ExpressionAttributeValues: {
        ':studentId': studentId
      }
    }

    const result = await docClient.send(new QueryCommand(queryParams))

    return success({
      documents: result.Items || [],
      count: result.Count || 0,
      studentId: studentId
    })

  } catch (err) {
    console.error('getStudentDocuments error:', err)
    return error(err.message || 'Lỗi máy chủ khi lấy tài liệu', 500)
  }
}