import React, { useState } from "react";

function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    darkMode: true,
    autoSave: true,
    language: "en",
    timezone: "America/Los_Angeles",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card">
      <div style={{ marginBottom: "40px" }}>
        <h2>Settings</h2>
        <p className="card-subtitle" style={{ marginBottom: 0 }}>
          Customize your SpartanCalendar experience
        </p>
      </div>

      <div className="settings-sections">
        {/* Notifications */}
        <div className="settings-section">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.5rem", fontWeight: "700" }}>🔔 Notifications</h3>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Push Notifications</div>
              <div className="settings-item-description">Receive notifications for upcoming deadlines</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange("notifications", e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Email Reminders</div>
              <div className="settings-item-description">Get email reminders for important tasks</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailReminders}
                onChange={(e) => handleSettingChange("emailReminders", e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.5rem", fontWeight: "700" }}>🎨 Appearance</h3>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Dark Mode</div>
              <div className="settings-item-description">Use dark theme for better visibility</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* General */}
        <div className="settings-section">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.5rem", fontWeight: "700" }}>⚙️ General</h3>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Auto Save</div>
              <div className="settings-item-description">Automatically save changes to tasks</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Language</div>
              <div className="settings-item-description">Select your preferred language</div>
            </div>
            <select
              className="form-input"
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              style={{ minWidth: "200px" }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">Timezone</div>
              <div className="settings-item-description">Set your local timezone</div>
            </div>
            <select
              className="form-input"
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              style={{ minWidth: "200px" }}
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
            </select>
          </div>
        </div>

        {/* Account */}
        <div className="settings-section">
          <h3 style={{ margin: "0 0 24px", fontSize: "1.5rem", fontWeight: "700" }}>👤 Account</h3>
          <div className="settings-item">
            <div className="settings-item-content">
              <div className="settings-item-label">User Profile</div>
              <div className="settings-item-description">Martin Sanchez - CS 122 Student</div>
            </div>
            <button className="primary-btn" style={{ padding: "10px 24px", fontSize: "0.875rem" }}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "48px", padding: "24px", background: "rgba(255, 69, 58, 0.1)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(255, 69, 58, 0.2)" }}>
        <h4 style={{ margin: "0 0 12px", color: "#ff6961" }}>⚠️ Danger Zone</h4>
        <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          style={{
            padding: "10px 24px",
            background: "rgba(255, 69, 58, 0.2)",
            border: "1px solid rgba(255, 69, 58, 0.3)",
            borderRadius: "var(--radius-full)",
            color: "#ff6961",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;

