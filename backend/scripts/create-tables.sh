// backend/scripts/create-tables.sh
#!/bin/bash
# Script tạo các bảng DynamoDB cần thiết cho AWS Student Management Portal
# Các bảng được xác định trong README.md

set -e

echo "🔍 Bắt đầu tạo các bảng DynamoDB..."

# Cấu hình
current_region="us-east-1"

# Kiểm tra AWS Credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Lỗi: Chưa cấu hình AWS credentials hoặc không hợp lệ"
    echo "Vui lòng chạy 'aws configure' hoặc xuất AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
    exit 1
fi

# Tạo bảng Students
tables_to_create=(
    "Students|PartitionKey=studentId, String"
    "StudentDocuments|PartitionKey=studentId, SortKey=documentId, String"
)

echo "📋 Kiểm tra sự tồn tại của các bảng..."

for table_spec in "${tables_to_create[@]}"; do
    table_name=$(echo $table_spec | cut -d'|' -f1)
    key_spec=$(echo $table_spec | cut -d'|' -f2)

    # Kiểm tra sự tồn tại
    if aws dynamodb describe-table --table-name "$table_name" --region "$current_region" &> /dev/null; then
        echo "✅ Bảng $table_name đã tồn tại"
    else
        echo "🏗️  Tạo bảng $table_name..."

        # Phân tích key_spec
        partition_key=$(echo $key_spec | cut -d',' -f1 | sed 's/PartitionKey=//')
        partition_key_type=$(echo $key_spec | cut -d',' -f2)
        sort_key=""
        sort_key_type=""

        if echo "$key_spec" | grep -q "SortKey"; then
            sort_key=$(echo $key_spec | grep "SortKey" | cut -d',' -f1 | sed 's/SortKey=//')
            sort_key_type=$(echo $key_spec | grep "SortKey" | cut -d',' -f2)
        fi

        # Tạo bảng lệnh
        if [ -z "$sort_key" ]; then
            create_cmd="aws dynamodb create-table \"
            create_cmd+="--table-name \"$table_name\" \"
            create_cmd+="--attribute-definitions \""
            create_cmd+="AttributeName=$partition_key,AttributeType=$partition_key_type\" \"
            create_cmd+="--key-schema \""
            create_cmd+="AttributeName=$partition_key,KeyType=HASH\" \"
            create_cmd+="--billing-mode PAY_PER_REQUEST \"
            create_cmd+="--region \"$current_region\""
        else
            create_cmd="aws dynamodb create-table \"
            create_cmd+="--table-name \"$table_name\" \"
            create_cmd+="--attribute-definitions \""
            create_cmd+="AttributeName=$partition_key,AttributeType=$partition_key_type,\" \"
            create_cmd+="AttributeName=$sort_key,AttributeType=$sort_key_type\" \"
            create_cmd+="--key-schema \""
            create_cmd+="AttributeName=$partition_key,KeyType=HASH,\" \"
            create_cmd+="AttributeName=$sort_key,KeyType=RANGE\" \"
            create_cmd+="--billing-mode PAY_PER_REQUEST \"
            create_cmd+="--region \"$current_region\""
        fi

        # Thực hiện create table
        eval $create_cmd

        # Chỉ đợi cho đến khi bảng được tạo (trạng thái ACTIVE)
        echo "⏳ Đang chờ $table_name chuyển sang trạng thái ACTIVE..."
        while true; do
            table_status=$(aws dynamodb describe-table --table-name "$table_name" --region "$current_region" --output json | jq -r '.Table.TableStatus')
            if [ "$table_status" = "ACTIVE" ]; then
                echo "✅ Bảng $table_name đã được tạo thành công"
                break
            elif [ "$table_status" = "FAILED" ]; then
                echo "❌ Lỗi: Bảng $table_name đã thất bại trong quá trình tạo"
                aws dynamodb describe-table --table-name "$table_name" --region "$current_region"
                exit 1
            else
                echo "   Trạng thái: $table_status..."
                sleep 3
            fi
        done
    fi

done

echo "✨ Hoàn tất tạo các bảng DynamoDB!"
echo "📊 Bạn có thể xác nhận trạng thái bởi:"
echo "aws dynamodb describe-table --table-name Students"
echo "aws dynamodb describe-table --table-name StudentDocuments"
echo ""
echo " Các thuộc tính của các bảng này phù hợp với thiết kế trong README.md:"
echo ""
echo "Bảng Students:"
echo "  - Khóa chính: studentId (Partition Key, String)"
echo "  - Các trường đề xuất: studentId, fullName, email, phone, gender, dateOfBirth, major, className, status, createdAt, updatedAt"
echo ""
echo "Bảng StudentDocuments:"
echo "  - Khóa chính: studentId (Partition Key, String), documentId (Sort Key, String)"
echo "  - Các trường đề xuất: studentId, documentId, fileName, fileType, s3Key, bucketName, fileUrl, uploadedAt, uploadedBy"
echo ""
echo "Các bảng này sẵn sàng để lưu trữ dữ liệu sinh viên và tài liệu!"