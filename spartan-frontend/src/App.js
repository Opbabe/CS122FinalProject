// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import ReportsPage from "./components/ReportsPage";

function App() {
  const [view, setView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated (will be replaced with Firebase auth)
  useEffect(() => {
    const authStatus = localStorage.getItem("spartanCalendar_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      setView("dashboard");
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("spartanCalendar_auth", "true");
    setView("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("spartanCalendar_auth");
    setView("login");
  };

  const renderView = () => {
    if (view === "login") {
      return <LoginPage onLogin={handleLogin} />;
    }
    if (view === "dashboard") {
      return <Dashboard />;
    }
    if (view === "taskform") {
      return <TaskForm />;
    }
    if (view === "reports") {
      return <ReportsPage />;
    }
    return <LoginPage onLogin={handleLogin} />;
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "taskform", label: "Add Task", icon: "➕" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-title">
          <span className="logo-circle">SC</span>
          <span className="app-title">SpartanCalendar</span>
        </div>

        {isAuthenticated && (
          <nav className="nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={view === item.id ? "nav-btn active" : "nav-btn"}
                onClick={() => setView(item.id)}
                aria-label={item.label}
              >
                <span>{item.icon}</span>
                <span style={{ marginLeft: '6px' }}>{item.label}</span>
              </button>
            ))}
            <button
              className="nav-btn"
              onClick={handleLogout}
              style={{ marginLeft: '8px' }}
              aria-label="Logout"
            >
              <span>🚪</span>
              <span style={{ marginLeft: '6px' }}>Logout</span>
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">{renderView()}</main>

      <footer className="app-footer">
        <small>CS 122 · SpartanCalendar · Martin & Nick</small>
      </footer>
    </div>
  );
}

export default App;
