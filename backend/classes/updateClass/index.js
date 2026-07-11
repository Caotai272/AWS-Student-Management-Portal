import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const classId = event.pathParameters?.classId || event.pathParameters?.id
    if (!classId) {
      return error('Thiếu tham số id lớp học', 400)
    }

    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { className, room, studentCount, schedule } = data

    const updateExpression = []
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    if (className !== undefined) {
      updateExpression.push('#name = :name')
      expressionAttributeNames['#name'] = 'className'
      expressionAttributeValues[':name'] = className
    }
    if (room !== undefined) {
      updateExpression.push('room = :room')
      expressionAttributeValues[':room'] = room
    }
    if (studentCount !== undefined) {
      updateExpression.push('studentCount = :cnt')
      expressionAttributeValues[':cnt'] = Number(studentCount)
    }
    if (schedule !== undefined) {
      updateExpression.push('schedule = :sch')
      expressionAttributeValues[':sch'] = schedule
    }

    if (updateExpression.length === 0) {
      return error('Không có thông tin nào để cập nhật', 400)
    }

    updateExpression.push('updatedAt = :upd')
    expressionAttributeValues[':upd'] = new Date().toISOString()

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE.CLASSES,
      Key: { id: classId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }))

    return success({ message: 'Cập nhật lớp học thành công', class: res.Attributes })
  } catch (err) {
    console.error('Update class error:', err)
    return error(err.message || 'Lỗi máy chủ khi cập nhật lớp học', 500)
  }
}

export const handler = requireRole('Admin')(withAuth(baseHandler))
