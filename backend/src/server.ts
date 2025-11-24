import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
// ===========

// 1. CORS: Allows frontend (on different port) to make requests
// This is essential for development when frontend runs on port 3000
// and backend on port 3001
app.use(cors());

// 2. JSON Parser: Converts incoming JSON to JavaScript objects
// Without this, req.body would be undefined
app.use(express.json());

// ROUTES
// ======

// Health check endpoint (useful for testing if server is running)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Manager API is running' });
});

// Mount task routes at /api/tasks
// This means all routes in taskRouter are prefixed with /api/tasks
app.use('/api/tasks', taskRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ERROR HANDLER (catches any unhandled errors)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   API endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/tasks - Get all tasks`);
  console.log(`   POST   http://localhost:${PORT}/api/tasks - Create task`);
  console.log(`   PUT    http://localhost:${PORT}/api/tasks/:id - Update task`);
  console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id - Delete task`);
  console.log(`   PATCH  http://localhost:${PORT}/api/tasks/:id/toggle - Toggle status`);
});