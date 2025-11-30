import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const USER_ID = "martinSanchez";

const checkFirebaseInit = () => {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your Firebase configuration.');
  }
};

const getTasksCollection = () => {
  checkFirebaseInit();
  return collection(db, 'users', USER_ID, 'tasks');
};

const getEventsCollection = () => {
  checkFirebaseInit();
  return collection(db, 'users', USER_ID, 'events');
};

const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

const formatTask = (doc) => {
  const data = doc.data();
  const dueDate = convertTimestamp(data.dueAt);
  
  const statusMap = {
    'open': 'Not Started',
    'in_progress': 'In Progress',
    'done': 'Completed'
  };

  const priorityMap = {
    0: 'Low',
    1: 'Medium',
    2: 'High'
  };

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    category: data.categoryName || data.categoryId || 'Other',
    priority: priorityMap[data.priority] || 'Medium',
    dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
    dueAt: dueDate,
    status: statusMap[data.status] || 'Not Started',
    courseId: data.courseId || '',
    courseName: data.courseName || '',
    categoryId: data.categoryId || '',
    tags: data.tags || [],
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

export const getAllTasks = async () => {
  try {
    checkFirebaseInit();
    const tasksRef = getTasksCollection();
    const q = query(tasksRef, orderBy('dueAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push(formatTask(doc));
    });
    
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    if (error.message.includes('Firebase is not initialized')) {
      throw error;
    }
    return [];
  }
};

export const getTask = async (taskId) => {
  try {
    checkFirebaseInit();
    const taskRef = doc(db, 'users', USER_ID, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (taskSnap.exists()) {
      return formatTask(taskSnap);
    } else {
      throw new Error('Task not found');
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    checkFirebaseInit();
    const tasksRef = getTasksCollection();
    
    const priorityMap = {
      'Low': 0,
      'Medium': 1,
      'High': 2
    };

    const statusMap = {
      'Not Started': 'open',
      'In Progress': 'in_progress',
      'Completed': 'done'
    };

    let dueAt = null;
    if (taskData.dueDate) {
      dueAt = Timestamp.fromDate(new Date(taskData.dueDate));
    }

    const taskToSave = {
      title: taskData.title,
      description: taskData.notes || '',
      priority: priorityMap[taskData.priority] || 1,
      status: statusMap[taskData.status] || 'open',
      dueAt: dueAt || serverTimestamp(),
      courseId: taskData.courseId || '',
      courseName: taskData.courseName || taskData.category || '',
      categoryId: taskData.categoryId || taskData.category?.toLowerCase() || 'other',
      categoryName: taskData.category || 'Other',
      tags: taskData.tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(tasksRef, taskToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    checkFirebaseInit();
    const taskRef = doc(db, 'users', USER_ID, 'tasks', taskId);
    
    if (updates.priority) {
      const priorityMap = {
        'Low': 0,
        'Medium': 1,
        'High': 2
      };
      updates.priority = priorityMap[updates.priority];
    }

    if (updates.status) {
      const statusMap = {
        'Not Started': 'open',
        'In Progress': 'in_progress',
        'Completed': 'done'
      };
      updates.status = statusMap[updates.status];
    }

    if (updates.dueDate) {
      updates.dueAt = Timestamp.fromDate(new Date(updates.dueDate));
      delete updates.dueDate;
    }

    updates.updatedAt = serverTimestamp();
    
    await updateDoc(taskRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    checkFirebaseInit();
    const taskRef = doc(db, 'users', USER_ID, 'tasks', taskId);
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getTasksByStatus = async (status) => {
  try {
    checkFirebaseInit();
    const tasksRef = getTasksCollection();
    const statusMap = {
      'Not Started': 'open',
      'In Progress': 'in_progress',
      'Completed': 'done'
    };
    const backendStatus = statusMap[status] || status;
    const q = query(tasksRef, where('status', '==', backendStatus), orderBy('dueAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push(formatTask(doc));
    });
    
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }
};

export const getTaskStats = async () => {
  try {
    const allTasks = await getAllTasks();
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'Completed').length,
      inProgressTasks: allTasks.filter(t => t.status === 'In Progress').length,
      notStartedTasks: allTasks.filter(t => t.status === 'Not Started').length,
      upcomingThisWeek: allTasks.filter(t => {
        if (!t.dueAt) return false;
        const dueDate = t.dueAt instanceof Date ? t.dueAt : new Date(t.dueAt);
        return dueDate >= now && dueDate <= oneWeekFromNow && t.status !== 'Completed';
      }).length,
      overdue: allTasks.filter(t => {
        if (!t.dueAt) return false;
        const dueDate = t.dueAt instanceof Date ? t.dueAt : new Date(t.dueAt);
        return dueDate < now && t.status !== 'Completed';
      }).length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      notStartedTasks: 0,
      upcomingThisWeek: 0,
      overdue: 0,
    };
  }
};

const formatEvent = (doc) => {
  const data = doc.data();
  const startDate = convertTimestamp(data.startDate);
  const endDate = convertTimestamp(data.endDate);
  
  const typeColors = {
    'event': '#667eea',
    'meeting': '#4facfe',
    'holiday': '#30d158'
  };

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    type: data.type || 'event',
    color: data.color || typeColors[data.type] || '#667eea',
    location: data.location || '',
    startDate: startDate,
    endDate: endDate,
    isAllDay: data.isAllDay || false,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

export const getAllEvents = async () => {
  try {
    checkFirebaseInit();
    const eventsRef = getEventsCollection();
    const q = query(eventsRef, orderBy('startDate', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push(formatEvent(doc));
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    if (error.message.includes('Firebase is not initialized')) {
      throw error;
    }
    return [];
  }
};

export const getEvent = async (eventId) => {
  try {
    checkFirebaseInit();
    const eventRef = doc(db, 'users', USER_ID, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return formatEvent(eventSnap);
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    checkFirebaseInit();
    const eventsRef = getEventsCollection();
    
    const typeColors = {
      'event': '#667eea',
      'meeting': '#4facfe',
      'holiday': '#30d158'
    };

    let startDate = null;
    let endDate = null;
    
    if (eventData.startDate && eventData.startTime) {
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      startDate = Timestamp.fromDate(startDateTime);
    } else if (eventData.startDate) {
      const startDateTime = new Date(eventData.startDate);
      startDate = Timestamp.fromDate(startDateTime);
    }

    if (eventData.endDate && eventData.endTime) {
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);
      endDate = Timestamp.fromDate(endDateTime);
    } else if (eventData.endDate) {
      const endDateTime = new Date(eventData.endDate);
      endDate = Timestamp.fromDate(endDateTime);
    } else if (startDate) {
      endDate = startDate;
    }

    const eventToSave = {
      title: eventData.title,
      description: eventData.description || '',
      type: eventData.type || 'event',
      color: eventData.color || typeColors[eventData.type] || '#667eea',
      location: eventData.location || '',
      startDate: startDate || serverTimestamp(),
      endDate: endDate || startDate || serverTimestamp(),
      isAllDay: eventData.isAllDay || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(eventsRef, eventToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, updates) => {
  try {
    checkFirebaseInit();
    const eventRef = doc(db, 'users', USER_ID, 'events', eventId);
    
    if (updates.startDate || updates.startTime) {
      if (updates.startDate && updates.startTime) {
        const startDateTime = new Date(`${updates.startDate}T${updates.startTime}`);
        updates.startDate = Timestamp.fromDate(startDateTime);
        delete updates.startTime;
      } else if (updates.startDate) {
        updates.startDate = Timestamp.fromDate(new Date(updates.startDate));
      }
    }

    if (updates.endDate || updates.endTime) {
      if (updates.endDate && updates.endTime) {
        const endDateTime = new Date(`${updates.endDate}T${updates.endTime}`);
        updates.endDate = Timestamp.fromDate(endDateTime);
        delete updates.endTime;
      } else if (updates.endDate) {
        updates.endDate = Timestamp.fromDate(new Date(updates.endDate));
      }
    }

    updates.updatedAt = serverTimestamp();
    
    await updateDoc(eventRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    checkFirebaseInit();
    const eventRef = doc(db, 'users', USER_ID, 'events', eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
