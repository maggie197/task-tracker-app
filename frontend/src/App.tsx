import React, { useState, useEffect } from 'react';
import { taskService } from './api';
import { Task, CreateTaskDto, UpdateTaskDto } from './types';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';

// Main application component
export const App: React.FC = () => {
  // STATE MANAGEMENT
  // All tasks from the backend
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Currently editing task (null if creating new)
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all');

  // FETCH TASKS ON COMPONENT MOUNT
  // useEffect runs after component renders
  useEffect(() => {
    fetchTasks();
  }, []); // Empty array means run once on mount

  // Fetch all tasks from API
  const fetchTasks = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running on port 3001.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsFetching(false);
    }
  };

  // CREATE new task
  const handleCreateTask = async (data: CreateTaskDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await taskService.createTask(data);
      setTasks([newTask, ...tasks]); // Add to beginning of list
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE existing task
  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (!editingTask) return;

    try {
      setIsLoading(true);
      setError(null);
      const updateData: UpdateTaskDto = {
        title: data.title,
        description: data.description,
        status: data.status,
      };
      const updatedTask = await taskService.updateTask(editingTask.id, updateData);
      
      // Update task in list
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      setEditingTask(null); // Exit edit mode
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE task
  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // TOGGLE task status
  const handleToggleStatus = async (id: string) => {
    try {
      setError(null);
      const updatedTask = await taskService.toggleTaskStatus(id);
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to toggle task status');
      console.error('Error toggling task status:', err);
    }
  };

  // Start editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // FILTER TASKS
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // STATISTICS
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    complete: tasks.filter(t => t.status === 'complete').length,
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📋 Task Manager</h1>
        <p style={styles.subtitle}>Manage your tasks efficiently</p>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* STATISTICS */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Tasks</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#ff9800' }}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#4CAF50' }}>{stats.complete}</div>
          <div style={styles.statLabel}>Complete</div>
        </div>
      </div>

      {/* TASK FORM */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {editingTask ? '✏️ Edit Task' : '➕ Add New Task'}
        </h2>
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={editingTask ? handleCancelEdit : undefined}
          initialData={editingTask || undefined}
          isLoading={isLoading}
        />
      </div>

      {/* FILTER BUTTONS */}
      <div style={styles.filterSection}>
        <h2 style={styles.sectionTitle}>📝 Task List</h2>
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.activeFilter : {}),
            }}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              ...styles.filterButton,
              ...(filter === 'pending' ? styles.activeFilter : {}),
            }}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('complete')}
            style={{
              ...styles.filterButton,
              ...(filter === 'complete' ? styles.activeFilter : {}),
            }}
          >
            Complete ({stats.complete})
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <div style={styles.section}>
        {isFetching ? (
          <div style={styles.loading}>Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No {filter !== 'all' ? filter : ''} tasks found.</p>
            <p>Create your first task above! 👆</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

// STYLES
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  title: {
    fontSize: '36px',
    margin: '0 0 10px 0',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ef5350',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  filterSection: {
    marginBottom: '20px',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '10px 20px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    color: '#666',
  },
};