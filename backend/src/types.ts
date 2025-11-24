// This interface defines the shape of our Task object
// Using TypeScript interfaces helps catch errors and provides autocomplete
export interface Task {
  id: string;          // Unique identifier for each task
  title: string;       // Task title/name
  description: string; // Detailed description of the task
  status: TaskStatus;  // Current status: 'pending' or 'complete'
  createdAt: Date;     // When the task was created
  updatedAt: Date;     // When the task was last modified
}

// Using a union type ensures status can only be these two values
export type TaskStatus = 'pending' | 'complete';

// Interface for creating a new task (doesn't need id, dates)
export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus; // Optional, defaults to 'pending'
}

// Interface for updating an existing task (all fields optional)
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
