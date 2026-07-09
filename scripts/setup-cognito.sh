#!/usr/bin/env bash
# scripts/setup-cognito.sh
# Tạo Cognito User Pool + App Client (không secret) cho đăng nhập frontend.
# Trả về UserPoolId và AppClientId để điền vào frontend/src/config/awsConfig.js.
# Chạy: bash scripts/setup-cognito.sh [region]
set -e

REGION="${1:-ap-southeast-1}"
POOL_NAME="student-portal-pool"

echo "→ Tạo User Pool $POOL_NAME ..."
POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "$POOL_NAME" \
  --region "$REGION" \
  --username-attributes email \
  --auto-verified-attributes email \
  --query "UserPool.Id" --output text)

echo "→ Tạo App Client (no secret) ..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id "$POOL_ID" \
  --client-name "student-portal-web" \
  --region "$REGION" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query "UserPoolClient.ClientId" --output text)

echo ""
echo "=== Thông tin Cognito (copy vào awsConfig.js) ==="
echo "UserPoolId = $POOL_ID"
echo "AppClientId = $CLIENT_ID"
echo ""
echo "→ Tạo user demo (admin / Abc12345):"
aws cognito-idp admin-create-user \
  --user-pool-id "$POOL_ID" \
  --username admin@example.com \
  --temporary-password "Abc12345!" \
  --region "$REGION" >/dev/null \
  && echo "✓ Đã tạo user admin@example.com (đăng nhập lần đầu sẽ bắt đổi mật khẩu)" \
  || echo "• User có thể đã tồn tại"
