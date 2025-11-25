import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { User, UserResponse, users, sessions } from './User';

const router = express.Router();

// ====================
// HELPER FUNCTIONS
// ====================

/**
 * Hash a password using SHA-256
 * In production, use bcrypt or argon2 for better security!
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Convert User to UserResponse (removes password)
 */
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

// ====================
// AUTHENTICATION ROUTES
// ====================

/**
 * POST /auth/signup
 * Creates a new user account
 * 
 * Body: { username: string, email: string, password: string }
 * Returns: { user: UserResponse, sessionId: string }
 */
router.post('/signup', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ 
      error: 'Username, email, and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters' 
    });
  }

  // Check if user already exists
  const existingUser = users.find(
    u => u.username === username || u.email === email
  );
  
  if (existingUser) {
    return res.status(409).json({ 
      error: 'Username or email already exists' 
    });
  }

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date(),
  };

  users.push(newUser);

  // Create session
  const sessionId = uuidv4();
  sessions.set(sessionId, newUser.id);

  // Return user data and session
  return res.status(201).json({
    user: toUserResponse(newUser),
    sessionId,
  });
});

/**
 * POST /auth/login
 * Logs in an existing user
 * 
 * Body: { username: string, password: string }
 * Returns: { user: UserResponse, sessionId: string }
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required' 
    });
  }

  // Find user
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid username or password' 
    });
  }

  // Check password
  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({ 
      error: 'Invalid username or password' 
    });
  }

  // Create session
  const sessionId = uuidv4();
  sessions.set(sessionId, user.id);

  return res.json({
    user: toUserResponse(user),
    sessionId,
  });
});

/**
 * POST /auth/logout
 * Logs out the current user
 * 
 * Headers: { Authorization: 'Bearer <sessionId>' }
 */
router.post('/logout', (req: Request, res: Response) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  return res.status(204).send();
});

/**
 * GET /auth/me
 * Gets the current logged-in user's info
 * 
 * Headers: { Authorization: 'Bearer <sessionId>' }
 * Returns: { user: UserResponse }
 */
router.get('/me', (req: Request, res: Response) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = sessions.get(sessionId);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user: toUserResponse(user) });
});

export default router;