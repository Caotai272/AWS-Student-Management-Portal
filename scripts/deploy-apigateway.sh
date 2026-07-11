#!/usr/bin/env bash
# scripts/deploy-apigateway.sh
# Tạo REST API Gateway + Cognito Authorizer + các resource/method nối Lambda.
# Yêu cầu: AWS CLI đã cấu hình (aws sts get-caller-identity thành công).
#
# Cách dùng:
#   USER_POOL_ID=us-east-1_your-user-pool-id \
#   bash scripts/deploy-apigateway.sh [region]
#
# Mặc định region = us-east-1 (phải KHỚP với User Pool và với vùng đã deploy Lambda).
# In ra invoke URL ở cuối -> điền vào frontend/.env VITE_API_ENDPOINT.
set -e

REGION="${1:-us-east-1}"
USER_POOL_ID="${USER_POOL_ID:?Thiếu biến USER_POOL_ID (vd: us-east-1_your-user-pool-id)}"
API_NAME="student-portal-api"
STAGE="prod"

echo "→ Kiểm tra AWS CLI..."
aws sts get-caller-identity >/dev/null
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "  Account = $ACCOUNT | Region = $REGION"

# --- User Pool ARN ---
USER_POOL_ARN=$(aws cognito-idp describe-user-pool \
  --user-pool-id "$USER_POOL_ID" --region "$REGION" \
  --query "UserPool.Arn" --output text)
echo "→ User Pool ARN = $USER_POOL_ARN"

# --- Tạo / tìm REST API ---
API_ID=$(aws apigateway get-rest-apis --region "$REGION" \
  --query "items[?name=='$API_NAME'].id" --output text)
if [ -z "$API_ID" ]; then
  echo "→ Tạo REST API $API_NAME ..."
  API_ID=$(aws apigateway create-rest-api \
    --name "$API_NAME" --region "$REGION" \
    --endpoint-configuration types=REGIONAL \
    --query "id" --output text)
else
  echo "→ REST API đã tồn tại: $API_ID"
fi

ROOT_ID=$(aws apigateway get-resources --rest-api-id "$API_ID" --region "$REGION" \
  --query "items[?path=='/'].id" --output text)

# --- Cognito Authorizer ---
AUTH_ID=$(aws apigateway get-authorizers --rest-api-id "$API_ID" --region "$REGION" \
  --query "items[?name=='cognito-auth'].id" --output text)
if [ -z "$AUTH_ID" ]; then
  echo "→ Tạo Cognito Authorizer ..."
  AUTH_ID=$(aws apigateway create-authorizer \
    --rest-api-id "$API_ID" --name cognito-auth --type COGNITO_USER_POOLS \
    --provider-arns "$USER_POOL_ARN" \
    --identity-source "method.request.header.Authorization" \
    --region "$REGION" --query "id" --output text)
else
  echo "→ Authorizer đã tồn tại: $AUTH_ID"
fi

LAMBDA_URI_PREFIX="arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT:function"

# Helper: tạo resource (nếu chưa có) và trả về id
get_or_create_resource() {
  local parent=$1 part=$2
  local rid
  rid=$(aws apigateway get-resources --rest-api-id "$API_ID" --region "$REGION" \
    --query "items[?parentId=='$parent' && pathPart=='$part'].id" --output text)
  if [ -z "$rid" ]; then
    rid=$(aws apigateway create-resource --rest-api-id "$API_ID" \
      --parent-id "$parent" --path-part "$part" --region "$REGION" \
      --query "id" --output text)
  fi
  echo "$rid"
}

