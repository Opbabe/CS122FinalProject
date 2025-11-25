import React, { useState, useEffect } from "react";
import { getAllTasks } from "../services/firestoreService";

const statusColors = {
  "Completed": { bg: "rgba(16, 185, 129, 0.2)", color: "#6ee7b7", border: "rgba(16, 185, 129, 0.3)" },
  "In Progress": { bg: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", border: "rgba(99, 102, 241, 0.3)" },
  "Not Started": { bg: "rgba(107, 114, 128, 0.2)", color: "#9ca3af", border: "rgba(107, 114, 128, 0.3)" },
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("priority");

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error loading tasks:', err);
        const errorMessage = err.message || 'Unknown error';
        setError(`Failed to load tasks: ${errorMessage}. Please check your Firebase configuration and make sure you've restarted the app after creating .env`);
        // Fallback to empty array if Firestore fails
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "due") {
      const dateA = a.dueAt ? (a.dueAt instanceof Date ? a.dueAt : new Date(a.dueAt)) : new Date(0);
      const dateB = b.dueAt ? (b.dueAt instanceof Date ? b.dueAt : new Date(b.dueAt)) : new Date(0);
      return dateA - dateB;
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    notStarted: tasks.filter(t => t.status === "Not Started").length,
  };

  const formatDate = (date) => {
    if (!date) return "No due date";
    
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid date";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateObj);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue (${Math.abs(diffDays)} days)`;
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading tasks from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ 
          padding: '20px', 
          borderRadius: 'var(--border-radius-md)', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          marginBottom: '20px'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
        <p className="hint-text">
          Make sure you've configured Firebase in <code>src/firebase/config.js</code> and that your Firestore database is set up correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Dashboard</h2>
          <p className="card-subtitle" style={{ marginBottom: 0 }}>
            Manage your academic tasks and stay on top of deadlines
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', minWidth: '140px' }}
          >
            <option>All</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Not Started</option>
          </select>
          
          <select
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', minWidth: '140px' }}
          >
            <option value="priority">Sort by Priority</option>
            <option value="due">Sort by Due Date</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="report-row" style={{ marginBottom: '32px' }}>
        <div className="report-box">
          <h3>Total Tasks</h3>
          <p className="report-number">{stats.total}</p>
        </div>
        <div className="report-box">
          <h3>Completed</h3>
          <p className="report-number" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.completed}
          </p>
        </div>
        <div className="report-box">
          <h3>In Progress</h3>
          <p className="report-number" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.inProgress}
          </p>
        </div>
        <div className="report-box">
          <h3>Not Started</h3>
          <p className="report-number" style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.notStarted}
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length > 0 ? (
        <div className="task-grid">
          {sortedTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                  {task.description}
                </p>
              )}
              
              {task.courseName && (
                <div className="task-meta">
                  <span style={{ fontSize: '0.75rem' }}>📚</span>
                  <span><strong>Course:</strong> {task.courseName}</span>
                </div>
              )}
              
              <div className="task-meta">
                <span style={{ fontSize: '0.75rem' }}>📁</span>
                <span><strong>Category:</strong> {task.category}</span>
              </div>
              
              <div className="task-meta">
                <span style={{ fontSize: '0.75rem' }}>📅</span>
                <span><strong>Due:</strong> {formatDate(task.dueAt || task.dueDate)}</span>
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <span
                  className="task-status"
                  style={{
                    background: statusColors[task.status].bg,
                    color: statusColors[task.status].color,
                    border: `1px solid ${statusColors[task.status].border}`,
                  }}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '8px' }}>No tasks found</p>
          <p className="hint-text" style={{ margin: 0 }}>
            {tasks.length === 0 
              ? "Create your first task using the 'Add Task' button above!"
              : "Try adjusting your filters"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
