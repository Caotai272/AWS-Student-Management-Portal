import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { validateClass } from '../../common/validators.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errs = validateClass(data)
    if (errs.length > 0) {
      return error(errs.join('; '), 400)
    }

    const item = {
      id: data.classId,
      classId: data.classId,
      className: data.className,
      room: data.room || '',
      studentCount: data.studentCount !== undefined ? Number(data.studentCount) : 0,
      schedule: data.schedule || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE.CLASSES, Item: item }))
    return success({ message: 'Tạo lớp học thành công', class: item }, 201)
  } catch (err) {
    console.error('Create class error:', err)
    return error(err.message || 'Lỗi máy chủ khi tạo lớp học', 500)
  }
}

export const handler = requireRole('Admin')(withAuth(baseHandler))
