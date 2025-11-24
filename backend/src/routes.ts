import { Router, Request, Response } from 'express';
import { taskDb } from './database';
import { CreateTaskDto, UpdateTaskDto } from './types';

// Router handles all /tasks endpoints
export const taskRouter = Router();

// GET /tasks - Retrieve all tasks
taskRouter.get('/', (req: Request, res: Response) => {
  try {
    const tasks = taskDb.getAllTasks();
    res.json(tasks); // Send tasks as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /tasks/:id - Retrieve a single task
taskRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const task = taskDb.getTaskById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /tasks - Create a new task
taskRouter.post('/', (req: Request, res: Response) => {
  try {
    const data: CreateTaskDto = req.body;
    
    // Validation: Ensure required fields are present
    if (!data.title || data.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!data.description || data.description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    const task = taskDb.createTask(data);
    res.status(201).json(task); // 201 = Created
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id - Update an existing task
taskRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const data: UpdateTaskDto = req.body;
    const task = taskDb.updateTask(req.params.id, data);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task
taskRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = taskDb.deleteTask(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(204).send(); // 204 = No Content (success, no data to return)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// PATCH /tasks/:id/toggle - Toggle task completion status
taskRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    const task = taskDb.toggleTaskStatus(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
});