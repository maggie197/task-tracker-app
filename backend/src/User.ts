// User model and authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // We'll store hashed passwords, never plain text!
  createdAt: Date;
}

// What we send to the client (without password!)
export interface UserResponse {
  id: string;
  username: string;
  email: string;
}

// In-memory storage (in production, you'd use a real database)
export const users: User[] = [];

// Store active sessions: sessionId -> userId
export const sessions: Map<string, string> = new Map();