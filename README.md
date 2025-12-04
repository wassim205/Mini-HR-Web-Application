# Mini HR Web Application

A full-stack HR management system built with React.js frontend, Node.js/Express backend, and MySQL database.

## Features

- **Authentication & Roles**: JWT-based auth with admin/employee roles
- **Employee Management**: CRUD operations with search & pagination
- **Time Off Requests**: Employee submission, admin approval/rejection
- **Evaluations & Scores**: Predefined evaluations with score buckets
- **Courses & Training**: Course management and enrollment
- **CSV Export**: Export employees and time off data
- **Role-based Access Control**: Protected routes and APIs

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, bcrypt
- **Database**: MySQL
- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **Containerization**: Docker & Docker Compose

## Quick Start with Docker

### Prerequisites

- Docker
- Docker Compose

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd Mini-HR-Web-Application
```

2. Copy environment file:
```bash
cp Backend/.env.example Backend/.env
```

3. Start all services:
```bash
docker-compose up -d --build
```

4. Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080

The database will be automatically created and seeded with initial data.

## Default Login Credentials

**Admin:**
- Email: `admin@hr.com`
- Password: `AdminPass123!`

**Employees:**
- Email: `john@hr.com`, `sarah@hr.com`, `adam@hr.com`
- Password: `EmployeePass123!`

## API Documentation

All API endpoints are prefixed with `/api`. The base URL is `http://localhost:3000/api`.

### Authentication Endpoints

#### POST /auth/login
Login user with email and password.

**Request:**
```json
{
  "email": "admin@hr.com",
  "password": "AdminPass123!"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@hr.com",
    "role": "admin"
  }
}
```

#### POST /auth/register
Register new user.

### User Management Endpoints

#### GET /users
Get all users with search and pagination (admin only).

**Query Parameters:**
- `search`: Search by name, email, or job position
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET /users/me
Get current user profile.

#### GET /users/:id
Get user by ID (admin only).

#### POST /users
Create new user (admin only).

#### PUT /users/:id
Update user profile.

#### DELETE /users/:id
Delete user (admin only).

#### PUT /users/:id/password
Update user password.

### Time Off Endpoints

#### GET /timeoff
Get user's time off requests.

#### POST /timeoff
Create time off request.

#### GET /timeoff/all
Get all time off requests (admin only).

#### PUT /timeoff/:id/status
Update request status (admin only).

### Evaluation Endpoints

#### GET /evaluations
Get all evaluations.

#### POST /evaluations/assign-score
Assign score to user (admin only).

#### GET /evaluations/report
Get evaluation report (admin only).

#### GET /evaluations/my-scores
Get current user's scores.

### Course Endpoints

#### GET /courses
Get all courses.

#### POST /courses
Create course (admin only).

#### PUT /courses/:id
Update course (admin only).

#### DELETE /courses/:id
Delete course (admin only).

#### POST /courses/enroll
Enroll in course.

#### GET /courses/:id/enrollments
Get course enrollments.

### Export Endpoints

#### GET /export/employees
Export employees as CSV (admin only).

#### GET /export/timeoff
Export time off requests as CSV (admin only).

## Testing

Run backend tests:
```bash
cd Backend
npm test
```

Run linting:
```bash
cd Backend
npm run lint
```

## Project Structure

```
Mini-HR-Web-Application/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── db/
│   ├── tests/
│   ├── Dockerfile
│   └── server.js
├── docker-compose.yml
└── README.md
```

## Database Schema

### Tables
- **users**: User accounts and profiles
- **evaluations**: Predefined evaluation types (Bookkeeping, VAT, Toolbox, Yearwork)
- **scores**: User evaluation scores
- **courses**: Training courses
- **enrollments**: Course enrollments
- **time_off_requests**: Time off requests

## Features Overview

### Admin Dashboard
- Employee statistics and management
- Time off request approval
- Evaluation score assignment
- Course management
- CSV data export

### Employee Dashboard
- Personal profile management
- Time off request submission
- Course enrollment
- Evaluation score viewing
- Password management

### Key Features
- **Search & Pagination**: Employee list with search and pagination
- **Role-based Access**: Different interfaces for admin and employees
- **Real-time Updates**: Dynamic data fetching and updates
- **Responsive Design**: Works on desktop and mobile devices
- **Data Export**: CSV export functionality for admins

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## License

MIT License