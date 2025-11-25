import React, { useState } from "react";
import { createTask } from "../services/firestoreService";

function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Homework",
    priority: "Medium",
    dueDate: "",
    notes: "",
    status: "Not Started",
    courseName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createTask(formData);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: "",
          category: "Homework",
          priority: "Medium",
          dueDate: "",
          notes: "",
          status: "Not Started",
          courseName: "",
        });
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to save task. Please check your Firebase configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["Homework", "Exam", "Project", "Club", "Personal", "Other"];
  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Not Started", "In Progress", "Completed"];
  const courses = [
    "CS 22B - Python Data Analysis",
    "CS 122 - Adv Python Prog",
    "CS 163 - Data Science Project",
    "CS 171 - Intro Machine Learn",
    "KIN 35B - Inter Wt Training",
    "SSCI 101 - Leadership",
    "Other"
  ];

  return (
    <div className="card" style={{ maxWidth: '700px' }}>
      <h2>Create New Task</h2>
      <p className="card-subtitle">
        Fill out the details below to add a new task to your calendar. This will be saved to Firestore.
      </p>

      {error && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--border-radius-md)',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          marginBottom: '24px',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          ⚠️ {error}
        </div>
      )}

      {showSuccess && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--border-radius-md)',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          marginBottom: '24px',
          textAlign: 'center',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          ✓ Task saved successfully to Firestore!
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Task Title *
          <input
            className="form-input"
            type="text"
            placeholder="Example: CS 122 Final Report"
            value={formData.title}
            onChange={handleChange("title")}
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="form-label">
          Course (Optional)
          <select
            className="form-input"
            value={formData.courseName}
            onChange={handleChange("courseName")}
            disabled={isSubmitting}
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select a course...</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <label className="form-label">
            Category
            <select
              className="form-input"
              value={formData.category}
              onChange={handleChange("category")}
              disabled={isSubmitting}
              style={{ cursor: 'pointer' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Priority
            <select
              className="form-input"
              value={formData.priority}
              onChange={handleChange("priority")}
              disabled={isSubmitting}
              style={{ cursor: 'pointer' }}
            >
              {priorities.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <label className="form-label">
            Due Date
            <input
              className="form-input"
              type="date"
              value={formData.dueDate}
              onChange={handleChange("dueDate")}
              disabled={isSubmitting}
            />
          </label>

          <label className="form-label">
            Status
            <select
              className="form-input"
              value={formData.status}
              onChange={handleChange("status")}
              disabled={isSubmitting}
              style={{ cursor: 'pointer' }}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="form-label">
          Notes & Details
          <textarea
            className="form-input"
            rows="5"
            placeholder="Optional: Add any additional details, reminders, or context about this task..."
            value={formData.notes}
            onChange={handleChange("notes")}
            disabled={isSubmitting}
          />
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button 
            type="submit" 
            className="primary-btn"
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Saving to Firestore...' : 'Save Task'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                category: "Homework",
                priority: "Medium",
                dueDate: "",
                notes: "",
                status: "Not Started",
                courseName: "",
              });
              setError(null);
            }}
            disabled={isSubmitting}
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--border-radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(10, 14, 39, 0.5)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(10, 14, 39, 0.5)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Clear
          </button>
        </div>
      </form>

      <p className="hint-text" style={{ marginTop: '24px' }}>
        All fields marked with * are required. Task data will be persisted to Firestore.
      </p>
    </div>
  );
}

export default TaskForm;
