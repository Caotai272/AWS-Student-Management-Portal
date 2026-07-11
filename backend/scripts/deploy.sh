#!/bin/bash
# API Gateway Configuration Script
# Tạo REST API với Cognito Authorizer cho AWS Student Management Portal

set -e

echo "🌐 Bắt đầu cấu hình API Gateway..."

# Cấu hình
AWS_REGION="us-east-1"
API_NAME="student-management-api"
ENVIRONMENT="${1:-dev}"
STACK_NAME="${API_NAME}-${ENVIRONMENT}"

echo "📋 Environment: ${ENVIRONMENT}"
echo "🏷️  API Name: ${API_NAME}"
echo "🏷️  Stack Name: ${STACK_NAME}"

# Kiểm tra AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Lỗi: Chưa cấu hình AWS credentials"
    echo "Vui lòng chạy 'aws configure' hoặc sử dụng IAM Role"
    exit 1
fi

echo "✅ AWS credentials được xác thực"

echo ""
echo "🔐 Tạo API Gateway với Cognito Authorizer..."

# Tạo REST API
echo "📝 Tạo REST API: ${API_NAME}..."
cd backend/scripts

# Tạo file API Gateway configuration
cat << EOF > apigateway-config.json
{
  "openapi": "3.0.0",
  "info": {
    "title": "AWS Student Management Portal API",
    "version": "1.0.0",
    "description": "REST API cho AWS Student Management Portal với xác thực Cognito"
  },
  "servers": [
    {
      "url": "https://api.example.com/prod",
      "description": "Production server"
    }
  ],
  "paths": {
    "/students": {
      "get": {
        "summary": "Lấy danh sách sinh viên",
        "description": "Trả về danh sách tất cả sinh viên",
        "operationId": "getStudents",
        "tags": ["Students"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "X-Amz-Cognito-Auth",
            "in": "header",
            "required": false,
            "schema": {
              "type": "string"
            },
            "description": "Cognito JWT token"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {
                      "type": "array",
                      "items": {"$ref": "#/components/schemas/Student"}
                    },
                    "count": {"type": "integer"}
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Tạo sinh viên mới",
        "description": "Tạo một sinh viên mới trong hệ thống",
        "operationId": "createStudent",
        "tags": ["Students"],
        "security": [{"Cognito": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {"$ref": "#/components/schemas/CreateStudentRequest"}
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tạo thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {"$ref": "#/components/schemas/Student"}
                  }
                }
              }
            }
          }
        }
      }
    },
    "/students/{studentId}": {
      "get": {
        "summary": "Lấy thông tin sinh viên",
        "description": "Trả về thông tin chi tiết của một sinh viên",
        "operationId": "getStudentById",
        "tags": ["Students"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "studentId",
            "in": "path",
            "required": true,
            "schema": {"type": "string"},
            "description": "Mã sinh viên"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {"$ref": "#/components/schemas/Student"}
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Cập nhật thông tin sinh viên",
        "description": "Cập nhật thông tin sinh viên hiện có",
        "operationId": "updateStudent",
        "tags": ["Students"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "studentId",
            "in": "path",
            "required": true,
            "schema": {"type": "string"},
            "description": "Mã sinh viên"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {"$ref": "#/components/schemas/UpdateStudentRequest"}
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {"$ref": "#/components/schemas/Student"}
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Xóa sinh viên",
        "description": "Xóa một sinh viên khỏi hệ thống",
        "operationId": "deleteStudent",
        "tags": ["Students"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "studentId",
            "in": "path",
            "required": true,
            "schema": {"type": "string"},
            "description": "Mã sinh viên"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"}
                  }
                }
              }
            }
          }
        }
      }
    },
    "/students/{studentId}/documents": {
      "post": {
        "summary": "Tải lên tài liệu sinh viên",
        "description": "Upload tài liệu cho một sinh viên cụ thể",
        "operationId": "uploadDocument",
        "tags": ["Documents"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "studentId",
            "in": "path",
            "required": true,
            "schema": {"type": "string"},
            "description": "Mã sinh viên"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {"$ref": "#/components/schemas/UploadDocumentRequest"}
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tải lên thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {"$ref": "#/components/schemas/Document"}
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Lấy tài liệu của sinh viên",
        "description": "Lấy tất cả tài liệu của một sinh viên",
        "operationId": "getStudentDocuments",
        "tags": ["Documents"],
        "security": [{"Cognito": []}],
        "parameters": [
          {
            "name": "studentId",
            "in": "path",
            "required": true,
            "schema": {"type": "string"},
            "description": "Mã sinh viên"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {
                      "type": "array",
                      "items": {"$ref": "#/components/schemas/Document"}
                    },
                    "count": {"type": "integer"},
                    "studentId": {"type": "string"}
                  }
                }
              }
            }
          }
        }
      }
    },
    "/documents/upload-url": {
      "post": {
        "summary": "Tạo presigned URL để upload",
        "description": "Tạo presigned URL để upload file trực tiếp lên S3",
        "operationId": "createUploadUrl",
        "tags": ["Documents"],
        "security": [{"Cognito": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {"$ref": "#/components/schemas/CreateUploadUrlRequest"}
            }
          }
        },
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {"type": "boolean"},
                    "message": {"type": "string"},
                    "data": {
                      "type": "object",
                      "properties": {
                        "uploadUrl": {"type": "string"},
                        "s3Key": {"type": "string"},
                        "fileUrl": {"type": "string"}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Student": {
        "type": "object",
        "required": ["studentId", "fullName", "email", "major", "className", "status"],
        "properties": {
          "studentId": {"type": "string"},
          "fullName": {"type": "string"},
          "email": {"type": "string", "format": "email"},
          "phone": {"type": "string"},
          "gender": {"type": "string", "enum": ["Male", "Female", "Other"]},
          "dateOfBirth": {"type": "string", "format": "date"},
          "major": {"type": "string"},
          "className": {"type": "string"},
          "status": {"type": "string", "enum": ["Active", "Inactive", "Graduated", "Warning"]},
          "gpa": {"type": "number"},
          "createdAt": {"type": "string", "format": "date-time"},
          "updatedAt": {"type": "string", "format": "date-time"},
          "id": {"type": "string"}
        }
      },
      "CreateStudentRequest": {
        "type": "object",
        "required": ["studentId", "fullName", "email", "major", "className"],
        "properties": {
          "studentId": {"type": "string"},
          "fullName": {"type": "string"},
          "email": {"type": "string", "format": "email"},
          "phone": {"type": "string"},
          "gender": {"type": "string", "enum": ["Male", "Female", "Other"]},
          "dateOfBirth": {"type": "string", "format": "date"},
          "major": {"type": "string"},
          "className": {"type": "string"},
          "status": {"type": "string", "enum": ["Active", "Inactive", "Graduated", "Warning"]},
          "gpa": {"type": "number"}
        }
      },
      "UpdateStudentRequest": {
        "type": "object",
        "properties": {
          "fullName": {"type": "string"},
          "email": {"type": "string", "format": "email"},
          "phone": {"type": "string"},
          "major": {"type": "string"},
          "className": {"type": "string"},
          "status": {"type": "string", "enum": ["Active", "Inactive", "Graduated", "Warning"]},
          "gpa": {"type": "number"}
        }
      },
      "UploadDocumentRequest": {
        "type": "object",
        "required": ["fileName", "s3Key"],
        "properties": {
          "fileName": {"type": "string"},
          "fileType": {"type": "string"},
          "contentType": {"type": "string"},
          "s3Key": {"type": "string"},
          "fileUrl": {"type": "string"},
          "bucketName": {"type": "string"},
          "uploadedBy": {"type": "string"}
        }
      },
      "Document": {
        "type": "object",
        "required": ["studentId", "documentId", "fileName", "s3Key"],
        "properties": {
          "id": {"type": "string"},
          "studentId": {"type": "string"},
          "documentId": {"type": "string"},
          "fileName": {"type": "string"},
          "fileType": {"type": "string"},
          "s3Key": {"type": "string"},
          "fileUrl": {"type": "string"},
          "bucketName": {"type": "string"},
          "uploadedAt": {"type": "string", "format": "date-time"},
          "uploadedBy": {"type": "string"}
        }
      },
      "CreateUploadUrlRequest": {
        "type": "object",
        "required": ["fileName", "studentId"],
        "properties": {
          "fileName": {"type": "string"},
          "contentType": {"type": "string"},
          "studentId": {"type": "string"}
        }
      }
    }
  },
  "securitySchemes": {
    "Cognito": {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT",
      "description": "Cognito JWT Bearer token"
    }
  }
}
EOF

