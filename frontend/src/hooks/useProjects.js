// HOW IT WORKS:
// This hook manages project data and provides functions to interact with projects
// It handles fetching, creating, and updating projects

import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const newProject = await apiClient.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const updatedProject = await apiClient.updateProject(id, projectData);
      setProjects(prev => 
        prev.map(project => 
          project._id === id ? updatedProject : project
        )
      );
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getProjectById = async (id) => {
    try {
      const project = await apiClient.getProjectById(id);
      return project;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    getProjectById
  };
};