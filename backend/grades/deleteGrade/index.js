import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const id = event.pathParameters?.id
    if (!id) return error('Thiếu id', 400)
    await docClient.send(new DeleteCommand({ TableName: TABLE.GRADES, Key: { id } }))
    return success({ message: 'Xóa thành công' })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Admin')(authHandler)

export const handler = authAndRoleHandler
