import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const classId = event.pathParameters?.classId || event.pathParameters?.id
    if (!classId) {
      return error('Thiếu tham số id lớp học', 400)
    }

    const res = await docClient.send(new GetCommand({
      TableName: TABLE.CLASSES,
      Key: { id: classId }
    }))

    if (!res.Item) {
      return error('Không tìm thấy lớp học', 404)
    }

    return success(res.Item)
  } catch (err) {
    console.error('Get class by ID error:', err)
    return error(err.message || 'Lỗi máy chủ khi lấy chi tiết lớp học', 500)
  }
}

export const handler = withAuth(baseHandler)
