import React, { useState } from 'react';

// Define the type for the props this component receives
interface TaskFormProps {
  // onAddTask now returns a Promise (it's async!)
  onAddTask: (title: string, description: string) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    
    // Check if the fields are not empty
    if (!title.trim() || !description.trim()) {
      alert('Please enter a title and description.');
      return;
    }

    setIsSubmitting(true); // Disable button while submitting

    try {
      // Call the async function passed down from the parent (App.tsx)
      await onAddTask(title.trim(), description.trim());

      // Clear the form fields after successful submission
      setTitle('');
      setDescription('');
    } catch (error) {
      // Error is already handled in App.tsx
      console.error('Error in TaskForm:', error);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}
    >
      <h3 style={{ marginTop: 0, color: '#333' }}>Add New Task</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
          Title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="Enter task title"
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
          Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitting}
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
          placeholder="Enter task description"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          padding: '10px 20px',
          backgroundColor: isSubmitting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;