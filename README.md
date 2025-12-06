# CollabVerse

A student skill-based team-matching and collaboration platform built with the MERN stack.

## Features

- User authentication with JWT
- Role-based access control (Student, Teacher, Admin)
- Profile management with skills, bio, and availability
- Project creation and management
- Team formation with invite/request to join
- Kanban-style task boards
- Real-time project chat with Socket.IO
- Smart matching algorithm based on skills and availability
- File uploads with Cloudinary (with local fallback)
- User rating system
- Dedicated dashboards for each user role
- Role-specific permissions and access controls

For detailed information about the role-based authentication implementation, see [Role-Based Auth Features](ROLE_BASED_AUTH_FEATURES.md)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time communication
- Cloudinary for file uploads

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Socket.IO Client for real-time communication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Cloudinary credentials (optional)

5. Seed the database with demo data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Frontend Pages

- `/admin` - Admin dashboard (admin users only)
- `/admin/users` - User management page (admin users only)
- `/teacher` - Teacher dashboard (teacher users only)
- `/teacher/projects` - Project review page (teacher users only)
- `/student` - Student dashboard (student users only)
- `/student/projects` - Student projects page (student users only)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (with optional filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get specific user (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)

### Teacher
- `GET /api/teacher/projects` - Get projects assigned for review (teacher only)
- `POST /api/teacher/projects/:id/review` - Submit project review (teacher only)

### Student
- `GET /api/student/projects` - Get projects where student is a member (student only)

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/invite` - Invite user to project
- `POST /api/projects/:id/join` - Request to join project

### Tasks
- `POST /api/projects/:projectId/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task
- `GET /api/projects/:projectId/tasks` - Get tasks for a project

### Matching
- `POST /api/match` - Get matching users for a project or skills

### Uploads
- `POST /api/uploads` - Upload a file

### Ratings
- `POST /api/projects/:projectId/rate` - Rate a teammate

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.IO handlers
│   │   └── seed/            # Seed data
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── hooks/           # Custom hooks
    │   └── services/        # API services
    ├── vite.config.js       # Vite configuration
    └── tailwind.config.js   # Tailwind CSS configuration
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with demo data
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Login Credentials

After running the seed script, you can log in with the following credentials:

- Email: alex@example.com | Password: password123
- Email: sam@example.com | Password: password123
- Email: taylor@example.com | Password: password123
- Email: jordan@example.com | Password: password123
- Email: casey@example.com | Password: password123
- Email: riley@example.com | Password: password123

## License

This project is licensed under the MIT License.