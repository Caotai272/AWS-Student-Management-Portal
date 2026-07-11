#!/usr/bin/env bash
# scripts/deploy-dynamodb.sh
# Tạo toàn bộ bảng DynamoDB cho dự án (Students, Documents, Teachers, Grades, Materials).
# Chạy: bash scripts/deploy-dynamodb.sh [region]
set -e

REGION="${1:-ap-southeast-1}"

TABLES=("Students" "Documents" "Teachers" "Grades" "Materials" "Classes")

for TABLE in "${TABLES[@]}"; do
  EXISTS=$(aws dynamodb describe-table --table-name "$TABLE" --region "$REGION" 2>/dev/null || true)
  if [ -n "$EXISTS" ]; then
    echo "✓ Bảng $TABLE đã tồn tại, bỏ qua."
  else
    echo "→ Tạo bảng $TABLE ..."
    aws dynamodb create-table \
      --table-name "$TABLE" \
      --attribute-definitions AttributeName=id,AttributeType=S \
      --key-schema AttributeName=id,KeyType=HASH \
      --billing-mode PAY_PER_REQUEST \
      --region "$REGION"
    echo "✓ Đã tạo $TABLE"
  fi
done

# Tạo GSI hỗ trợ query (không lỗi nếu đã có)
create_gsi () {
  local TABLE=$1 GSI=$2 ATTR=$3
  echo "→ Đảm bảo GSI $GSI trên $TABLE ..."
  aws dynamodb update-table \
    --table-name "$TABLE" \
    --attribute-definitions AttributeName=$ATTR,AttributeType=S \
    --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"$GSI\",\"KeySchema\":[{\"AttributeName\":\"$ATTR\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
    --region "$REGION" 2>/dev/null \
    && echo "✓ GSI $GSI sẵn sàng (hoặc đã tồn tại)" \
    || echo "• Bỏ qua GSI $GSI (có thể đã tồn tại)"
}

create_gsi "Documents"   "studentId-index"   "studentId"
create_gsi "Grades"      "studentId-index"   "studentId"
create_gsi "Grades"      "teacherId-index"   "teacherId"
create_gsi "Materials"   "type-index"        "type"
create_gsi "Materials"   "subject-index"     "subject"

echo ""
echo "Hoàn tất. Danh sách bảng:"
aws dynamodb list-tables --region "$REGION" --query "TableNames" --output table
