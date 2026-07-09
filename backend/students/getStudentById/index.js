// students/getStudentById/index.js
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb'
import { success, error } from '../../common/response'

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id
    if (!id) return error('Thiếu id', 400)

    const res = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    )
    if (!res.Item) return error('Không tìm thấy sinh viên', 404)

    return success(res.Item)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
