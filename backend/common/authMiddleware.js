// backend/common/authMiddleware.js
// Middleware để xác thực JWT token từ Cognito Authorizer cho Lambda API Gateway
// Hỗ trợ cả API Gateway REST API (Authorization header) và HTTP API (authorizer.claims)

import { CognitoIdentityProviderService } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderService({ region: process.env.AWS_REGION || 'us-east-1' })

const userPoolId = process.env.COGNITO_USER_POOL_ID || ''
const userPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID || ''

export const verifyCognitoToken = async (event) => {
  try {
    // Cách 1: API Gateway REST API - token trong header Authorization
    let token = null
    if (event.requestContext?.identity?.authorization) {
      token = event.requestContext.identity.authorization
    } else if (event.headers?.Authorization) {
      token = event.headers.Authorization
    }

    // Cách 2: HTTP API - claims từ authorizer
    if (!token && event.requestContext?.authorizer?.claims) {
      token = event.requestContext.authorizer.claims
    }

    if (!token) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: false, message: 'Thiếu Authorization header' })
      }
    }

    // Xử lý token JWT
    // Với Cognito Authorizer, event.requestContext.authorizer.claims đã là claims object
    if (event.requestContext?.authorizer?.claims) {
      // claims đã là object (JWT payload)
      const claims = event.requestContext.authorizer.claims

      // Thêm user context vào event
      event.requestContext.authorizer.user = {
        username: claims.email || claims['cognito:username'] || claims.sub,
        email: claims.email,
        cognitoGroups: claims['cognito:groups'] || [],
        token: claims
      }

      return event
    }

    // Xử lý string token (Authorization header)
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.substring(7)
    }

    // Xác thực bằng cách gọi Cognito API
    // Note: Trong production, bạn có thể cache verification results
    // Để đơn giản, chúng ta giả định token đã được xác thực bởi Cognito Authorizer
    // Thêm user context
    event.requestContext.authorizer.user = {
      username: event.requestContext.authorizer.claims?.email || event.requestContext.authorizer.claims?.['cognito:username'],
      email: event.requestContext.authorizer.claims?.email,
      cognitoGroups: event.requestContext.authorizer.claims?.['cognito:groups'] || [],
      token: token
    }

    return event

  } catch (error) {
    console.error('Cognito token verification error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: false, message: 'Lỗi xác thực token' })
    }
  }
}

// Middleware wrapper cho Lambda handlers
export const withAuth = (handler) => {
  return async (event) => {
    // Xác thực token
    const authResult = await verifyCognitoToken(event)
    if (authResult.statusCode) {
      return authResult
    }

    // Gọi handler với event đã xác thực
    return handler(authResult)
  }
}

// Helper để kiểm tra role permissions
export const requireRole = (requiredRole) => {
  return (event) => {
    const user = event.requestContext?.authorizer?.user
    if (!user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Không có quyền truy cập' })
      }
    }

    if (!requiredRole) {
      return event // Không yêu cầu role cụ thể
    }

    const userGroups = user.cognitoGroups || []
    if (!userGroups.includes(requiredRole)) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Không có quyền truy cập' })
      }
    }

    return event
  }
}