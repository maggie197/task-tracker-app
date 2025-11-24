// These types match the backend API
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'complete';
    createdAt: string; // Dates come as strings from API
    updatedAt: string;
  }
  
  export interface CreateTaskDto {
    title: string;
    description: string;
    status?: 'pending' | 'complete';
  }
  
  export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: 'pending' | 'complete';
  }