# Helper: gán method + lambda integration + authorizer + CORS
add_method() {
  local rid=$1 http=$2 fn=$3
  local uri="$LAMBDA_URI_PREFIX:$fn/invocations"

  # Phương pháp này hỗ trợ path parameter {id}
  local resourceArn="arn:aws:execute-api:$REGION:$ACCOUNT:$API_ID$rid/$http/*"

  if [ "$http" != "OPTIONS" ]; then
    # Method cấu hình với Cognito Authorizer
    aws apigateway put-method --rest-api-id "$API_ID" --resource-id "$rid" \
      --http-method "$http" --authorization-type COGNITO_USER_POOLS \
      --authorizer-id "$AUTH_ID" --region "$REGION" >/dev/null 2>&1 || true

    # Method Response với CORS headers
    aws apigateway put-method-response --rest-api-id "$API_ID" --resource-id "$rid" \
      --http-method "$http" --status-code 200 \
      --response-parameters "method.response.header.Access-Control-Allow-Origin='*',method.response.header.Access-Control-Allow-Headers='Content-Type,Authorization',method.response.header.Access-Control-Allow-Methods='GET,POST,PUT,DELETE,OPTIONS'" \
      --region "$REGION" >/dev/null 2>&1 || true

    # Cấp quyền Lambda invoke với resource ARN chính xác
    local sid="${fn}-${rid}-${http}" sid_clean=${sid//[^a-zA-Z0-9]/}
    aws lambda add-permission --function-name "$fn" --statement-id "$sid_clean" \
      --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
      --source-arn "$resourceArn" \
      --region "$REGION" >/dev/null 2>&1 || echo "  (quyền $fn có thể đã tồn tại)"

    # Integration Response với CORS headers
    aws apigateway put-integration-response --rest-api-id "$API_ID" --resource-id "$rid" \
      --http-method "$http" --status-code 200 \
      --response-templates '{}' \
      --response-parameters "method.response.header.Access-Control-Allow-Origin='*',method.response.header.Access-Control-Allow-Headers='Content-Type,Authorization'" \
      --region "$REGION" >/dev/null 2>&1 || true
  fi

  # Lambda Integration
  aws apigateway put-integration --rest-api-id "$API_ID" --resource-id "$rid" \
    --http-method "$http" --type AWS_PROXY --integration-http-method POST \
    --uri "$uri" --region "$REGION" >/dev/null
}

# Helper: OPTIONS (CORS preflight) cho mỗi resource
add_options() {
  local rid=$1
  aws apigateway put-method --rest-api-id "$API_ID" --resource-id "$rid" \
    --http-method OPTIONS --authorization-type NONE --region "$REGION" >/dev/null 2>&1 || true
  aws apigateway put-integration --rest-api-id "$API_ID" --resource-id "$rid" \
    --http-method OPTIONS --type MOCK --request-templates '{}' \
    --region "$REGION" >/dev/null 2>&1 || true
  aws apigateway put-method-response --rest-api-id "$API_ID" --resource-id "$rid" \
    --http-method OPTIONS --status-code 200 \
    --response-parameters "method.response.header.Access-Control-Allow-Origin=false,method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false" \
    --region "$REGION" >/dev/null 2>&1 || true
  aws apigateway put-integration-response --rest-api-id "$API_ID" --resource-id "$rid" \
    --http-method OPTIONS --status-code 200 \
    --response-parameters "method.response.header.Access-Control-Allow-Origin='*',method.response.header.Access-Control-Allow-Headers='Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',method.response.header.Access-Control-Allow-Methods='GET,POST,PUT,DELETE,OPTIONS'" \
    --region "$REGION" >/dev/null 2>&1 || true
}

# ====== Tạo resources & methods ======
COLLECTIONS=("students" "teachers" "grades" "documents" "materials")

# /students
R_STU=$(get_or_create_resource "$ROOT_ID" "students")
for m in GET POST; do add_method "$R_STU" "$m" "$( [ "$m" = GET ] && echo getStudents || echo createStudent )"; done
add_options "$R_STU"
R_STU_I=$(get_or_create_resource "$R_STU" "{id}")
for m in GET PUT DELETE; do
  add_method "$R_STU_I" "$m" "$( [ "$m" = GET ] && echo getStudentById || ([ "$m" = PUT ] && echo updateStudent || echo deleteStudent ))"
 done
add_options "$R_STU_I"

# /teachers
R_TEA=$(get_or_create_resource "$ROOT_ID" "teachers")
for m in GET POST; do add_method "$R_TEA" "$m" "$( [ "$m" = GET ] && echo getTeachers || echo createTeacher )"; done
add_options "$R_TEA"
R_TEA_I=$(get_or_create_resource "$R_TEA" "{id}")
for m in GET PUT DELETE; do
  add_method "$R_TEA_I" "$m" "$( [ "$m" = GET ] && echo getTeacherById || ([ "$m" = PUT ] && echo updateTeacher || echo deleteTeacher ))"
 done
add_options "$R_TEA_I"

# /grades
R_GRA=$(get_or_create_resource "$ROOT_ID" "grades")
for m in GET POST; do add_method "$R_GRA" "$m" "$( [ "$m" = GET ] && echo getGrades || echo createGrade )"; done
add_options "$R_GRA"
R_GRA_I=$(get_or_create_resource "$R_GRA" "{id}")
for m in GET PUT DELETE; do
  add_method "$R_GRA_I" "$m" "$( [ "$m" = GET ] && echo getGradeById || ([ "$m" = PUT ] && echo updateGrade || echo deleteGrade ))"
 done
add_options "$R_GRA_I"

# /documents/upload-url  &  /documents/metadata
R_DOC=$(get_or_create_resource "$ROOT_ID" "documents")
R_DOC_U=$(get_or_create_resource "$R_DOC" "upload-url")
add_method "$R_DOC_U" POST docUploadUrl; add_options "$R_DOC_U"
R_DOC_M=$(get_or_create_resource "$R_DOC" "metadata")
add_method "$R_DOC_M" POST docSaveMetadata; add_options "$R_DOC_M"

# /materials  &  /materials/upload-url  &  /materials/metadata
R_MAT=$(get_or_create_resource "$ROOT_ID" "materials")
add_method "$R_MAT" GET getMaterials; add_options "$R_MAT"
R_MAT_U=$(get_or_create_resource "$R_MAT" "upload-url")
add_method "$R_MAT_U" POST materialUploadUrl; add_options "$R_MAT_U"
R_MAT_M=$(get_or_create_resource "$R_MAT" "metadata")
add_method "$R_MAT_M" POST materialSaveMetadata; add_options "$R_MAT_M"

# ====== Deploy ======
echo "→ Deploy stage $STAGE ..."
aws apigateway create-deployment --rest-api-id "$API_ID" --stage-name "$STAGE" \
  --region "$REGION" --description "deploy $(date +%s)" >/dev/null

echo ""
echo "=== HOÀN TẤT ==="
echo "API ID     = $API_ID"
echo "Invoke URL = https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE"
echo ""
echo "→ Điền vào frontend/.env:"
echo "VITE_API_ENDPOINT=https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE"
echo ""
echo "→ QUAN TRỌNG: deploy Lambda ở CÙNG region ($REGION) qua:"
echo "LAMBDA_ROLE_ARN=arn:aws:iam::$ACCOUNT:role/student-portal-lambda \\"
echo "DOCUMENTS_BUCKET=<bucket> NOTIFICATION_QUEUE_URL=<sqs-url> FROM_EMAIL=<email> \\"
echo "bash scripts/deploy-lambdas.sh $REGION"