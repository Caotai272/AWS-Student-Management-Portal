import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { validateStudent } from '../../common/validators.js'
import { sendMessage } from '../../common/sqs.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errors = validateStudent(data)
    if (errors.length > 0) return error(errors.join('; '), 400)

    const item = {
      id: data.studentId,
      studentId: data.studentId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      major: data.major || '',
      gpa: data.gpa !== undefined ? Number(data.gpa) : null,
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }))

    // Gửi thông báo (SQS) để worker gửi email chào mừng qua SES.
    await sendMessage({ type: 'STUDENT_CREATED', student: item })

    return success({ message: 'Tạo sinh viên thành công', student: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Staff')(authHandler)

export const handler = authAndRoleHandler
