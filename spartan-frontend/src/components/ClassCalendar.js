import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { getAllEvents, deleteEvent } from "../services/firestoreService";

function ClassCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [events, setEvents] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const classSchedule = [
    {
      id: 1,
      course: "CS 122",
      title: "Advanced Python Programming",
      day: "Monday",
      startTime: "10:00",
      endTime: "11:15",
      location: "ENG 189",
      instructor: "Dr. Smith",
      color: "#667eea",
    },
    {
      id: 2,
      course: "CS 22B",
      title: "Python Data Analysis",
      day: "Monday",
      startTime: "14:00",
      endTime: "15:15",
      location: "ENG 201",
      instructor: "Dr. Johnson",
      color: "#764ba2",
    },
    {
      id: 3,
      course: "CS 163",
      title: "Data Science Project",
      day: "Wednesday",
      startTime: "10:00",
      endTime: "11:15",
      location: "ENG 189",
      instructor: "Dr. Williams",
      color: "#f093fb",
    },
    {
      id: 4,
      course: "CS 171",
      title: "Intro Machine Learning",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:15",
      location: "ENG 205",
      instructor: "Dr. Brown",
      color: "#4facfe",
    },
    {
      id: 5,
      course: "KIN 35B",
      title: "Intermediate Weight Training",
      day: "Tuesday",
      startTime: "16:00",
      endTime: "17:00",
      location: "GYM A",
      instructor: "Coach Martinez",
      color: "#30d158",
    },
    {
      id: 6,
      course: "SSCI 101",
      title: "Leadership",
      day: "Thursday",
      startTime: "11:00",
      endTime: "12:15",
      location: "CL 201",
      instructor: "Dr. Davis",
      color: "#ff9f0a",
    },
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    fetchEvents();
  }, []);

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const getClassesForDay = (date) => {
    const dayName = format(date, "EEEE");
    return classSchedule.filter((cls) => cls.day === dayName);
  };

  const getEventsForDay = (date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    return events.filter((event) => {
      if (!event.startDate) return false;
      const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
      
      if (event.isAllDay) {
        return isSameDay(startDate, date);
      }
      
      const endDate = event.endDate ? (event.endDate instanceof Date ? event.endDate : new Date(event.endDate)) : startDate;
      return isWithinInterval(startDate, { start: dayStart, end: dayEnd }) ||
             isWithinInterval(endDate, { start: dayStart, end: dayEnd }) ||
             (startDate <= dayStart && endDate >= dayEnd);
    });
  };

  const navigateWeek = (direction) => {
    if (viewMode === "week") {
      setCurrentDate((prev) => (direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)));
      } else {
        setCurrentDate((prev) => {
        const newDate = new Date(prev);
        if (direction === "next") {
          newDate.setMonth(newDate.getMonth() + 1);
        } else {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        return newDate;
      });
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirmDeleteId !== eventId) {
      setConfirmDeleteId(eventId);
      return;
    }

    try {
      setDeletingId(eventId);
      setConfirmDeleteId(null);
      await deleteEvent(eventId);
      const updatedEvents = events.filter(e => e.id !== eventId);
      setEvents(updatedEvents);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const days = viewMode === "week" ? getWeekDays() : getMonthDays();

  return (
    <div className="class-calendar-widget">
      <div className="calendar-header">
        <div className="calendar-title-section">
          <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}>📅 Class Schedule</h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {format(currentDate, "MMMM yyyy")}
          </p>
        </div>
        <div className="calendar-controls">
          <button className="calendar-btn" onClick={() => navigateWeek("prev")}>
            ←
          </button>
          <button className="calendar-btn" onClick={goToToday}>
            Today
          </button>
          <button className="calendar-btn" onClick={() => navigateWeek("next")}>
            →
          </button>
          <select
            className="calendar-view-select"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {viewMode === "week" ? (
        <div className="calendar-week-view">
          <div className="calendar-day-headers">
            {days.map((day) => (
              <div key={day.toISOString()} className="calendar-day-header">
                <div className="calendar-day-name">{format(day, "EEE")}</div>
                <div className={`calendar-day-number ${isSameDay(day, new Date()) ? "today" : ""}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          <div className="calendar-day-content">
            {days.map((day) => {
              const classes = getClassesForDay(day);
              const dayEvents = getEventsForDay(day);
              return (
                <div key={day.toISOString()} className="calendar-day-column">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="calendar-class-item"
                      style={{ borderLeft: `4px solid ${cls.color}` }}
                    >
                      <div className="class-time">{cls.startTime}</div>
                      <div className="class-course">{cls.course}</div>
                      <div className="class-title">{cls.title}</div>
                      <div className="class-location">📍 {cls.location}</div>
                    </div>
                  ))}
                  {dayEvents.map((event) => {
                    const isDeleting = deletingId === event.id;
                    const isConfirming = confirmDeleteId === event.id;
                    return (
                      <div
                        key={event.id}
                        className="calendar-class-item"
                        style={{ 
                          borderLeft: `4px solid ${event.color}`,
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          disabled={isDeleting}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            border: isConfirming
                              ? "1px solid rgba(255, 69, 58, 0.5)"
                              : "1px solid rgba(255, 69, 58, 0.3)",
                            background: isConfirming
                              ? "rgba(255, 69, 58, 0.2)"
                              : "rgba(255, 69, 58, 0.1)",
                            color: "#ff6961",
                            fontSize: "0.65rem",
                            fontWeight: "700",
                            cursor: isDeleting ? "wait" : "pointer",
                            transition: "all var(--transition-smooth)",
                            opacity: isDeleting ? 0.6 : 1,
                            zIndex: 10,
                          }}
                          title={isConfirming ? "Click again to confirm" : "Delete event"}
                        >
                          {isDeleting ? "..." : isConfirming ? "✓" : "🗑️"}
                        </button>
                        <div className="class-time">
                          {event.isAllDay 
                            ? "All Day" 
                            : event.startDate 
                              ? format(new Date(event.startDate), "h:mm a")
                              : ""}
                        </div>
                        <div className="class-course">{event.title}</div>
                        <div className="class-title">
                          {event.type === "event" ? "📅 Event" : event.type === "meeting" ? "👥 Meeting" : "🎉 Holiday"}
                        </div>
                        {event.location && (
                          <div className="class-location">📍 {event.location}</div>
                        )}
                      </div>
                    );
                  })}
                  {classes.length === 0 && dayEvents.length === 0 && (
                    <div className="calendar-empty-day">No events</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="calendar-month-view">
          {/* Weekday Headers */}
          <div className="calendar-month-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-month-weekday">
                {day}
              </div>
            ))}
          </div>
          {/* Calendar Grid */}
          <div className="calendar-month-grid">
            {days.map((day) => {
              const classes = getClassesForDay(day);
              const isCurrentMonth = format(day, "M") === format(currentDate, "M");
              return (
                <div
                  key={day.toISOString()}
                  className={`calendar-month-day ${isSameDay(day, new Date()) ? "today" : ""} ${!isCurrentMonth ? "other-month" : ""}`}
                >
                  <div className="calendar-month-day-number">{format(day, "d")}</div>
                  {classes.length > 0 && (
                    <div className="calendar-month-classes">
                      {classes.slice(0, 2).map((cls) => (
                        <div
                          key={cls.id}
                          className="calendar-month-class-dot"
                          style={{ backgroundColor: cls.color }}
                          title={`${cls.course}: ${cls.startTime}`}
                        ></div>
                      ))}
                      {classes.length > 2 && (
                        <div className="calendar-month-class-more">+{classes.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <div className="legend-title">Classes</div>
        <div className="legend-items">
          {classSchedule.map((cls) => (
            <div key={cls.id} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: cls.color }}></div>
              <span className="legend-text">{cls.course}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassCalendar;

