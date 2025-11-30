import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { getAllTasks, getAllEvents, deleteTask, deleteEvent } from "../services/firestoreService";

function CalendarPage({ setView }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const classSchedule = [
    {
      id: 1,
      course: "CS 122",
      title: "Advanced Python Programming",
      day: "Monday",
      startTime: "10:00",
      endTime: "11:15",
      location: "ENG 189",
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
      color: "#ff9f0a",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedEvents] = await Promise.all([
          getAllTasks(),
          getAllEvents()
        ]);
        setTasks(fetchedTasks);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error loading calendar data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getClassesForDay = (date) => {
    const dayName = format(date, "EEEE");
    return classSchedule.filter((cls) => cls.day === dayName);
  };

  const getTasksForDay = (date) => {
    return tasks.filter((task) => {
      if (!task.dueAt && !task.dueDate) return false;
      const taskDate = task.dueAt instanceof Date ? task.dueAt : new Date(task.dueAt || task.dueDate);
      return isSameDay(taskDate, date);
    });
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
    setCurrentDate((prev) => (direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDelete = async (id, type) => {
    const key = `${type}-${id}`;
    if (confirmDeleteId !== key) {
      setConfirmDeleteId(key);
      setDeleteType(type);
      return;
    }

    try {
      setDeletingId(key);
      setConfirmDeleteId(null);
      
      if (type === 'task') {
        await deleteTask(id);
        const updatedTasks = tasks.filter(t => t.id !== id);
        setTasks(updatedTasks);
      } else {
        await deleteEvent(id);
        const updatedEvents = events.filter(e => e.id !== id);
        setEvents(updatedEvents);
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      alert(`Failed to delete ${type}. Please try again.`);
    } finally {
      setDeletingId(null);
      setDeleteType(null);
    }
  };

  const days = getWeekDays();

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "var(--text-secondary)" }}>Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="calendar-page-header">
        <div>
          <h2>Calendar View</h2>
          <p className="card-subtitle" style={{ marginBottom: 0 }}>
            View your classes and tasks in a unified calendar
          </p>
        </div>
        <div className="calendar-controls">
          {setView && (
            <button 
              className="calendar-btn" 
              onClick={() => setView("eventform")}
              style={{ background: "var(--gradient-blue)", color: "white" }}
            >
              ➕ Add Event
            </button>
          )}
          <button className="calendar-btn" onClick={() => navigateWeek("prev")}>
            ← Previous
          </button>
          <button className="calendar-btn" onClick={goToToday}>
            Today
          </button>
          <button className="calendar-btn" onClick={() => navigateWeek("next")}>
            Next →
          </button>
        </div>
      </div>

      <div className="calendar-week-view-full">
        <div className="calendar-day-headers-full">
          {days.map((day) => (
            <div key={day.toISOString()} className="calendar-day-header-full">
              <div className="calendar-day-name-full">{format(day, "EEEE")}</div>
              <div className={`calendar-day-number-full ${isSameDay(day, new Date()) ? "today" : ""}`}>
                {format(day, "MMM d")}
              </div>
            </div>
          ))}
        </div>
        <div className="calendar-day-content-full">
          {days.map((day) => {
            const classes = getClassesForDay(day);
            const dayTasks = getTasksForDay(day);
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day.toISOString()} className="calendar-day-column-full">
                <div className="calendar-day-events">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="calendar-class-event"
                      style={{ borderLeft: `4px solid ${cls.color}` }}
                    >
                      <div className="event-time">{cls.startTime} - {cls.endTime}</div>
                      <div className="event-title">{cls.course}</div>
                      <div className="event-subtitle">{cls.title}</div>
                      <div className="event-location">📍 {cls.location}</div>
                    </div>
                  ))}
                  {dayEvents.map((event) => {
                    const deleteKey = `event-${event.id}`;
                    const isDeleting = deletingId === deleteKey;
                    const isConfirming = confirmDeleteId === deleteKey;
                    return (
                      <div
                        key={event.id}
                        className="calendar-task-event"
                        style={{ 
                          borderLeft: `4px solid ${event.color}`,
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event.id, 'event');
                          }}
                          disabled={isDeleting}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: isConfirming
                              ? "1px solid rgba(255, 69, 58, 0.5)"
                              : "1px solid rgba(255, 69, 58, 0.3)",
                            background: isConfirming
                              ? "rgba(255, 69, 58, 0.2)"
                              : "rgba(255, 69, 58, 0.1)",
                            color: "#ff6961",
                            fontSize: "0.7rem",
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
                        <div className="event-time">
                          {event.isAllDay 
                            ? "All Day" 
                            : event.startDate 
                              ? `${format(new Date(event.startDate), "h:mm a")}${event.endDate ? ` - ${format(new Date(event.endDate), "h:mm a")}` : ""}`
                              : ""}
                        </div>
                        <div className="event-title">{event.title}</div>
                        <div className="event-subtitle">
                          {event.type === "event" ? "📅 Event" : event.type === "meeting" ? "👥 Meeting" : "🎉 Holiday"}
                        </div>
                        {event.location && (
                          <div className="event-location">📍 {event.location}</div>
                        )}
                      </div>
                    );
                  })}
                  {dayTasks.map((task) => {
                    const deleteKey = `task-${task.id}`;
                    const isDeleting = deletingId === deleteKey;
                    const isConfirming = confirmDeleteId === deleteKey;
                    return (
                      <div
                        key={task.id}
                        className="calendar-task-event"
                        style={{ 
                          borderLeft: `4px solid var(--accent-blue-light)`,
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id, 'task');
                          }}
                          disabled={isDeleting}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: isConfirming
                              ? "1px solid rgba(255, 69, 58, 0.5)"
                              : "1px solid rgba(255, 69, 58, 0.3)",
                            background: isConfirming
                              ? "rgba(255, 69, 58, 0.2)"
                              : "rgba(255, 69, 58, 0.1)",
                            color: "#ff6961",
                            fontSize: "0.7rem",
                            fontWeight: "700",
                            cursor: isDeleting ? "wait" : "pointer",
                            transition: "all var(--transition-smooth)",
                            opacity: isDeleting ? 0.6 : 1,
                            zIndex: 10,
                          }}
                          title={isConfirming ? "Click again to confirm" : "Delete task"}
                        >
                          {isDeleting ? "..." : isConfirming ? "✓" : "🗑️"}
                        </button>
                        <div className="event-time">Due: {format(new Date(task.dueAt || task.dueDate), "h:mm a")}</div>
                        <div className="event-title">{task.title}</div>
                        <div className="event-subtitle">{task.category}</div>
                        <div className={`event-priority priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </div>
                      </div>
                    );
                  })}
                  {classes.length === 0 && dayTasks.length === 0 && dayEvents.length === 0 && (
                    <div className="calendar-empty-day-full">No events</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;

