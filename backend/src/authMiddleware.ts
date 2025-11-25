import { Request, Response, NextFunction } from 'express';
import { sessions, users } from './User';

/**
 * Middleware to check if a user is authenticated
 * 
 * This middleware:
 * 1. Extracts the session ID from the Authorization header
 * 2. Checks if the session exists
 * 3. Attaches the user ID to the request object
 * 4. Allows the request to continue if authenticated
 * 
 * Usage: Add this middleware to any route that needs authentication
 * Example: router.get('/tasks', requireAuth, (req, res) => { ... })
 */

// Extend the Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Get session ID from Authorization header
  // Format: "Authorization: Bearer <sessionId>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication required. Please log in.' 
    });
  }

  const sessionId = authHeader.replace('Bearer ', '');
  
  // Check if session exists
  const userId = sessions.get(sessionId);
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Invalid or expired session. Please log in again.' 
    });
  }

  // Verify user still exists
  const user = users.find(u => u.id === userId);
  if (!user) {
    sessions.delete(sessionId); // Clean up invalid session
    return res.status(401).json({ 
      error: 'User not found. Please log in again.' 
    });
  }

  // Attach userId to request for use in route handlers
  req.userId = userId;
  
  // Continue to the next middleware or route handler
  next();
}