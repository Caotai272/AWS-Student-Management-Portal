// backend/notifications/sendEmailWorker/index.js
// Lambda worker được kích hoạt bởi SQS (event source) để gửi email qua SES.
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' })
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
  const results = []

  for (const record of records) {
    try {
      const message = JSON.parse(record.body)
      console.log('Processing message:', message.type)

      if (message.type === 'STUDENT_CREATED') {
        const s = message.student
        console.log(`Sending welcome email to: ${s.email}`)

        await sendEmail(
          s.email,
          'Chào mừng đến với Student Portal',
          `Xin chào ${s.fullName}, bạn đã được thêm vào hệ thống với mã ${s.studentId}.`
        )

        results.push({ studentId: s.studentId, status: 'sent' })

      } else if (message.type === 'DOCUMENT_UPLOADED') {
        const d = message.document
        console.log(`Sending document notification to: ${FROM_EMAIL}`)

        await sendEmail(
          FROM_EMAIL,  // Gửi đến email từ SES (tài khoản đã verify)
          'Tài liệu mới được upload',
          `Sinh viên ${d.studentId} vừa upload tài liệu: ${d.fileName} (${d.fileUrl}).`
        )

        results.push({ documentId: d.id, status: 'sent' })

      } else {
        console.log(`Không hỗ trợ message type: ${message.type}`)
        results.push({ message: `Không hỗ trợ: ${message.type}`, status: 'skipped' })
      }

    } catch (err) {
      console.error('Lỗi xử lý message SQS:', err)
      results.push({ error: err.message, status: 'failed' })
    }
  }

  return {
    status: 'processed',
    count: records.length,
    successful: results.filter(r => r.status === 'sent').length,
    failed: results.filter(r => r.status === 'failed').length,
    results: results
  }
}