// common/sqs.js
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'ap-southeast-1' })
const QUEUE_URL = process.env.NOTIFICATION_QUEUE_URL || ''

export const sendMessage = async (messageBody) => {
  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: typeof messageBody === 'string' ? messageBody : JSON.stringify(messageBody)
  })
  return sqs.send(command)
}

export default { sendMessage }
