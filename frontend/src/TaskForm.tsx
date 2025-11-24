import { useState, useEffect } from 'react';
import { Task, CreateTaskDto } from './types';

// Props interface defines what data this component receives
interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  onCancel?: () => void;
  initialData?: Task; // If editing, pass existing task
  isLoading?: boolean;
}

// Component for creating/editing tasks
export const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: TaskFormProps) => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'complete'>('pending');

  // If initialData changes (e.g., editing different task), update form
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    // Basic validation
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Call parent's onSubmit function
    onSubmit({ title, description, status });

    // Reset form if creating new task (not editing)
    if (!initialData) {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          style={styles.input}
          disabled={isLoading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
          style={styles.textarea}
          disabled={isLoading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'complete')}
          style={styles.select}
          disabled={isLoading}
        >
          <option value="pending">Pending</option>
          <option value="complete">Complete</option>
        </select>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="submit"
          style={{ ...styles.button, ...styles.submitButton }}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ ...styles.button, ...styles.cancelButton }}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// Inline styles (in a real app, consider CSS modules or styled-components)
const styles = {
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    color: 'white',
  },
};