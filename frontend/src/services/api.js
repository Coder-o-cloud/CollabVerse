// HOW IT WORKS:
// This service provides functions to interact with the backend API
// It handles authentication, requests, and responses

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      ...options
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is empty
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/users${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getUserByIdAdmin(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: { role }
    });
  }

  // Teacher endpoints
  async getTeacherProjects() {
    return this.request('/teacher/projects');
  }

  async submitProjectReview(projectId, reviewData) {
    return this.request(`/teacher/projects/${projectId}/review`, {
      method: 'POST',
      body: reviewData
    });
  }

  // Student endpoints
  async getStudentProjects() {
    return this.request('/student/projects');
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: userData
    });
  }

  // Project endpoints
  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: projectData
    });
  }

  async getProjects() {
    return this.request('/projects');
  }

  async getProjectById(id) {
    return this.request(`/projects/${id}`);
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: projectData
    });
  }

  async inviteUserToProject(projectId, invitationData) {
    return this.request(`/projects/${projectId}/invite`, {
      method: 'POST',
      body: invitationData
    });
  }

  async requestToJoinProject(projectId) {
    return this.request(`/projects/${projectId}/join`, {
      method: 'POST'
    });
  }

  // Task endpoints
  async createTask(projectId, taskData) {
    return this.request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: taskData
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: taskData
    });
  }

  async getTasksByProject(projectId) {
    return this.request(`/projects/${projectId}/tasks`);
  }

  // Matching endpoints
  async getMatches(matchData) {
    return this.request('/match', {
      method: 'POST',
      body: matchData
    });
  }

  // Rating endpoints
  async rateTeammate(projectId, ratingData) {
    return this.request(`/projects/${projectId}/rate`, {
      method: 'POST',
      body: ratingData
    });
  }

  // Message endpoints
  async getMessageHistory(userId) {
    return this.request(`/messages/history/${userId}`);
  }

  async getUnreadCounts() {
    return this.request(`/messages/unread`);
  }
}

const apiClient = new ApiClient();
export default apiClient;