import React, { useState, useEffect } from "react";
import { getAllTasks, getTaskStats } from "../services/firestoreService";

function ReportsPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    notStartedTasks: 0,
    upcomingThisWeek: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [fetchedTasks, fetchedStats] = await Promise.all([
          getAllTasks(),
          getTaskStats()
        ]);
        setTasks(fetchedTasks);
        setStats(fetchedStats);
      } catch (err) {
        console.error('Error loading reports:', err);
        setError('Failed to load reports. Please check your Firebase configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate category breakdown from real data
  const categoryBreakdown = tasks.reduce((acc, task) => {
    const category = task.category || 'Other';
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category, count: 1, color: getCategoryColor(category) });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count);

  // Calculate priority breakdown from real data
  const priorityBreakdown = tasks.reduce((acc, task) => {
    const priority = task.priority || 'Medium';
    const existing = acc.find(item => item.priority === priority);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ priority, count: 1, color: getPriorityColor(priority) });
    }
    return acc;
  }, []).sort((a, b) => {
    const order = { High: 3, Medium: 2, Low: 1 };
    return order[b.priority] - order[a.priority];
  });

  function getCategoryColor(category) {
    const colors = {
      "Homework": "#6366f1",
      "Project": "#8b5cf6",
      "Exam": "#ec4899",
      "Club": "#10b981",
      "Personal": "#f59e0b",
      "Other": "#6b7280"
    };
    return colors[category] || "#6b7280";
  }

  function getPriorityColor(priority) {
    const colors = {
      "High": "#ef4444",
      "Medium": "#f59e0b",
      "Low": "#10b981"
    };
    return colors[priority] || "#6b7280";
  }

  const completedPercent = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;
  const inProgressPercent = stats.totalTasks > 0 
    ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) 
    : 0;
  const notStartedPercent = stats.totalTasks > 0 
    ? Math.round((stats.notStartedTasks / stats.totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading reports from Firestore...</p>
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
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Reports & Analytics</h2>
          <p className="card-subtitle" style={{ marginBottom: 0 }}>
            Visualize your task completion and productivity metrics
          </p>
        </div>
        
        <select
          className="form-input"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ padding: '10px 16px', fontSize: '0.875rem', cursor: 'pointer', minWidth: '160px' }}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      {/* Main Stats */}
      <div className="report-row" style={{ marginBottom: '40px' }}>
        <div className="report-box">
          <h3>Total Tasks</h3>
          <p className="report-number">{stats.totalTasks}</p>
        </div>
        <div className="report-box">
          <h3>Completed</h3>
          <p className="report-number" style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            {stats.completedTasks}
          </p>
        </div>
        <div className="report-box">
          <h3>In Progress</h3>
          <p className="report-number" style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            {stats.inProgressTasks}
          </p>
        </div>
        <div className="report-box">
          <h3>Upcoming (This Week)</h3>
          <p className="report-number" style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            {stats.upcomingThisWeek}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      {stats.totalTasks > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Task Status Overview</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div className="progress-label">
              <span>Completed</span>
              <strong>{completedPercent}%</strong>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ 
                  width: `${completedPercent}%`,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
              ></div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div className="progress-label">
              <span>In Progress</span>
              <strong>{inProgressPercent}%</strong>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ 
                  width: `${inProgressPercent}%`,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="progress-label">
              <span>Not Started</span>
              <strong>{notStartedPercent}%</strong>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ 
                  width: `${notStartedPercent}%`,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Tasks by Category</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {categoryBreakdown.map((item) => {
              const percent = Math.round((item.count / stats.totalTasks) * 100);
              return (
                <div key={item.category} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}`
                      }}></div>
                      <span style={{ fontWeight: '500' }}>{item.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.count} tasks</span>
                      <strong>{percent}%</strong>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div
                      className="progress-fill"
                      style={{ 
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                        height: '100%'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Breakdown */}
      {priorityBreakdown.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Tasks by Priority</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {priorityBreakdown.map((item) => {
              const percent = Math.round((item.count / stats.totalTasks) * 100);
              return (
                <div key={item.priority} className="report-box" style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }}></div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem' }}>{item.priority} Priority</h3>
                  </div>
                  <p className="report-number" style={{ 
                    fontSize: '2rem',
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'left'
                  }}>
                    {item.count}
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {percent}% of total tasks
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.totalTasks === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '8px' }}>No tasks yet</p>
          <p className="hint-text" style={{ margin: 0 }}>Create some tasks to see analytics here</p>
        </div>
      )}

      {stats.overdue > 0 && (
        <div style={{
          marginTop: '32px',
          padding: '20px',
          borderRadius: 'var(--border-radius-lg)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong style={{ color: '#fca5a5' }}>Attention Required</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''} that need immediate attention.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
