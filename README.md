# Task Manager Full-Stack Application

A complete full-stack task management application built with TypeScript, Node.js, Express, and React.

##  Features

-  Create new tasks with title, description, and status
-  Edit existing tasks
-  Delete tasks
-  Mark tasks as complete/incomplete
-  View all tasks in a filterable list
-  View statistics (total, pending, complete)
-  Clean, responsive UI

##  Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for building APIs
- **TypeScript** - Type-safe JavaScript
- **UUID** - Generate unique IDs for tasks

### Frontend
- **React** - UI library for building components
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client for API calls
- **Vite** - Fast development server and build tool

##  Project Structure

```
task-manager-app/
├── backend/
│   ├── src/
│   │   ├── routes.ts        # API route handlers
│   │   ├── server.ts        # Express server setup
│   │   ├── database.ts      # In-memory data storage
│   │   └── types.ts         # TypeScript interfaces
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx          # Main application component
    │   ├── TaskForm.tsx     # Form for creating/editing tasks
    │   ├── TaskItem.tsx     # Individual task display
    │   ├── api.ts           # API service layer
    │   ├── types.ts         # TypeScript interfaces
    │   ├── main.tsx         # Application entry point
    │   └── index.css        # Global styles
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

##  Setup Instructions

### Prerequisites
- Node.js (v18 or higher) installed
- npm (comes with Node.js)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Start the Backend Server

```bash
cd ../backend
npm run dev
```

The backend will run on **http://localhost:3001**

### 4. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will run on **http://localhost:3000**

### 5. Open Your Browser

Navigate to **http://localhost:3000** to use the application!

##  How It Works

### Backend Architecture

#### 1. **Server (server.ts)**
- Creates an Express application
- Configures middleware (CORS, JSON parsing)
- Mounts routes at `/api/tasks`
- Handles errors

#### 2. **Database (database.ts)**
- Uses a JavaScript `Map` to store tasks in memory
- Provides CRUD operations (Create, Read, Update, Delete)
- Generates unique IDs using UUID
- In production, you'd replace this with a real database like PostgreSQL or MongoDB

#### 3. **Routes (routes.ts)**
- Defines API endpoints for task operations
- Handles HTTP requests and responses
- Validates input data
- Returns appropriate status codes

#### 4. **Types (types.ts)**
- Defines TypeScript interfaces
- Ensures type safety across the application
- Documents data structures

### Frontend Architecture

#### 1. **App Component (App.tsx)**
- Main component that manages application state
- Coordinates all other components
- Handles API calls through the service layer
- Implements filtering and statistics

#### 2. **TaskForm Component (TaskForm.tsx)**
- Reusable form for creating and editing tasks
- Uses React hooks (useState, useEffect)
- Handles form validation
- Manages local form state

#### 3. **TaskItem Component (TaskItem.tsx)**
- Displays individual tasks
- Provides action buttons (edit, delete, toggle status)
- Shows formatted dates
- Visual status indicators

#### 4. **API Service (api.ts)**
- Abstracts HTTP communication
- Uses Axios for API calls
- Centralizes API configuration
- Makes components cleaner by separating concerns

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status |

### Example API Request

**Create a Task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn TypeScript","description":"Complete TypeScript tutorial","status":"pending"}'
```

##  Key Concepts Explained

### 1. **RESTful API**
REST (Representational State Transfer) is an architectural style for APIs:
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Resources are identified by URLs
- Stateless (each request contains all needed information)

### 2. **TypeScript Benefits**
- **Type Safety**: Catches errors at compile time
- **IntelliSense**: Better autocomplete in editors
- **Documentation**: Types serve as documentation
- **Refactoring**: Safer code changes

### 3. **React Component Architecture**
- **Composition**: Build complex UIs from small components
- **Props**: Pass data from parent to child
- **State**: Manage component data that changes
- **Hooks**: useState, useEffect for state and side effects

### 4. **Separation of Concerns**
- **Backend**: Data management, business logic, API
- **Frontend**: User interface, user interactions
- **API Layer**: Communication bridge between frontend and backend

### 5. **State Management**
- Local state in components (useState)
- Lifting state up to parent components
- Props drilling for passing data down
- (For larger apps: Context API, Redux, Zustand)


##  Next Steps to Improve

1. **Add a Real Database**
   - PostgreSQL with Prisma ORM
   - MongoDB with Mongoose
   - SQLite for simplicity

2. **Add User Authentication**
   - JWT tokens
   - Login/Register pages
   - Protected routes

3. **Enhance UI**
   - Add Tailwind CSS or Material-UI
   - Animations and transitions
   - Dark mode toggle

4. **Add More Features**
   - Task categories/tags
   - Due dates and reminders
   - Task priority levels
   - Search functionality
   - Pagination for large lists

5. **Improve Data Persistence**
   - Currently data is lost when backend restarts
   - Add database to persist data

6. **Add Testing**
   - Jest for unit tests
   - React Testing Library for component tests
   - Supertest for API tests

7. **Deploy the Application**
   - Backend: Heroku, Render, Railway
   - Frontend: Vercel, Netlify
   - Fullstack: Railway, Render

##  Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check CORS settings in `server.ts`
- Verify API_BASE_URL in `frontend/src/api.ts`

### Tasks not persisting
- This is expected! The in-memory database resets when you restart the backend
- To persist data, integrate a real database

##  Resources for Learning

- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev/
- **Express**: https://expressjs.com/
- **Node.js**: https://nodejs.org/docs/
- **REST API Design**: https://restfulapi.net/
