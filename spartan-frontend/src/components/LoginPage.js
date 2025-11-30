import { useState } from "react";

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="card" style={{ maxWidth: "540px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div
          className="logo-circle"
          style={{
            margin: "0 auto 24px",
            width: "80px",
            height: "80px",
            fontSize: "2rem",
            boxShadow: "0 0 40px rgba(102, 126, 234, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          SC
        </div>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>Welcome Back</h2>
        <p
          style={{
            color: "var(--text-tertiary)",
            fontSize: "0.9375rem",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Your academic success starts here
        </p>
      </div>

      <p className="card-subtitle" style={{ textAlign: "center", marginBottom: "48px", fontSize: "1rem" }}>
        Sign in to manage your academic tasks, track deadlines, and achieve your goals with intelligent reminders.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Email Address
          <input
            type="email"
            className="form-input"
            placeholder="name@sjsu.edu"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </label>

        <label className="form-label">
          Password
          <input
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </label>

        <button
          type="submit"
          className="primary-btn"
          style={{
            width: "100%",
            alignSelf: "stretch",
            marginTop: "16px",
            fontSize: "1.0625rem",
            padding: "18px 40px",
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>⏳</span>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div style={{ marginTop: "32px", display: "flex", justifyContent: "center", gap: "24px", fontSize: "0.875rem" }}>
        <a href="#" style={{ color: "var(--accent-blue-light)", textDecoration: "none", fontWeight: "600" }}>
          Forgot password?
        </a>
        <span style={{ color: "var(--text-tertiary)" }}>•</span>
        <a href="#" style={{ color: "var(--accent-blue-light)", textDecoration: "none", fontWeight: "600" }}>
          Create account
        </a>
      </div>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            background: "rgba(41, 151, 255, 0.1)",
            border: "1px solid rgba(41, 151, 255, 0.2)",
          }}
        >
          <p className="hint-text" style={{ margin: 0, fontStyle: "normal", color: "var(--accent-blue-light)" }}>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
