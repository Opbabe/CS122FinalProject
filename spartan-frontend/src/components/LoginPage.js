import React, { useState } from "react";

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="card" style={{ maxWidth: '480px' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div className="logo-circle" style={{ margin: '0 auto 16px', width: '64px', height: '64px', fontSize: '1.5rem' }}>
          SC
        </div>
        <h2>Welcome Back</h2>
      </div>
      <p className="card-subtitle" style={{ textAlign: 'center', marginBottom: '40px' }}>
        Sign in to manage your academic tasks, deadlines, and reminders.
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
          style={{ width: '100%', alignSelf: 'stretch', marginTop: '8px' }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p className="hint-text" style={{ margin: 0 }}>
          Demo Mode • Authentication will be connected to Firebase
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
