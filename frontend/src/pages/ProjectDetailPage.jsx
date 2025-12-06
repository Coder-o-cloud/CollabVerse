// HOW IT WORKS:
// This page displays detailed information about a project
// It shows project details, team members, tasks, chat, and files

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import ChatWindow from '../components/ChatWindow';
import FileUploader from '../components/FileUploader';
import AnimatedBackground from '../components/AnimatedBackground';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await apiClient.getProjectById(id);
        setProject(projectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleFileUpload = (fileData) => {
    console.log('File uploaded:', fileData);
    // In a real app, you would update the project with the new file
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AnimatedBackground>
    );
  }

  if (error) {
    return (
      <AnimatedBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-red-300">Error: {error}</div>
      </AnimatedBackground>
    );
  }

  if (!project) {
    return (
      <AnimatedBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">Project not found</div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          <p className="mt-2 text-gray-300">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`badge ${project.visibility === 'public' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
              {project.visibility}
            </span>
            <span className={`badge ${project.status === 'active' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <KanbanBoard projectId={project._id} />
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
              <div className="space-y-3">
                {project.members.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold">
                        {member.userId.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{member.userId.name}</p>
                      <p className="text-sm text-gray-400 capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full btn-3d-secondary">
                Invite Member
              </button>
            </div>

            <ChatWindow projectId={project._id} user={user} />

            <FileUploader onUpload={handleFileUpload} />
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default ProjectDetailPage;