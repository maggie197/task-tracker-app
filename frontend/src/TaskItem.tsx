import { Task } from './types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

// Component to display a single task
export const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div style={{
      ...styles.taskItem,
      borderLeft: task.status === 'complete' ? '4px solid #4CAF50' : '4px solid #ff9800',
    }}>
      <div style={styles.taskHeader}>
        <h3 style={{
          ...styles.taskTitle,
          textDecoration: task.status === 'complete' ? 'line-through' : 'none',
          color: task.status === 'complete' ? '#888' : '#333',
        }}>
          {task.title}
        </h3>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: task.status === 'complete' ? '#4CAF50' : '#ff9800',
        }}>
          {task.status}
        </span>
      </div>

      <p style={styles.taskDescription}>{task.description}</p>

      <div style={styles.taskMeta}>
        <small style={styles.metaText}>
          Created: {formatDate(task.createdAt)}
        </small>
        {task.updatedAt !== task.createdAt && (
          <small style={styles.metaText}>
            Updated: {formatDate(task.updatedAt)}
          </small>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={() => onToggleStatus(task.id)}
          style={{
            ...styles.button,
            backgroundColor: task.status === 'complete' ? '#ff9800' : '#4CAF50',
          }}
        >
          {task.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          onClick={() => onEdit(task)}
          style={{ ...styles.button, backgroundColor: '#2196F3' }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id);
            }
          }}
          style={{ ...styles.button, backgroundColor: '#f44336' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  taskItem: {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  taskTitle: {
    margin: 0,
    fontSize: '20px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  taskDescription: {
    color: '#555',
    lineHeight: '1.5',
    marginBottom: '10px',
  },
  taskMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  metaText: {
    color: '#888',
    fontSize: '12px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  button: {
    padding: '8px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};