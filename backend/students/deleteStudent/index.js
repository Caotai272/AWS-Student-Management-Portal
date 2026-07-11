import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { withAuth, requireRole } from '../../common/authMiddleware'

const handler = async (event) => {
  try {
    const id = event.pathParameters?.id
    if (!id) return error('Thiếu id', 400)

    await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }))
    return success({ message: 'Xóa thành công' })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(handler)
const authAndRoleHandler = requireRole('Admin')(authHandler)

export const handler = authAndRoleHandler
