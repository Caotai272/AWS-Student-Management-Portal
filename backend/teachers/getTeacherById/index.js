import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async (event) => {
  try {
    const id = event.pathParameters?.id
    if (!id) return error('Thiếu id', 400)
    const res = await docClient.send(new GetCommand({ TableName: TABLE.TEACHERS, Key: { id } }))
    if (!res.Item) return error('Không tìm thấy giáo viên', 404)
    return success(res.Item)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Staff')(authHandler)

export const handler = authAndRoleHandler
