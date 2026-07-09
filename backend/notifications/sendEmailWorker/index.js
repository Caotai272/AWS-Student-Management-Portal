// notifications/sendEmailWorker/index.js
// Lambda worker được kích hoạt bởi SQS (event source) để gửi email qua SES.
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: process.env.AWS_REGION || 'ap-southeast-1' })
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com'

async function sendEmail(to, subject, bodyText) {
  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: bodyText } }
    }
  })
  return ses.send(command)
}

export const handler = async (event) => {
  const records = event.Records || []
  for (const record of records) {
    try {
      const message = JSON.parse(record.body)
      if (message.type === 'STUDENT_CREATED') {
        const s = message.student
        await sendEmail(
          s.email,
          'Chào mừng đến với Student Portal',
          `Xin chào ${s.fullName}, bạn đã được thêm vào hệ thống với mã ${s.studentId}.`
        )
      } else if (message.type === 'DOCUMENT_UPLOADED') {
        const d = message.document
        await sendEmail(
          FROM_EMAIL,
          'Tài liệu mới được upload',
          `Sinh viên ${d.studentId} vừa upload tài liệu: ${d.fileName} (${d.fileUrl}).`
        )
      }
    } catch (err) {
      console.error('Lỗi gửi email:', err)
    }
  }
  return { status: 'processed', count: records.length }
}
