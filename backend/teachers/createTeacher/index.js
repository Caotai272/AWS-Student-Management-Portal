// teachers/createTeacher/index.js
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { validateTeacher } from '../../common/validators'
import { sendMessage } from '../../common/sqs'

export const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errs = validateTeacher(data)
    if (errs.length > 0) return error(errs.join('; '), 400)

    const item = {
      id: data.teacherId,
      teacherId: data.teacherId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      department: data.department,
      degree: data.degree || '',
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE.TEACHERS, Item: item }))
    await sendMessage({ type: 'TEACHER_CREATED', teacher: item })

    return success({ message: 'Tạo giáo viên thành công', teacher: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
