// grades/createGrade/index.js
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { validateGrade } from '../../common/validators'
import { sendMessage } from '../../common/sqs'

export const handler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errs = validateGrade(data)
    if (errs.length > 0) return error(errs.join('; '), 400)

    const item = {
      id: `${data.studentId}-${data.subject}-${Date.now()}`,
      studentId: data.studentId,
      teacherId: data.teacherId,
      subject: data.subject,
      semester: data.semester || '',
      score: Number(data.score),
      note: data.note || '',
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE.GRADES, Item: item }))
    await sendMessage({ type: 'GRADE_POSTED', grade: item })

    return success({ message: 'Đăng điểm thành công', grade: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
