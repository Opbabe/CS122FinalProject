import React, { useState } from "react";

function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState(null);

  const classes = [
    {
      id: 1,
      course: "CS 122",
      title: "Advanced Python Programming",
      section: "Section 01",
      days: ["Monday"],
      time: "10:00 AM - 11:15 AM",
      location: "ENG 189",
      instructor: "Dr. Smith",
      credits: 3,
      color: "#667eea",
      description: "Advanced programming concepts in Python including OOP, data structures, and algorithms.",
    },
    {
      id: 2,
      course: "CS 22B",
      title: "Python Data Analysis",
      section: "Section 02",
      days: ["Monday"],
      time: "2:00 PM - 3:15 PM",
      location: "ENG 201",
      instructor: "Dr. Johnson",
      credits: 3,
      color: "#764ba2",
      description: "Data analysis techniques using Python libraries like pandas, numpy, and matplotlib.",
    },
    {
      id: 3,
      course: "CS 163",
      title: "Data Science Project",
      section: "Section 01",
      days: ["Wednesday"],
      time: "10:00 AM - 11:15 AM",
      location: "ENG 189",
      instructor: "Dr. Williams",
      credits: 3,
      color: "#f093fb",
      description: "Hands-on data science project with real-world datasets and visualization.",
    },
    {
      id: 4,
      course: "CS 171",
      title: "Intro Machine Learning",
      section: "Section 01",
      days: ["Wednesday"],
      time: "2:00 PM - 3:15 PM",
      location: "ENG 205",
      instructor: "Dr. Brown",
      credits: 3,
      color: "#4facfe",
      description: "Introduction to machine learning algorithms and their applications.",
    },
    {
      id: 5,
      course: "KIN 35B",
      title: "Intermediate Weight Training",
      section: "Section 02",
      days: ["Tuesday"],
      time: "4:00 PM - 5:00 PM",
      location: "GYM A",
      instructor: "Coach Martinez",
      credits: 1,
      color: "#30d158",
      description: "Intermediate level weight training and strength conditioning.",
    },
    {
      id: 6,
      course: "SSCI 101",
      title: "Leadership",
      section: "Section 10",
      days: ["Thursday"],
      time: "11:00 AM - 12:15 PM",
      location: "CL 201",
      instructor: "Dr. Davis",
      credits: 3,
      color: "#ff9f0a",
      description: "Leadership principles and practices for professional development.",
    },
  ];

  return (
    <div className="card">
      <div style={{ marginBottom: "40px" }}>
        <h2>My Classes</h2>
        <p className="card-subtitle" style={{ marginBottom: 0 }}>
          Manage your class schedule and track your academic progress
        </p>
      </div>

      <div className="classes-grid">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="class-card"
            onClick={() => setSelectedClass(cls)}
            style={{
              borderLeft: `4px solid ${cls.color}`,
              cursor: "pointer",
            }}
          >
            <div className="class-card-header">
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: "700" }}>{cls.course}</h3>
                <p style={{ margin: 0, fontSize: "1rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                  {cls.title}
                </p>
              </div>
              <div
                className="class-color-badge"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  background: cls.color,
                  opacity: 0.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🎓
              </div>
            </div>

            <div className="class-card-details">
              <div className="class-detail-item">
                <span className="class-detail-icon">📅</span>
                <span>{cls.days.join(", ")}</span>
              </div>
              <div className="class-detail-item">
                <span className="class-detail-icon">🕐</span>
                <span>{cls.time}</span>
              </div>
              <div className="class-detail-item">
                <span className="class-detail-icon">📍</span>
                <span>{cls.location}</span>
              </div>
              <div className="class-detail-item">
                <span className="class-detail-icon">👤</span>
                <span>{cls.instructor}</span>
              </div>
              <div className="class-detail-item">
                <span className="class-detail-icon">📚</span>
                <span>{cls.credits} Credits</span>
              </div>
            </div>

            <div className="class-card-footer">
              <span className="class-section-badge">{cls.section}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div
          className="class-modal-overlay"
          onClick={() => setSelectedClass(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="class-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(28, 28, 30, 0.95)",
              borderRadius: "var(--radius-xl)",
              padding: "40px",
              maxWidth: "600px",
              width: "100%",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ margin: "0 0 8px", fontSize: "2rem" }}>{selectedClass.course}</h2>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.125rem" }}>{selectedClass.title}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  width: "40px",
                  height: "40px",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ lineHeight: "1.6", color: "var(--text-secondary)" }}>{selectedClass.description}</p>
            </div>

            <div className="class-modal-details">
              <div className="class-modal-detail">
                <strong>Section:</strong> {selectedClass.section}
              </div>
              <div className="class-modal-detail">
                <strong>Days:</strong> {selectedClass.days.join(", ")}
              </div>
              <div className="class-modal-detail">
                <strong>Time:</strong> {selectedClass.time}
              </div>
              <div className="class-modal-detail">
                <strong>Location:</strong> {selectedClass.location}
              </div>
              <div className="class-modal-detail">
                <strong>Instructor:</strong> {selectedClass.instructor}
              </div>
              <div className="class-modal-detail">
                <strong>Credits:</strong> {selectedClass.credits}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesPage;

