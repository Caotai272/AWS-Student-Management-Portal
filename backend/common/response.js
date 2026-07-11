// common/response.js
// Utilities chuẩn hóa response cho API Gateway (tuân theo README spec)

module.exports.success = (data, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
  },
  body: JSON.stringify({
    success: true,
    message: "Yêu cầu xử lý thành công",
    data: data
  })
})

module.exports.error = (message, statusCode = 500) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
  },
  body: JSON.stringify({
    success: false,
    message: message,
    error: message
  })
})
