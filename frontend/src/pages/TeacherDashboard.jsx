import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const TeacherDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, you would fetch projects and students assigned to this teacher
        // For now, we'll just simulate the data
        setProjects([
          { id: 1, title: 'Web Development Project', status: 'In Progress', teamSize: 4 },
          { id: 2, title: 'Mobile App Design', status: 'Review', teamSize: 3 },
          { id: 3, title: 'Data Analysis Research', status: 'Completed', teamSize: 5 }
        ]);

        setStudents([
          { id: 1, name: 'John Smith', email: 'john@example.com', projects: 2 },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', projects: 1 },
          { id: 3, name: 'Michael Brown', email: 'michael@example.com', projects: 3 }
        ]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-gray-300 text-lg">Review student projects and monitor progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">{projects.length}</h3>
                <p className="text-gray-400">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">{students.length}</h3>
                <p className="text-gray-400">Assigned Students</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Project Reviews</h3>
                <p className="text-gray-400">Review and evaluate student projects</p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/teacher/projects" className="btn-3d-primary w-full text-center block">View Projects</Link>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Student Progress</h3>
                <p className="text-gray-400">Monitor student team collaboration</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-3d-secondary w-full">View Students</button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default TeacherDashboard;