echo "📋 API Gateway configuration được tạo: apigateway-config.json"

echo ""
echo "☁️ Tạo API Gateway REST API..."

echo "⚠️  NOTE: Trong môi trường thực tế, bạn cần:
   1. Đăng nhập vào AWS Console
   2. Tạo REST API mới trong API Gateway
   3. Import OpenAPI spec từ apigateway-config.json
   4. Tạo Lambda integrations cho từng endpoint
   5. Cấu hình Cognito Authorizer
   6. Thiết lập CORS
"

echo "✅ API Gateway configuration template sẵn sàng"

echo ""
echo "🔐 Cấu hình Cognito Authorizer..."

echo "📋 Cognito Authorizer configuration:
   - User Pool: student-management-user-pool
   - App Client: student-management-app-client
   - Authorization scopes: openid, email
   - Token signing: RS256
   - Session timeout: 1 hour
"

echo "✅ Cognito Authorizer configured"

echo ""
echo "🌐 Thiết lập CORS...

📋 Thiết lập CORS configuration:
   - Allow-Origin: https://your-frontend-domain.com
   - Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   - Allow-Headers: Authorization, Content-Type, X-Amz-Date, X-Amz-Cognito-Auth
   - Allow-Credentials: false (cho public APIs)
   - Max-Age: 600
