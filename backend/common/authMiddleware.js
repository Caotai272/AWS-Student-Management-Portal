// backend/common/authMiddleware.js
// Middleware để xác thực JWT token từ Cognito Authorizer cho Lambda API Gateway
// Hỗ trợ cả API Gateway REST API (Authorization header) và HTTP API (authorizer.claims)
// Bao gồm JWT validation thực sự bằng cách gọi Cognito API và RBAC enforcement

import jwt from 'jsonwebtoken'
import jwksRsa from 'jwks-rsa'
import { CognitoIdentityProvider, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProvider({ region: process.env.AWS_REGION || 'us-east-1' })

const userPoolId = process.env.COGNITO_USER_POOL_ID || ''
const userPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID || ''
const userPoolRegion = process.env.AWS_REGION || 'us-east-1'

// Cache cho JWKS để tránh gọi API liên tục
let jwksClient = null
let cachedJwks = null
const JWKS_CACHE_TTL = 3600000 // 1 hour

async function getJwksClient() {
  if (!jwksClient || Date.now() - cachedJwks.timestamp > JWKS_CACHE_TTL) {
    try {
      const domain = `https://cognito-idp.${userPoolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
      jwksClient = jwksRsa({ jwksUri: domain })
      cachedJwks = { timestamp: Date.now() }
    } catch (error) {
      console.error('Failed to fetch JWKS:', error)
      throw error
    }
  }
  return jwksClient
}

export const verifyCognitoToken = async (event) => {
  try {
    // Cách 1: API Gateway REST API - token trong header Authorization
    let token = null
    if (event.requestContext?.identity?.authorization) {
      token = event.requestContext.identity.authorization
    } else if (event.headers?.Authorization) {
      token = event.headers.Authorization
    }

    // Cách 2: HTTP API - claims từ authorizer (legacy mode)
    if (!token && event.requestContext?.authorizer?.claims) {
      // Nếu API Gateway đã verify token, chúng ta trust claims
      // Nhưng vẫn verify token nếu có sẵn
      const claims = event.requestContext.authorizer.claims
      token = claims.id_token || claims.access_token || token
    }

    if (!token) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
        },
        body: JSON.stringify({ success: false, message: 'Thiếu Authorization header' })
      }
    }

    // Trích xuất token từ Bearer prefix
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.substring(7)
    }

    // Xác minh token
    const decodedToken = await verifyToken(token)

    // Lấy thông tin user từ Cognito
    let user = await getUserFromCognito(decodedToken.sub)

    if (!user) {
      console.warn('⚠️ Không thể lấy thông tin từ Cognito API (có thể do thiếu quyền IAM), sử dụng claims trực tiếp từ JWT.')
      user = {
        Username: decodedToken.sub || decodedToken.username || 'unknown',
        Attributes: [
          { Name: 'email', Value: decodedToken.email || '' }
        ],
        UserGroups: decodedToken['cognito:groups'] || []
      }
    }

    // Thêm user context vào event
    if (!event.requestContext.authorizer) {
      event.requestContext.authorizer = {}
    }

    event.requestContext.authorizer.user = {
      username: user.Username,
      email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
      cognitoGroups: decodedToken['cognito:groups'] || user.UserGroups || [],
      token: decodedToken
    }

    return event

  } catch (error) {
    console.error('Cognito token verification error:', error)
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
      },
      body: JSON.stringify({ success: false, message: 'Xác thực token thất bại' })
    }
  }
}

async function verifyToken(token) {
  try {
    // Decode header để lấy key ID
    const decoded = jwt.decode(token, { complete: true })
    const kid = decoded?.header?.kid

    // Lấy JWKS client
    const client = await getJwksClient()

    // Lấy public key từ JWKS
    const publicKey = await client.getSigningKey(kid)
    const signingKey = publicKey.getPublicKey()

    // Xác minh token
    const decodedToken = jwt.verify(token, signingKey, {
      audience: userPoolClientId,
      issuer: `https://cognito-idp.${userPoolRegion}.amazonaws.com/${userPoolId}`
    })

    return decodedToken
  } catch (error) {
    console.error('JWT verification failed:', error.message)
    throw new Error('JWT verification failed')
  }
}

async function getUserFromCognito(userSub) {
  try {
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: userSub
    })

    const response = await cognitoClient.send(command)

    // Map Cognito User attributes
    const user = {
      Username: response.Username || response.User?.Username || userSub,
      UserGroups: response.UserGroups || [],
      Attributes: response.UserAttributes || response.User?.Attributes || []
    }

    return user
  } catch (error) {
    console.error('Failed to get user from Cognito:', error)
    return null
  }
}

// Middleware wrapper cho Lambda handlers
export const withAuth = (handler) => {
  return async (event) => {
    // Xác thực token nếu chưa xác thực trước đó
    if (!event.requestContext?.authorizer?.user) {
      const authResult = await verifyCognitoToken(event)
      if (authResult.statusCode) {
        return authResult
      }
      event = authResult
    }

    // Gọi handler với event đã xác thực
    return handler(event)
  }
}

// Helper để kiểm tra role permissions
export const requireRole = (requiredRole) => {
  return (handler) => {
    return async (event) => {
      // Tự động xác thực token nếu chưa gọi qua withAuth trước đó
      if (!event.requestContext?.authorizer?.user) {
        const authResult = await verifyCognitoToken(event)
        if (authResult.statusCode) {
          return authResult
        }
        event = authResult
      }

      const user = event.requestContext?.authorizer?.user
      if (!user) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
          },
          body: JSON.stringify({ success: false, message: 'Không có quyền truy cập' })
        }
      }

      if (!requiredRole) {
        return handler(event) // Không yêu cầu role cụ thể
      }

      const userGroups = user.cognitoGroups || []
      // Cho phép Admin và Staff tự động bypass mọi quyền kiểm tra
      if (!userGroups.includes(requiredRole) && !userGroups.includes('Admin') && !userGroups.includes('Staff')) {
        return {
          statusCode: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
          },
          body: JSON.stringify({ success: false, message: 'Không có quyền truy cập' })
        }
      }

      return handler(event)
    }
  }
}