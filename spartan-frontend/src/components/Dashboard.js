import React, { useState, useEffect } from "react";
import { getAllTasks, updateTask, deleteTask } from "../services/firestoreService";
import { format } from "date-fns";

const statusColors = {
  Completed: { bg: "rgba(48, 209, 88, 0.15)", color: "#5dd389", border: "rgba(48, 209, 88, 0.3)" },
  "In Progress": { bg: "rgba(0, 85, 162, 0.15)", color: "var(--sjsu-blue-light)", border: "rgba(0, 85, 162, 0.3)" },
  "Not Started": { bg: "rgba(229, 168, 35, 0.15)", color: "var(--sjsu-gold-light)", border: "rgba(229, 168, 35, 0.3)" },
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("priority");
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
  const [sortedTasks, setSortedTasks] = useState([]);
  const [updatingTasks, setUpdatingTasks] = useState(new Set());
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const recalculateTasks = (taskList) => {
    const statsData = {
      total: taskList.length,
      completed: taskList.filter((task) => task.status === "Completed").length,
      inProgress: taskList.filter((task) => task.status === "In Progress").length,
      notStarted: taskList.filter((task) => task.status === "Not Started").length,
    };
    setStats(statsData);

    const filteredTasks = filter === "All" ? taskList : taskList.filter((task) => task.status === filter);

    const sorted = [...filteredTasks].sort((a, b) => {
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

    setSortedTasks(sorted);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setLoadingError(null);
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
      recalculateTasks(fetchedTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      const errorMessage = err.message || "Unknown error";
      setLoadingError(`Failed to load tasks: ${errorMessage}`);
      setTasks([]);
      setSortedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      recalculateTasks(tasks);
    }
  }, [filter, sortBy]);

  const handleDeleteTask = async (taskId) => {
    if (confirmDeleteId !== taskId) {
      setConfirmDeleteId(taskId);
      return;
    }
    try {
      setDeletingTaskId(taskId);
      setConfirmDeleteId(null);
      await deleteTask(taskId);
      await fetchTasks();
      setActionError(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setActionError(`Failed to delete task: ${err.message}`);
      setDeletingTaskId(null);
      setTimeout(() => {
        setActionError(null);
      }, 5000);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    if (updatingTasks.has(taskId)) {
      return;
    }

    try {
      setUpdatingTasks((prev) => new Set(prev).add(taskId));
      
      const newStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
      
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        recalculateTasks(updatedTasks);
        return updatedTasks;
      });

      await updateTask(taskId, { status: newStatus });
      await fetchTasks();
      setActionError(null);
    } catch (err) {
      console.error("Error updating task:", err);
      const errorMessage = err.message || "Unknown error occurred";
      setActionError(`Failed to update task: ${errorMessage}. Please try again.`);
      await fetchTasks();
      setTimeout(() => {
        setActionError(null);
      }, 5000);
    } finally {
      setUpdatingTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return "No due date";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid date";
      return format(dateObj, "MMMM dd, yyyy");
    } catch (err) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "32px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            📊
          </div>
          <p
            style={{
              color: "var(--text-primary)",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            Loading Your Dashboard
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.125rem",
              fontWeight: "500",
            }}
          >
            Fetching your Spartan tasks...
          </p>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="card">
        <div
          style={{
            padding: "32px",
            borderRadius: "var(--radius-xl)",
            background: "rgba(255, 69, 58, 0.1)",
            border: "1px solid rgba(255, 69, 58, 0.3)",
            color: "#ff6961",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⚠️</div>
          <strong style={{ fontSize: "1.25rem", display: "block", marginBottom: "12px" }}>Error Loading Tasks</strong>
          <p style={{ margin: 0, lineHeight: "1.6" }}>{loadingError}</p>
          <button
            onClick={() => {
              setLoadingError(null);
              fetchTasks();
            }}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255, 69, 58, 0.5)",
              background: "rgba(255, 69, 58, 0.2)",
              color: "#ff6961",
              fontSize: "0.875rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {actionError && (
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: "rgba(255, 69, 58, 0.1)",
            border: "1px solid rgba(255, 69, 58, 0.3)",
            color: "#ff6961",
            marginBottom: "32px",
            animation: "fadeInUp 0.3s ease-out",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong style={{ display: "block", marginBottom: "4px" }}>⚠️ Error</strong>
            <p style={{ margin: 0, fontSize: "0.9375rem" }}>{actionError}</p>
          </div>
          <button
            onClick={() => setActionError(null)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255, 69, 58, 0.5)",
              background: "rgba(255, 69, 58, 0.2)",
              color: "#ff6961",
              fontSize: "0.875rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "56px",
          flexWrap: "wrap",
          gap: "32px",
        }}
      >
        <div style={{ flex: "1", minWidth: "280px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                marginBottom: 0,
                background: "var(--gradient-sjsu-vibrant)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Spartan Dashboard
            </h2>
          </div>
          <p
            className="card-subtitle"
            style={{
              marginBottom: 0,
              fontSize: "1.0625rem",
              maxWidth: "600px",
            }}
          >
            Manage your SJSU coursework with precision and stay ahead of deadlines
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <select
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "14px 24px",
              fontSize: "0.9375rem",
              cursor: "pointer",
              minWidth: "170px",
              fontWeight: "600",
            }}
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
            style={{
              padding: "14px 24px",
              fontSize: "0.9375rem",
              cursor: "pointer",
              minWidth: "170px",
              fontWeight: "600",
            }}
          >
            <option value="priority">Sort by Priority</option>
            <option value="due">Sort by Due Date</option>
          </select>
        </div>
      </div>

      <div className="report-row" style={{ marginBottom: "56px" }}>
        <div
          className="report-box"
          style={{
            animationDelay: "0.1s",
            background: "rgba(0, 85, 162, 0.08)",
          }}
        >
          <h3>Total Tasks</h3>
          <p
            className="report-number"
            style={{
              background: "var(--gradient-sjsu)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stats.total}
          </p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            All assignments
          </p>
        </div>

        <div
          className="report-box"
          style={{
            animationDelay: "0.2s",
            background: "rgba(48, 209, 88, 0.08)",
          }}
        >
          <h3>Completed</h3>
          <p
            className="report-number"
            style={{
              background: "linear-gradient(135deg, #30d158 0%, #32d74b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stats.completed}
          </p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completed
          </p>
        </div>

        <div
          className="report-box"
          style={{
            animationDelay: "0.3s",
            background: "rgba(0, 85, 162, 0.08)",
          }}
        >
          <h3>In Progress</h3>
          <p
            className="report-number"
            style={{
              background: "var(--gradient-blue)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stats.inProgress}
          </p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            Currently active
          </p>
        </div>

        <div
          className="report-box"
          style={{
            animationDelay: "0.4s",
            background: "rgba(229, 168, 35, 0.08)",
          }}
        >
          <h3>Not Started</h3>
          <p
            className="report-number"
            style={{
              background: "var(--gradient-gold)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {stats.notStarted}
          </p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            Ready to begin
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length > 0 ? (
        <div className="task-grid">
          {sortedTasks.map((task, index) => (
            <div
              className="task-card"
              key={task.id}
              style={{
                animation: `fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.05}s both`,
              }}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirmDeleteId === task.id) {
                        handleDeleteTask(task.id);
                      } else {
                        setConfirmDeleteId(task.id);
                      }
                    }}
                    onBlur={() => {
                      // Clear confirmation when clicking away
                      setTimeout(() => setConfirmDeleteId(null), 200);
                    }}
                    disabled={deletingTaskId === task.id}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-md)",
                      border: confirmDeleteId === task.id 
                        ? "1px solid rgba(255, 69, 58, 0.5)" 
                        : "1px solid rgba(255, 69, 58, 0.3)",
                      background: confirmDeleteId === task.id
                        ? "rgba(255, 69, 58, 0.2)"
                        : "rgba(255, 69, 58, 0.1)",
                      color: "#ff6961",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: deletingTaskId === task.id ? "wait" : "pointer",
                      transition: "all var(--transition-smooth)",
                      opacity: deletingTaskId === task.id ? 0.6 : 1,
                    }}
                    title={confirmDeleteId === task.id ? "Click again to confirm" : "Delete task"}
                  >
                    {deletingTaskId === task.id ? "..." : confirmDeleteId === task.id ? "✓ Confirm" : "🗑️"}
                  </button>
                </div>
              </div>

              {task.description && (
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    marginBottom: "16px",
                    lineHeight: "1.6",
                    fontWeight: "400",
                  }}
                >
                  {task.description}
                </p>
              )}

              {task.courseName && (
                <div className="task-meta">
                  <span style={{ fontSize: "1rem" }}>📚</span>
                  <span>
                    <strong>Course:</strong> {task.courseName}
                  </span>
                </div>
              )}

              <div className="task-meta">
                <span style={{ fontSize: "1rem" }}>📁</span>
                <span>
                  <strong>Category:</strong> {task.category}
                </span>
              </div>

              <div className="task-meta">
                <span style={{ fontSize: "1rem" }}>📅</span>
                <span>
                  <strong>Due:</strong> {formatDate(task.dueAt || task.dueDate)}
                </span>
              </div>

              <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", position: "relative", zIndex: 2 }}>
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
                
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: updatingTasks.has(task.id) ? "wait" : "pointer",
                    userSelect: "none",
                    opacity: updatingTasks.has(task.id) ? 0.6 : 1,
                    pointerEvents: updatingTasks.has(task.id) ? "none" : "auto",
                    position: "relative",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!updatingTasks.has(task.id)) {
                      handleToggleComplete(task.id, task.status);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!updatingTasks.has(task.id) && task.status !== "Completed") {
                      e.currentTarget.style.opacity = "0.8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updatingTasks.has(task.id)) {
                      e.currentTarget.style.opacity = "1";
                    }
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "48px",
                      height: "26px",
                      borderRadius: "var(--radius-full)",
                      background: task.status === "Completed" 
                        ? "rgba(48, 209, 88, 0.3)" 
                        : "rgba(255, 255, 255, 0.1)",
                      border: task.status === "Completed"
                        ? "1px solid rgba(48, 209, 88, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all var(--transition-smooth)",
                      cursor: updatingTasks.has(task.id) ? "wait" : "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: task.status === "Completed" ? "23px" : "3px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "var(--radius-full)",
                        background: task.status === "Completed"
                          ? "var(--accent-green)"
                          : "rgba(255, 255, 255, 0.5)",
                        boxShadow: task.status === "Completed"
                          ? "0 0 12px rgba(48, 209, 88, 0.6)"
                          : "0 2px 6px rgba(0, 0, 0, 0.3)",
                        transition: "all var(--transition-smooth)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "700",
                      }}
                    >
                      {updatingTasks.has(task.id) ? "..." : task.status === "Completed" ? "✓" : ""}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: task.status === "Completed" ? "#5dd389" : "var(--text-secondary)",
                      transition: "color var(--transition-smooth)",
                    }}
                  >
                    {updatingTasks.has(task.id) 
                      ? "Updating..." 
                      : task.status === "Completed" 
                        ? "Completed" 
                        : "Mark Complete"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "100px 40px",
            color: "var(--text-secondary)",
            background: "rgba(0, 85, 162, 0.05)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid rgba(229, 168, 35, 0.2)",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "32px", opacity: "0.6" }}>📋</div>
          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: "16px",
              fontWeight: "700",
              color: "var(--text-primary)",
            }}
          >
            No Tasks Found
          </p>
          <p className="hint-text" style={{ margin: 0, fontSize: "1.0625rem" }}>
            {tasks.length === 0 ? "Create your first Spartan task to get started!" : "Try adjusting your filters"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
