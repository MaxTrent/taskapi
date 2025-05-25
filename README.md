TaskAPI

TaskAPI is a RESTful API for task management, time tracking, and productivity reporting. Built with TypeScript, Express, and Sequelize, it enables users to create tasks, log time, and generate reports. Authentication uses JWT with OTP (email via SendGrid, SMS via Twilio), ensuring security. Ideal for personal productivity or team workflows.
Features

Task CRUD: Create, read, update, delete tasks with title, description, and status.
Time Tracking: Log time per task, view logs, and get total time spent.
Reports: Analyze time usage and task completion (admin-only for completion).
Auth: Register, verify OTP, and login with JWT.
Pagination: Filter and paginate task and log lists.
Type Safety: Zod validation and TypeScript.
Logging: Detailed logs in /logs/app.log.
Database: PostgreSQL with migrations.

Tech Stack

Runtime: Node.js
Framework: Express
Language: TypeScript
ORM: Sequelize
Database: PostgreSQL
Auth: JWT, SendGrid, Twilio
Validation: Zod
Logging: Custom logger

Prerequisites

Node.js 
PostgreSQL
SendGrid account
Twilio account
Git
npm

Installation

Clone the Repo:
git clone https://github.com/maxtrent/taskapi.git
cd taskapi


Install Dependencies:
npm install


Configure Environment:Create .env in the root using .env.sample as reference


Set Up Database:

Start PostgreSQL
Create database:psql -U username -c "CREATE DATABASE taskapi;"


Run migrations:npm run migrate




Start Server:
npm run dev



API Endpoints
All endpoints except auth require Authorization: Bearer <token>.
Authentication



Method
Endpoint
Description
Input (Body)
Output



POST
/auth/register
Register with OTP
{ email, password, deliveryMethod, phone? }
{ id, email, message }


POST
/auth/verify-otp
Verify OTP
{ email, otp }
{ token, message }


POST
/auth/login
Login for JWT
{ email, password }
{ token }


Note: Test OTP is 123456.
Tasks



Method
Endpoint
Description
Input (Body/Query)
Output



POST
/tasks
Create task
{ title, description?, status? }
Task


GET
/tasks
List tasks (paginated)
?status=pending&page=1&limit=10
{ tasks, total, page, limit }


GET
/tasks/:id
Get task by ID
:id
Task


PUT
/tasks/:id
Update task
:id, { title?, description?, status? }
Updated task


DELETE
/tasks/:id
Delete task
:id
(204 No Content)


Task Logs



Method
Endpoint
Description
Input (Body/Query)
Output



POST
/tasks/:id/time
Log time for task
:id, { startTime, endTime }
TaskLog


GET
/tasks/:id/logs
List task logs (paginated)
:id, ?page=1&limit=10
{ logs, total, page, limit }


GET
/tasks/:id/time-total
Get total time for task
:id
{ taskId, totalTime }


Reports



Method
Endpoint
Description
Input (Body/Query)
Output



GET
/tasks/report/time
Get time across all tasks
None
{ logs, totalTime }


GET
/tasks/report/completion
Get completion rate (admin)
None
{ total, completed, rate }


Example Task:
{
  "id": 1,
  "userId": 1,
  "title": "Write Report",
  "description": "Draft report",
  "status": "pending",
  "createdAt": "2025-05-25T22:00:00Z",
  "updatedAt": "2025-05-25T22:00:00Z"
}

Example TaskLog:
{
  "id": 1,
  "taskId": 1,
  "startTime": "2025-05-25T12:00:00Z",
  "endTime": "2025-05-25T13:00:00Z",
  "duration": 3600,
  "createdAt": "2025-05-25T13:00:00Z"
}

Testing

Run Tests:
npm run test


Lint:
npm run lint


Postman:

Import postman_collection.json.
Set environment:{
  "baseUrl": "",
  "token": "",
  "adminToken": "",
  "userId": "",
  "taskId": ""
}



