import express from 'express';
import cors from 'cors';
import taskRoutes from './api';
import authRoutes from './authApi';

const app = express();
const PORT = 3000;


// MIDDLEWARE

app.use(cors()); // Allow frontend to make requests
app.use(express.json()); // Parse JSON request bodies


// ROUTES

// Authentication routes (login, signup, logout)
app.use('/auth', authRoutes);

// Task routes (all protected by authentication)
app.use('/tasks', taskRoutes);


// START SERVER

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Task API: http://localhost:${PORT}/tasks`);
  console.log(` Auth API: http://localhost:${PORT}/auth`);
});