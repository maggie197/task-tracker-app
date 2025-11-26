import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AuthPage from './AuthPage';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from './taskApi';

/**
 * Main App Component
 * 
 * Shows login/signup if not authenticated
 * Shows task manager if authenticated
 */

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  isComplete: boolean;
  createdAt: string;
}

function App() {
  const { user, sessionId, logout, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  // Load tasks when user logs in
  useEffect(() => {
    if (user && sessionId) {
      loadTasks();
    } else {
      setTasks([]); // Clear tasks when logged out
    }
  }, [user, sessionId]);

  /**
   * Load tasks from backend
   */
  const loadTasks = async () => {
    setIsLoadingTasks(true);
    setError('');
    try {
      const data = await fetchTasks(sessionId);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  /**
   * Add a new task
   */
  const addTask = async (title: string, description: string) => {
    try {
      const newTask = await createTask(sessionId, title, description);
      setTasks([...tasks, newTask]);
    } catch (err) {
      alert('Failed to create task');
      console.error(err);
    }
  };

  /**
   * Edit a task
   */
  const editTask = async (id: string, title: string, description: string) => {
    try {
      const updatedTask = await updateTask(sessionId, id, { title, description });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      alert('Failed to update task');
      console.error(err);
    }
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTask(sessionId, id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
      console.error(err);
    }
  };

  /**
   * Toggle task completion
   */
  const toggleComplete = async (id: string) => {
    try {
      const updatedTask = await toggleTaskComplete(sessionId, id);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      alert('Failed to toggle task');
      console.error(err);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div style={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show task manager if authenticated
  return (
    <div style={styles.container}>
      {/* Header with user info and logout */}
      <div style={styles.header}>
        <h1 style={styles.title}>Task Manager</h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>👤 {user.username}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Add task form */}
      <TaskForm onAddTask={addTask} />

      <hr style={styles.divider} />

      {/* Task list */}
      <h2 style={styles.subtitle}>
        Your Tasks ({tasks.length} Total)
      </h2>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {isLoadingTasks ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onDelete={handleDeleteTask}
          onEdit={editTask}
        />
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    color: '#666',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  divider: {
    margin: '2rem 0',
    border: 'none',
    borderTop: '1px solid #ddd',
  },
  subtitle: {
    color: '#555',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};

export default App;