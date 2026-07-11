# Student Management Portal

This project is a comprehensive student management system focused on AWS cloud-native implementation. The goal is to create a production-ready application that demonstrates various AWS services and best practices.

**Critical Issues Found:**
- CORS blocking frontend-api connection due to missing Access-Control-Allow-Origin headers in API Gateway
- Authentication middleware missing or incomplete on Lambda functions (students, documents, teachers, grades, materials)
- Mock data used in StudentList instead of real backend API calls
- Outdated README documentation for environment variables
- Incomplete Teacher, Grades, Materials CRUD APIs implementation