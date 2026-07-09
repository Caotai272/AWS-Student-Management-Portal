// common/response.js
// Hàm helper chuẩn hóa response trả về cho API Gateway (proxy integration).
export const success = (data, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
  },
  body: JSON.stringify(data)
})

export const error = (message, statusCode = 500) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
  },
  body: JSON.stringify({ message })
})

export default { success, error }
