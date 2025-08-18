# School Management System - Backend

A robust backend system for managing school operations built with Node.js, Express, MongoDB, and Mongoose.

## Features

- **User Management**
  - Admin, Teacher, and Student roles
  - Registration and authentication
  - User blocking/unblocking
- **Result Management**
  - Create, read, update, delete results
  - Admin can assign results to any student
  - Teachers can manage their students' results
- **Assignment System**
  - Assign students to teachers
  - Bulk assignment capability
- **SMS Notifications**
  - Send progress alerts to students/parents
  - SMS history tracking

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT
- **Validation**: Custom middleware
- **Other**: CORS, dotenv

## API Endpoints

### Authentication

- `POST /api/auth/register/admin` - Register admin
- `POST /api/auth/register/teacher` - Register teacher
- `POST /api/auth/register/student` - Register student
- `POST /api/auth/login` - Login user

### User Management

- `GET /api/users` - Get all users
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `PUT /api/users/:id/block` - Block user
- `PUT /api/users/:id/unblock` - Unblock user

### Result Management

- `POST /api/add-result` - Add new result (teacher)
- `GET /api/student/:studentId` - Get student results
- `GET /api/teacher` - Get teacher's results
- `GET /api/teacher/all-results` - Get all results for teacher's students
- `PATCH /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result
- `POST /api/admin` - Admin create result
- `PATCH /api/admin/:id` - Admin update result
- `DELETE /api/admin/:id` - Admin delete result
- `GET /api/all-results` - Get all results

### SMS Notifications

- `POST /api/sms/send` - Send SMS
- `POST /api/sms/progress-alert` - Send progress alert
- `GET /api/sms/history` - Get SMS history

### Assignments

- `POST /api/assign` - Assign student to teacher
- `POST /api/assign/bulk` - Bulk assign students
- `GET /api/teacher/:teacherId/students` - Get teacher's students
- `GET /api/student/:studentId/teachers` - Get student's teachers
- `GET /api/teacher/students` - Get All student's teachers
- `DELETE /api/assignment/:assignmentId` - Remove assignment

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-management-backend.git
   cd school-management-backend
   npm install
   ```
2. Setup ENV:
   ```.env
   PORT=8000
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```
3. Start the development server:
   ```terminal
    npm run start:dev
   ```
4. For production:
   ```terminal
    npm run start:prod
    npm run build
   ```
