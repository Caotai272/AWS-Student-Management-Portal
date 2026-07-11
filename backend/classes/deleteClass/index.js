import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const classId = event.pathParameters?.classId || event.pathParameters?.id
    if (!classId) {
      return error('Thiếu tham số id lớp học', 400)
    }

    await docClient.send(new DeleteCommand({
      TableName: TABLE.CLASSES,
      Key: { id: classId }
    }))

    return success({ message: 'Xóa lớp học thành công' })
  } catch (err) {
    console.error('Delete class error:', err)
    return error(err.message || 'Lỗi máy chủ khi xóa lớp học', 500)
  }
}

export const handler = requireRole('Admin')(withAuth(baseHandler))
