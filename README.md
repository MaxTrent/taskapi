TaskAPI
TaskAPI is a RESTful API for task management, time tracking, and productivity reporting. Built with TypeScript, Express, and Sequelize, it enables users to create tasks, log time, and generate reports. Authentication uses JWT with OTP (email via SendGrid, SMS via Twilio). OTPs are sent via email but may appear in spam/junk folders if not in your inbox. Deployed live at https://taskapi-rtc7.onrender.com.
Features

Task CRUD: Create, read, update, delete tasks with title, description, and status.
Time Tracking: Log time per task, view logs, and get total time spent.
Reports: Analyze time usage and task completion (admin-only for completion).
Auth: Register, verify OTP, and login with JWT.
Pagination: Filter and paginate task and log lists.
Type Safety: Joi validation and TypeScript.
Logging: Detailed logs in /logs/app.log.
Database: PostgreSQL with migrations.
Deployment: Dockerized, deployed on Render.

Tech Stack

Runtime: Node.js
Framework: Express
Language: TypeScript
ORM: Sequelize
Database: PostgreSQL
Auth: JWT, SendGrid, Twilio
Validation: Joi
Logging: Winston
Deployment: Docker, Render

Prerequisites

Node.js
PostgreSQL
SendGrid account
Twilio account
Git
npm
Docker (for local/containerized deployment)

Installation

Clone the Repo:
git clone https://github.com/samueladelowo/taskapi.git
cd taskapi


Install Dependencies:
npm install


Configure Environment:

Create .env in the root using .env.sample:DATABASE_URL=postgresql://samuel:password@db:5432/taskapi
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_URL=http://localhost:3000
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=your_email@example.com
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
NODE_ENV=development




Set Up Database:

Start PostgreSQL locally or use Docker.
Create database:psql -U username -c "CREATE DATABASE taskapi;"


Run migrations:npx sequelize-cli db:migrate --config config/config.cjs




Run Locally (Docker):
docker-compose up --build


Run Locally (Without Docker):
npm run dev



API Endpoints
All endpoints except /api/auth/* require Authorization: Bearer <token>.
Authentication



Method
Endpoint
Description
Input (Body)
Output



POST
/api/auth/register
Register with OTP
{ email, password, deliveryMethod, phone? }
{ id, email, message }


POST
/api/auth/verify-otp
Verify OTP
{ email, otp }
{ token, message }


POST
/api/auth/login
Login for JWT
{ email, password }
{ token }


Note: Test OTP is 123456. For email OTPs, check spam/junk folder if not received.
Tasks



Method
Endpoint
Description
Input (Body/Query)
Output



POST
/api/tasks
Create task
{ title, description?, status? }
Task


GET
/api/tasks
List tasks (paginated)
?status=pending&page=1&limit=10
{ tasks, total, page, limit }


GET
/api/tasks/:id
Get task by ID
:id
Task


PUT
/api/tasks/:id
Update task
:id, { title?, description?, status? }
Updated task


DELETE
/api/tasks/:id
Delete task
:id
(204 No Content)


Task Logs



Method
Endpoint
Description
Input
Output



POST
/api/tasks/:id/time
Log time for task
:id, { startTime, endTime }
TaskLog


GET
/api/tasks/:id/logs
List task logs (paginated)
:id, ?page=1&limit=10
{ logs, total, page, limit }


GET
/api/tasks/:id/time-total
Get total time for task
:id
{ taskId, totalTime }


Reports



Method
Endpoint
Description
Input (GET)
Output



GET
/api/tasks/report/time
Get time across tasks
None
{ logs, totalTime }


GET
/api/tasks/report/completion
Get completion rate (admin)
None
{ total, completed, rate }


Example Task
{
  "id": 1,
  "userId": "1",
  "title": "Write Report",
  "description": "Draft report",
  "status": "pending",
  "created_at": "2025-05-26T00:00:00Z",
  "updated_at": "2025-05-26T00:00:00Z"
}

Example TaskLog
{
  "id": "1",
  "taskId": "123",
  "start_time": "2025-12-25T12:00:00Z",
  "end_time": "2025-12-25T13:00:00Z",
  "time_duration": "3600",
  "created_at": "2025-12-25T13:00:00Z"
}

Testing

Live API: https://taskapi-rtc7.onrender.com/
Run Locally:docker-compose up


Postman:
Import postman_collection.json.
Set environment:{
  "baseUrl": "https://taskapi-rtc7.onrender.com",
  "token": "",
  "adminToken": "",
  "userId": "",
  "taskId": ""
}


Test endpoints starting with POST /api/auth/register.
Note: OTPs may appear in spam/junk folder for email delivery.



Deployment

Render (Docker):
Push to GitHub: https://github.com/samueladelowo/taskapi.
Create PostgreSQL on Render.
Create Docker Web Service with DATABASE_URL and other env vars.
Run migrations in Render Shell:npx sequelize-cli db:migrate --config config/config
