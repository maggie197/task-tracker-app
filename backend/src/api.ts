import express, { Request, Response } from 'express';
import { Task, tasks } from './Task';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from './authMiddleware';

const router = express.Router();

// ====================
// ALL ROUTES ARE PROTECTED
// ====================
// Users must be logged in to access any of these routes
// The requireAuth middleware ensures req.userId is set

/**
 * GET /tasks
 * Get all tasks for the logged-in user
 * 
 * Returns: Array of tasks belonging to the current user
 */
router.get('/', requireAuth, (req: Request, res: Response) => {
  // Filter tasks to only show the current user's tasks
  const userTasks = tasks.filter(task => task.userId === req.userId);
  return res.json(userTasks);
});

/**
 * POST /tasks
 * Create a new task for the logged-in user
 * 
 * Body: { title: string, description: string, status?: string }
 * Returns: The newly created task
 */
router.post('/', requireAuth, (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ 
      error: 'Title and description are required' 
    });
  }

  const newTask: Task = {
    id: uuidv4(),
    userId: req.userId!, // Link task to current user
    title,
    description,
    status: status || 'pending',
    isComplete: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

/**
 * PUT /tasks/:id
 * Update an existing task (only if it belongs to the user)
 * 
 * Body: { title?: string, description?: string, status?: string }
 * Returns: The updated task
 */
router.put('/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  const taskIndex = tasks.findIndex(
    t => t.id === id && t.userId === req.userId // Must belong to user!
  );

  if (taskIndex === -1) {
    return res.status(404).json({ 
      error: 'Task not found or access denied' 
    });
  }

  // Update task
  const updatedTask = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description || tasks[taskIndex].description,
    status: status || tasks[taskIndex].status,
  };

  tasks[taskIndex] = updatedTask;
  return res.json(updatedTask);
});

/**
 * DELETE /tasks/:id
 * Delete a task (only if it belongs to the user)
 */
router.delete('/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(
    t => t.id === id && t.userId === req.userId // Must belong to user!
  );

  if (taskIndex === -1) {
    return res.status(404).json({ 
      error: 'Task not found or access denied' 
    });
  }

  tasks.splice(taskIndex, 1);
  return res.status(204).send();
});

/**
 * PATCH /tasks/:id/complete
 * Toggle task completion status (only if it belongs to the user)
 */
router.patch('/:id/complete', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  
  const task = tasks.find(
    t => t.id === id && t.userId === req.userId // Must belong to user!
  );

  if (!task) {
    return res.status(404).json({ 
      error: 'Task not found or access denied' 
    });
  }
  
  // Toggle completion
  task.isComplete = !task.isComplete;
  task.status = task.isComplete ? 'complete' : 'pending';

  return res.json(task);
});

export default router;