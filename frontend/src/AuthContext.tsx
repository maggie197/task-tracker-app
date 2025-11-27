import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext provides authentication state and functions throughout the app
 * 
 * This uses React Context API to avoid prop drilling
 * Any component can access the current user and auth functions
 */

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null; // Current logged-in user (null if not logged in)
  sessionId: string | null; // Session token for API requests
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // True while checking if user is logged in
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * AuthProvider wraps the app and provides authentication state
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, check if user is already logged in
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      // Verify session is still valid
      fetch('http://localhost:3000/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedSessionId}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            setSessionId(storedSessionId);
          } else {
            // Session invalid, clear it
            localStorage.removeItem('sessionId');
          }
        })
        .catch(() => {
          // Error checking session, clear it
          localStorage.removeItem('sessionId');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login function
   * Sends credentials to backend and stores session
   */
  const login = async (username: string, password: string) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    setSessionId(data.sessionId);
    
    // Store session in localStorage so user stays logged in
    localStorage.setItem('sessionId', data.sessionId);
  };

  /**
   * Signup function
   * Creates new account and logs user in
   */
  const signup = async (username: string, email: string, password: string) => {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    setUser(data.user);
    setSessionId(data.sessionId);
    localStorage.setItem('sessionId', data.sessionId);
  };

  /**
   * Logout function
   * Clears session from backend and frontend
   */
  const logout = () => {
    if (sessionId) {
      // Tell backend to invalidate session
      fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      }).catch(() => {
        // Ignore errors, we're logging out anyway
      });
    }

    // Clear local state
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('sessionId');
  };

  const value = {
    user,
    sessionId,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}