// Task model with user ownership
export interface Task {
  id: string;
  userId: string; // NEW: Links task to a user
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'complete';
  isComplete: boolean;
  createdAt: Date; // NEW: Track when task was created
}

// In-memory storage for tasks (in production, use a real database)
export const tasks: Task[] = [];