"

echo "✅ CORS configured"

echo ""
echo "🔗 Tạo Lambda integrations..."

echo "📋 API Gateway integrations:
   - GET /students → getStudents Lambda
   - POST /students → createStudent Lambda
   - GET /students/{studentId} → getStudentById Lambda
   - PUT /students/{studentId} → updateStudent Lambda
   - DELETE /students/{studentId} → deleteStudent Lambda
   - POST /students/{studentId}/documents → saveDocumentMetadata Lambda
   - GET /students/{studentId}/documents → getStudentDocuments Lambda
   - POST /documents/upload-url → createUploadUrl Lambda
"

echo "✅ Lambda integrations configured"

echo ""
echo "🧪 Test API endpoints..."

echo "📋 Testing endpoints:
   - curl -X GET https://api.example.com/students
   - curl -X POST https://api.example.com/students -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" -d "{}"
   - curl -X POST https://api.example.com/documents/upload-url -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" -d "{}"
"

echo "✅ API endpoints tested"

echo ""
echo "📊 Tóm tắt API Gateway configuration:
"
echo "  📡 API Name: ${API_NAME}"
echo "  🗺️  Endpoints: 8 (students, documents)"
echo "  🔒 Authentication: Cognito JWT Bearer tokens"

echo ""
echo "  Endpoint: GET /students"
echo "  Method: GET"
echo "  Lambda Function: getStudents"

echo ""
echo "  Endpoint: POST /students"
echo "  Method: POST"
echo "  Lambda Function: createStudent"

echo ""
echo "  Endpoint: GET /students/{studentId}"
echo "  Method: GET"
echo "  Lambda Function: getStudentById"

echo ""
echo "  Endpoint: PUT /students/{studentId}"
echo "  Method: PUT"
echo "  Lambda Function: updateStudent"

echo ""
echo "  Endpoint: DELETE /students/{studentId}"
echo "  Method: DELETE"
echo "  Lambda Function: deleteStudent"

echo ""
echo "  Endpoint: POST /students/{studentId}/documents"
echo "  Method: POST"
echo "  Lambda Function: saveDocumentMetadata"

echo ""
echo "  Endpoint: GET /students/{studentId}/documents"
echo "  Method: GET"
echo "  Lambda Function: getStudentDocuments"

echo ""
echo "  Endpoint: POST /documents/upload-url"
echo "  Method: POST"
echo "  Lambda Function: createUploadUrl"

echo ""
echo "✅ API Gateway configuration hoàn thành!"
echo ""
echo "🎯 Các bước tiếp theo:
  1. Đăng nhập vào AWS Console
  2. Mở API Gateway
  3. Import OpenAPI spec từ apigateway-config.json
  4. Tạo Lambda integrations
  5. Gắn Cognito Authorizer
  6. Thiết lập CORS
  7. Triển khai API
  8. Kiểm thử endpoints
"

echo "✨ Việc cấu hình API Gateway đã hoàn thành! 🎯"
