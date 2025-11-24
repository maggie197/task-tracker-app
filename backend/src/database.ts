import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDto, UpdateTaskDto } from './types';

// This class manages our "database" (in-memory for now)
// In a real app, you'd replace this with actual database queries
class TaskDatabase {
  // Map provides fast lookups by ID: O(1) time complexity
  private tasks: Map<string, Task> = new Map();

  // CREATE: Add a new task
  createTask(data: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(), // Generate unique ID
      title: data.title,
      description: data.description,
      status: data.status || 'pending', // Default to 'pending'
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  // READ: Get all tasks
  getAllTasks(): Task[] {
    // Convert Map values to array and sort by creation date (newest first)
    return Array.from(this.tasks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // READ: Get a single task by ID
  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  // UPDATE: Modify an existing task
  updateTask(id: string, data: UpdateTaskDto): Task | null {
    const task = this.tasks.get(id);
    
    // If task doesn't exist, return null
    if (!task) {
      return null;
    }

    // Update only the fields that were provided
    const updatedTask: Task = {
      ...task, // Spread operator keeps existing values
      ...data, // Overwrite with new values
      updatedAt: new Date(), // Always update the timestamp
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // DELETE: Remove a task
  deleteTask(id: string): boolean {
    // Returns true if task was deleted, false if it didn't exist
    return this.tasks.delete(id);
  }

  // HELPER: Toggle task completion status
  toggleTaskStatus(id: string): Task | null {
    const task = this.tasks.get(id);
    
    if (!task) {
      return null;
    }

    // Switch between 'pending' and 'complete'
    const newStatus = task.status === 'complete' ? 'pending' : 'complete';
    return this.updateTask(id, { status: newStatus });
  }
}

// Export a single instance (Singleton pattern)
// This ensures all parts of our app use the same database
export const taskDb = new TaskDatabase();