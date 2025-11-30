import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import EventForm from "./components/EventForm";
import ReportsPage from "./components/ReportsPage";
import CalendarPage from "./components/CalendarPage";
import ClassesPage from "./components/ClassesPage";
import AnalyticsPage from "./components/AnalyticsPage";
import SettingsPage from "./components/SettingsPage";
import Sidebar from "./components/Sidebar";
import ClassCalendar from "./components/ClassCalendar";
import FirebaseTest from "./components/FirebaseTest";

function App() {
  const [view, setView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

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
    if (view === "eventform") {
      return <EventForm />;
    }
    if (view === "calendar") {
      return <CalendarPage setView={setView} />;
    }
    if (view === "reports") {
      return <ReportsPage />;
    }
    if (view === "classes") {
      return <ClassesPage />;
    }
    if (view === "analytics") {
      return <AnalyticsPage />;
    }
    if (view === "settings") {
      return <SettingsPage />;
    }
    if (view === "firebasetest") {
      return <FirebaseTest />;
    }
    return <Dashboard />;
  };

  return (
    <div className="app">
      {isAuthenticated && <Sidebar currentView={view} setView={setView} onLogout={handleLogout} />}
      
      <div className={`app-content-wrapper ${isAuthenticated ? "with-sidebar" : ""}`}>
        {isAuthenticated && (
          <header className="app-header">
            <div className="header-actions">
              <button
                className="header-btn"
                onClick={() => setShowCalendar(!showCalendar)}
                aria-label="Toggle Calendar"
              >
                {showCalendar ? "📅 Hide Calendar" : "📅 Show Calendar"}
              </button>
            </div>
          </header>
        )}

        <main className="app-main-layout">
          <div className="main-content">
            {renderView()}
          </div>
          
          {isAuthenticated && showCalendar && view !== "calendar" && (
            <aside className="calendar-sidebar">
              <ClassCalendar />
            </aside>
          )}
        </main>

        {isAuthenticated && (
          <footer className="app-footer">
            <small>CS 122 · SpartanCalendar · Martin & Nick</small>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
