import React, { useState } from "react";
import { createEvent } from "../services/firestoreService";

function EventForm() {
  const [formData, setFormData] = useState({
    title: "",
    type: "event",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isAllDay: false,
    location: "",
    description: "",
    color: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error("Event title is required");
      }
      if (!formData.startDate) {
        throw new Error("Start date is required");
      }

      const eventData = {
        ...formData,
        startTime: formData.isAllDay ? "" : formData.startTime,
        endTime: formData.isAllDay ? "" : formData.endTime,
        endDate: formData.endDate || formData.startDate,
      };

      await createEvent(eventData);
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          title: "",
          type: "event",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          isAllDay: false,
          location: "",
          description: "",
          color: "",
        });
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to save event. Please check your Firebase configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    { value: "event", label: "Event", icon: "📅", color: "#667eea" },
    { value: "meeting", label: "Meeting", icon: "👥", color: "#4facfe" },
    { value: "holiday", label: "Holiday", icon: "🎉", color: "#30d158" },
  ];

  React.useEffect(() => {
    const typeData = eventTypes.find((t) => t.value === formData.type);
    if (typeData && !formData.color) {
      setFormData((prev) => ({ ...prev, color: typeData.color }));
    }
  }, [formData.type]);

  React.useEffect(() => {
    if (formData.isAllDay && formData.startDate && !formData.endDate) {
      setFormData((prev) => ({ ...prev, endDate: prev.startDate }));
    }
  }, [formData.isAllDay, formData.startDate]);

  return (
    <div className="card" style={{ maxWidth: "800px" }}>
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
            background: "var(--gradient-sjsu-vibrant)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Event
        </h2>
        <span style={{ fontSize: "2rem" }}>📅</span>
      </div>

      <p className="card-subtitle" style={{ maxWidth: "100%" }}>
        Add events, meetings, or holidays to your calendar. All events are saved securely to Firestore.
      </p>

      {error && (
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            marginBottom: "32px",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {showSuccess && (
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: "rgba(48, 209, 88, 0.15)",
            border: "1px solid rgba(48, 209, 88, 0.3)",
            color: "#6ee7b7",
            marginBottom: "32px",
            textAlign: "center",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <strong>✓ Success!</strong> Event saved to Firestore successfully
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Event Title *
          <input
            className="form-input"
            type="text"
            placeholder="Example: Team Meeting, Spring Break, Project Deadline"
            value={formData.title}
            onChange={handleChange("title")}
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="form-label">
          Event Type *
          <select
            className="form-input"
            value={formData.type}
            onChange={handleChange("type")}
            disabled={isSubmitting}
            style={{ cursor: "pointer" }}
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          <label className="form-label">
            Start Date *
            <input
              className="form-input"
              type="date"
              value={formData.startDate}
              onChange={handleChange("startDate")}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="form-label">
            Start Time {!formData.isAllDay && "*"}
            <input
              className="form-input"
              type="time"
              value={formData.startTime}
              onChange={handleChange("startTime")}
              required={!formData.isAllDay}
              disabled={isSubmitting || formData.isAllDay}
            />
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          <label className="form-label">
            End Date
            <input
              className="form-input"
              type="date"
              value={formData.endDate}
              onChange={handleChange("endDate")}
              min={formData.startDate}
              disabled={isSubmitting}
            />
          </label>

          <label className="form-label">
            End Time
            <input
              className="form-input"
              type="time"
              value={formData.endTime}
              onChange={handleChange("endTime")}
              disabled={isSubmitting || formData.isAllDay}
            />
          </label>
        </div>

        <label
          className="form-label"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={formData.isAllDay}
            onChange={handleChange("isAllDay")}
            disabled={isSubmitting}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <span>All-day event</span>
        </label>

        <label className="form-label">
          Location (Optional)
          <input
            className="form-input"
            type="text"
            placeholder="Example: SJSU Library, Zoom Meeting, Online"
            value={formData.location}
            onChange={handleChange("location")}
            disabled={isSubmitting}
          />
        </label>

        <label className="form-label">
          Description (Optional)
          <textarea
            className="form-input"
            rows="5"
            placeholder="Add any additional details about this event..."
            value={formData.description}
            onChange={handleChange("description")}
            disabled={isSubmitting}
          />
        </label>

        <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
          <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ flex: 1 }}>
            {isSubmitting ? "💾 Saving..." : "💾 Save Event"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                type: "event",
                startDate: "",
                startTime: "",
                endDate: "",
                endTime: "",
                isAllDay: false,
                location: "",
                description: "",
                color: "",
              });
              setError(null);
            }}
            disabled={isSubmitting}
            style={{
              padding: "16px 32px",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(229, 168, 35, 0.3)",
              background: "rgba(229, 168, 35, 0.1)",
              color: "var(--sjsu-gold-light)",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all var(--transition-smooth)",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.background = "rgba(229, 168, 35, 0.2)";
                e.target.style.borderColor = "rgba(229, 168, 35, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(229, 168, 35, 0.1)";
              e.target.style.borderColor = "rgba(229, 168, 35, 0.3)";
            }}
          >
            Clear Form
          </button>
        </div>
      </form>

      <p className="hint-text" style={{ marginTop: "32px" }}>
        * Required fields • All event data persists to Firestore database
      </p>
    </div>
  );
}

export default EventForm;

