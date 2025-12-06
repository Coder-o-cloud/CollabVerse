// HOW IT WORKS:
// This hook manages task data for a specific project
// It handles fetching, creating, and updating tasks within a project

import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTasksByProject(projectId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await apiClient.createTask(projectId, taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await apiClient.updateTask(taskId, taskData);
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask
  };
};