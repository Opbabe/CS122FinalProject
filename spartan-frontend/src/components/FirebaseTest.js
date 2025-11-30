import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";

function FirebaseTest() {
  const [status, setStatus] = useState("Checking...");
  const [connectionStatus, setConnectionStatus] = useState("Unknown");
  const [testResult, setTestResult] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const USER_ID = "martinSanchez";

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      if (!db) {
        setStatus("❌ Firebase not initialized");
        setConnectionStatus("Failed");
        setError("Database object is null. Check your Firebase configuration.");
        return;
      }

      setStatus("✅ Firebase initialized");
      setConnectionStatus("Connected");

      try {
        const tasksRef = collection(db, "users", USER_ID, "tasks");
        const snapshot = await getDocs(tasksRef);
        
        const taskList = [];
        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setTasks(taskList);
        setTestResult({
          success: true,
          message: `Successfully connected! Found ${taskList.length} tasks.`,
          tasksCount: taskList.length,
        });
      } catch (readError) {
        setTestResult({
          success: false,
          message: `Connection works but can't read data: ${readError.message}`,
        });
        setError(readError.message);
      }
    } catch (err) {
      setStatus("❌ Connection failed");
      setConnectionStatus("Failed");
      setError(err.message);
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}`,
      });
    }
  };

  const createTestTask = async () => {
    try {
      setStatus("Creating test task...");
      const tasksRef = collection(db, "users", USER_ID, "tasks");
      
      const testTask = {
        title: `Test Task - ${new Date().toLocaleTimeString()}`,
        description: "This is a test task created from the Firebase test component",
        priority: 1, // Medium
        status: "open",
        dueAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
        courseName: "Test Course",
        categoryName: "Test",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(tasksRef, testTask);
      
      setStatus(`✅ Test task created with ID: ${docRef.id}`);
      await testConnection();
      
      alert(`Success! Test task created.\nID: ${docRef.id}\n\nCheck Firebase Console to see it!`);
    } catch (err) {
      setStatus("❌ Failed to create test task");
      setError(err.message);
      alert(`Error: ${err.message}\n\nCheck Firestore security rules!`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            background: "var(--gradient-sjsu-vibrant)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
          }}
        >
          🔧 Firebase Connection Test
        </h2>
        <p className="card-subtitle">
          Use this component to verify your Firebase setup is working correctly
        </p>
      </div>

      {/* Connection Status */}
      <div
        style={{
          padding: "24px",
          borderRadius: "var(--radius-lg)",
          background:
            connectionStatus === "Connected"
              ? "rgba(48, 209, 88, 0.15)"
              : "rgba(255, 69, 58, 0.15)",
          border: `1px solid ${
            connectionStatus === "Connected"
              ? "rgba(48, 209, 88, 0.3)"
              : "rgba(255, 69, 58, 0.3)"
          }`,
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>
              Connection Status: {connectionStatus}
            </h3>
            <p style={{ margin: 0, fontSize: "1rem" }}>{status}</p>
          </div>
          <div style={{ fontSize: "3rem" }}>
            {connectionStatus === "Connected" ? "✅" : "❌"}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: testResult.success
              ? "rgba(48, 209, 88, 0.1)"
              : "rgba(255, 69, 58, 0.1)",
            border: `1px solid ${
              testResult.success
                ? "rgba(48, 209, 88, 0.3)"
                : "rgba(255, 69, 58, 0.3)"
            }`,
            marginBottom: "24px",
          }}
        >
          <strong style={{ display: "block", marginBottom: "8px" }}>
            {testResult.success ? "✅ Test Result:" : "❌ Test Result:"}
          </strong>
          <p style={{ margin: 0 }}>{testResult.message}</p>
          {testResult.tasksCount !== undefined && (
            <p style={{ margin: "8px 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Tasks found in database: {testResult.tasksCount}
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: "rgba(255, 69, 58, 0.15)",
            border: "1px solid rgba(255, 69, 58, 0.3)",
            color: "#ff6961",
            marginBottom: "24px",
          }}
        >
          <strong style={{ display: "block", marginBottom: "8px" }}>Error Details:</strong>
          <code style={{ fontSize: "0.875rem", wordBreak: "break-all" }}>{error}</code>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <button className="primary-btn" onClick={testConnection}>
          🔄 Test Connection Again
        </button>
        <button
          className="primary-btn"
          onClick={createTestTask}
          style={{
            background: "var(--gradient-blue)",
          }}
        >
          ➕ Create Test Task
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "16px" }}>Tasks in Database ({tasks.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(28, 28, 30, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <strong style={{ fontSize: "1rem", display: "block", marginBottom: "4px" }}>
                      {task.title || "Untitled Task"}
                    </strong>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      Status: {task.status || "N/A"} | Priority: {task.priority || "N/A"}
                    </p>
                    {task.dueAt && (
                      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                        Due: {task.dueAt.toDate ? task.dueAt.toDate().toLocaleString() : "N/A"}
                      </p>
                    )}
                  </div>
                  <code
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-tertiary)",
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {task.id}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          borderRadius: "var(--radius-lg)",
          background: "rgba(0, 85, 162, 0.1)",
          border: "1px solid rgba(0, 85, 162, 0.3)",
        }}
      >
        <h4 style={{ marginBottom: "12px" }}>📋 What to Check:</h4>
        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8" }}>
          <li>Connection Status should show "Connected" ✅</li>
          <li>Test Result should show success message</li>
          <li>Click "Create Test Task" to verify write permissions</li>
          <li>Check Firebase Console → Firestore → Data to see the test task</li>
          <li>If you see errors, check the error message above</li>
        </ul>
      </div>
    </div>
  );
}

export default FirebaseTest;

