// Firestore Service - CRUD operations for tasks
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

// User ID - for now using "martinSanchez" as demo user
// In production, this would come from Firebase Auth
const USER_ID = "martinSanchez";

// Get user's tasks collection reference
const getTasksCollection = () => {
  return collection(db, 'users', USER_ID, 'tasks');
};

// Convert Firestore timestamp to JavaScript Date
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

// Convert task data for display
const formatTask = (doc) => {
  const data = doc.data();
  const dueDate = convertTimestamp(data.dueAt);
  
  // Map backend status to frontend status
  const statusMap = {
    'open': 'Not Started',
    'in_progress': 'In Progress',
    'done': 'Completed'
  };

  // Map backend priority (0/1/2) to frontend priority (Low/Medium/High)
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

// Get all tasks for the user
export const getAllTasks = async () => {
  try {
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
    throw error;
  }
};

// Get a single task by ID
export const getTask = async (taskId) => {
  try {
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

// Create a new task
export const createTask = async (taskData) => {
  try {
    const tasksRef = getTasksCollection();
    
    // Map frontend priority to backend priority
    const priorityMap = {
      'Low': 0,
      'Medium': 1,
      'High': 2
    };

    // Map frontend status to backend status
    const statusMap = {
      'Not Started': 'open',
      'In Progress': 'in_progress',
      'Completed': 'done'
    };

    // Convert dueDate string to Firestore Timestamp
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

// Update an existing task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'users', USER_ID, 'tasks', taskId);
    
    // Map frontend priority to backend priority if needed
    if (updates.priority) {
      const priorityMap = {
        'Low': 0,
        'Medium': 1,
        'High': 2
      };
      updates.priority = priorityMap[updates.priority];
    }

    // Map frontend status to backend status if needed
    if (updates.status) {
      const statusMap = {
        'Not Started': 'open',
        'In Progress': 'in_progress',
        'Completed': 'done'
      };
      updates.status = statusMap[updates.status];
    }

    // Convert dueDate string to Firestore Timestamp if provided
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

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, 'users', USER_ID, 'tasks', taskId);
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Get tasks by status
export const getTasksByStatus = async (status) => {
  try {
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
    throw error;
  }
};

// Get task statistics
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
    throw error;
  }
};

