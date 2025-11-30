import React from "react";

function Sidebar({ currentView, setView, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", description: "Overview & stats" },
    { id: "taskform", label: "Add Task", icon: "➕", description: "Create new task" },
    { id: "eventform", label: "Add Event", icon: "📅", description: "Create event/meeting" },
    { id: "calendar", label: "Calendar", icon: "📅", description: "View schedule" },
    { id: "reports", label: "Reports", icon: "📈", description: "Analytics & insights" },
    { id: "classes", label: "My Classes", icon: "🎓", description: "Class schedule" },
    { id: "analytics", label: "Analytics", icon: "📊", description: "Performance metrics" },
    { id: "firebasetest", label: "🔧 Firebase Test", icon: "🔧", description: "Test Firebase connection" },
    { id: "settings", label: "Settings", icon: "⚙️", description: "Preferences" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-circle" style={{ width: "48px", height: "48px", fontSize: "1.125rem" }}>
          SC
        </div>
        <div className="sidebar-logo-text">
          <span className="app-title" style={{ fontSize: "1.25rem" }}>SpartanCalendar</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: "500" }}>
            Academic Planner
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
            aria-label={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <div className="sidebar-item-content">
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-description">{item.description}</span>
            </div>
            {currentView === item.id && <div className="sidebar-indicator"></div>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

