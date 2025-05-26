# TaskAPI

**TaskAPI** is a RESTful API for task management, time tracking, and productivity reporting.  
Built with **TypeScript**, **Express**, and **Sequelize**, it enables users to create tasks, log time, and generate reports.  
Authentication uses **JWT** with OTP sent via **email (SendGrid)** or **SMS (Twilio)**.  
> ⚠️ Email OTPs may appear in your spam/junk folder if not in your inbox.  
> 🔗 Live API: [https://taskapi-rtc7.onrender.com](https://taskapi-rtc7.onrender.com)

---

## Features

- **Task CRUD**: Create, read, update, and delete tasks with title, description, and status.
- **Time Tracking**: Log time per task, view logs, and calculate total time spent.
- **Reports**: Analyze time usage and task completion rates (admin-only for completion).
- **Authentication**: Register, verify OTP, and login with JWT.
- **Calendar Integration**: Create Google Calendar events for tasks.
- **Rate Limiting**: 100 requests per 15 minutes per IP address.
- **Pagination**: Filter and paginate task and log lists.
- **Type Safety**: Zod validation and TypeScript.
- **Logging**: Detailed logs stored in `/logs/app.log`.
- **Database**: PostgreSQL with Sequelize migrations.
- **Deployment**: Dockerized and hosted on Render.

---

## Tech Stack

| Category       | Tool        |
|----------------|-------------|
| Runtime        | Node.js     |
| Framework      | Express     |
| Language       | TypeScript  |
| ORM            | Sequelize   |
| Database       | PostgreSQL  |
| Authentication | JWT, SendGrid, Twilio |
| Validation     | Zod         |
| Logging        | Winston     |
| Deployment     | Docker, Render |

---

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- SendGrid account (for email OTP)
- Twilio account (for SMS OTP)
- Google Cloud Console (for Calendar integration)
- Git
- npm
- Docker (for local/containerized deployment)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/samueladelowo/taskapi.git
cd taskapi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file using `.env.sample` as a template:


### 4. Set Up Database

Start PostgreSQL locally or via Docker:

```bash
psql -U username -c "CREATE DATABASE taskapi;"
```

Run migrations:

```bash
npx sequelize-cli db:migrate --config config/config.cjs
```

---

## Run Locally

### With Docker

```bash
docker-compose up --build
```

### Without Docker

```bash
npm run dev
```

---

## API Endpoints

> All endpoints (except `/api/auth/*`) require:
>
> `Authorization: Bearer <token>` in the request header.

---

### 🔐 Authentication

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/auth/register`  | Register with OTP   |
| POST   | `/api/auth/verify-otp`| Verify OTP          |
| POST   | `/api/auth/login`     | Login for JWT       |

#### Example Inputs

```json
// /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "deliveryMethod": "email",
  "phone": "+1234567890"
}

// /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
```

> 🧪 Test OTP: `123456`

---

### ✅ Tasks

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/api/tasks`       | Create a task          |
| GET    | `/api/tasks`       | List tasks (paginated) |
| GET    | `/api/tasks/:id`   | Get task by ID         |
| PUT    | `/api/tasks/:id`   | Update task            |
| DELETE | `/api/tasks/:id`   | Delete task            |

---

### ⏱️ Task Logs

| Method | Endpoint                     | Description            |
|--------|------------------------------|------------------------|
| POST   | `/api/tasks/:id/time`        | Log time for task      |
| GET    | `/api/tasks/:id/logs`        | List task logs         |
| GET    | `/api/tasks/:id/time-total`  | Get total time for task|

---

### 📊 Reports

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | `/api/tasks/report/time`         | Time across all tasks               |
| GET    | `/api/tasks/report/completion`   | Task completion rate (admin only)   |

---

### 📅 Calendar Integration

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/tasks/:id/calendar`   | Create Google Calendar event   |

#### Input:
```json
{
  "accessToken": "your_google_access_token"
}
```

- Requires OAuth2 accessToken with scope: `https://www.googleapis.com/auth/calendar.events`
- Output: Event with ID and htmlLink

---

### ⚡ Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Exceeded limit response**: `429 Too Many Requests`
- **Test**: Spam `GET /api/health` to trigger rate limiting

---

## Example Data

### Task

```json
{
  "id": 1,
  "userId": 1,
  "title": "Write Report",
  "description": "Draft report",
  "status": "pending",
  "createdAt": "2025-05-26T00:00:00Z",
  "updatedAt": "2025-05-26T00:00:00Z"
}
```

### Task Log

```json
{
  "id": 1,
  "taskId": 1,
  "startTime": "2025-05-26T12:00:00Z",
  "endTime": "2025-05-26T13:00:00Z",
  "duration": 3600,
  "createdAt": "2025-05-26T13:00:00Z",
  "updatedAt": "2025-05-26T13:00:00Z"
}
```

---

## 🔬 Testing

### Live API
Use: [https://taskapi-rtc7.onrender.com](https://taskapi-rtc7.onrender.com)

### Local Testing
Run with Docker:

```bash
docker-compose up
```

### Postman

1. Import `postman_collection.json`.
2. Set up environment:

```json
{
  "baseUrl": "https://taskapi-rtc7.onrender.com",
  "token": "",
  "adminToken": "",
  "userId": "",
  "taskId": ""
}
```

3. Start testing with `POST /api/auth/register`.

---

## 🚀 Deployment

### Render (Docker)

- Push to GitHub
- Create PostgreSQL DB on Render and use the **External Database URL**.
- Create Docker Web Service:
  - **Repository:** ``
  - **Runtime:** Docker
  - **Environment Variables:**
    ```
    DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL
    SENDGRID_API_KEY, SENDER_EMAIL
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
    NODE_ENV=production
    ```
  - **Disk:** logs at `/app/logs`, 1 GB
  - **Health Check:** `/api/health`

- Run migrations in Render shell:

```bash
npx sequelize-cli db:migrate --config config/config.cjs
```

---