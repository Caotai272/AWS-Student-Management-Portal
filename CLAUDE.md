# Student Management Portal

This project is a comprehensive student management system focused on AWS cloud-native implementation. The goal is to create a production-ready application that demonstrates various AWS services and best practices.

**Critical Issues Found:**
- Missing authentication middleware on document APIs: createUploadUrl, saveDocumentMetadata, getStudentDocuments (but present on students/, teachers/, grades/)
- Outdated README documentation for environment variables: actual frontend uses VITE_API_ENDPOINT etc., but README docs different values
- Unimplemented features despite existing code: Missing async event emitter/middleware for role-conditional envelope routing (Admin, Staff, Teacher, Student) in Lambda handlers
- Missing common utility implementations: Complete validators for all entities (teacher, grade, material), comprehensive s3 utilities with S3Client wrapper, full-indexed dynamodb query helpers