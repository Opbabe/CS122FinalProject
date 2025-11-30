import React, { useState, useEffect } from "react";
import { getAllTasks, getTaskStats } from "../services/firestoreService";

function AnalyticsPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedStats] = await Promise.all([
          getAllTasks(),
          getTaskStats()
        ]);
        setTasks(fetchedTasks);
        setStats(fetchedStats);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "var(--text-secondary)" }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <p>No analytics data available</p>
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const inProgressRate = stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0;
  const avgTasksPerDay = 7;

  const categoryStats = tasks.reduce((acc, task) => {
    const cat = task.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const priorityStats = tasks.reduce((acc, task) => {
    const pri = task.priority || "Medium";
    acc[pri] = (acc[pri] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card">
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2>Analytics & Insights</h2>
          <p className="card-subtitle" style={{ marginBottom: 0 }}>
            Deep dive into your productivity metrics and performance trends
          </p>
        </div>
        <select
          className="form-input"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ padding: "12px 20px", fontSize: "0.9375rem", cursor: "pointer", minWidth: "160px" }}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics-grid" style={{ marginBottom: "48px" }}>
        <div className="analytics-metric-card">
          <div className="metric-icon" style={{ background: "rgba(48, 209, 88, 0.15)", color: "#5dd389" }}>
            ✓
          </div>
          <div className="metric-content">
            <div className="metric-value">{completionRate.toFixed(1)}%</div>
            <div className="metric-label">Completion Rate</div>
          </div>
        </div>
        <div className="analytics-metric-card">
          <div className="metric-icon" style={{ background: "rgba(41, 151, 255, 0.15)", color: "#4da3ff" }}>
            ⚡
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.inProgressTasks}</div>
            <div className="metric-label">Active Tasks</div>
          </div>
        </div>
        <div className="analytics-metric-card">
          <div className="metric-icon" style={{ background: "rgba(255, 159, 10, 0.15)", color: "#ffb340" }}>
            📈
          </div>
          <div className="metric-content">
            <div className="metric-value">{avgTasksPerDay}</div>
            <div className="metric-label">Avg Tasks/Day</div>
          </div>
        </div>
        <div className="analytics-metric-card">
          <div className="metric-icon" style={{ background: "rgba(255, 69, 58, 0.15)", color: "#ff6961" }}>
            ⚠️
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.overdue}</div>
            <div className="metric-label">Overdue Tasks</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {/* Category Distribution */}
        <div className="analytics-chart-card">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.25rem", fontWeight: "700" }}>Tasks by Category</h3>
          <div className="chart-container">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = (count / stats.totalTasks) * 100;
              return (
                <div key={category} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600" }}>{category}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="progress-bar" style={{ height: "12px" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: "var(--gradient-hero)",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="analytics-chart-card">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.25rem", fontWeight: "700" }}>Tasks by Priority</h3>
          <div className="chart-container">
            {Object.entries(priorityStats).map(([priority, count]) => {
              const percentage = (count / stats.totalTasks) * 100;
              const colors = {
                High: "#ff6961",
                Medium: "#ffb340",
                Low: "#5dd389",
              };
              return (
                <div key={priority} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600" }}>{priority}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="progress-bar" style={{ height: "12px" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${colors[priority] || "#86868b"} 0%, ${colors[priority] || "#86868b"}dd 100%)`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="analytics-insights">
        <h3 style={{ margin: "0 0 24px", fontSize: "1.25rem", fontWeight: "700" }}>Productivity Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <div className="insight-title">Focus Areas</div>
              <div className="insight-text">
                You have {stats.inProgressTasks} active tasks. Keep up the momentum!
              </div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <div className="insight-title">Completion Rate</div>
              <div className="insight-text">
                {completionRate >= 70
                  ? "Excellent! You're completing tasks efficiently."
                  : completionRate >= 50
                  ? "Good progress! Keep pushing forward."
                  : "Room for improvement. Focus on completing tasks."}
              </div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <div className="insight-title">Upcoming Deadlines</div>
              <div className="insight-text">
                {stats.upcomingThisWeek > 0
                  ? `You have ${stats.upcomingThisWeek} tasks due this week.`
                  : "No upcoming deadlines this week."}
              </div>
            </div>
          </div>
          {stats.overdue > 0 && (
            <div className="insight-card" style={{ borderColor: "rgba(255, 69, 58, 0.3)" }}>
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <div className="insight-title">Attention Needed</div>
                <div className="insight-text">
                  You have {stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}. Prioritize these immediately.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

