import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const ProjectReviewPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await apiClient.getTeacherProjects();
        // Transform the data to match our UI structure
        const transformedProjects = projectData.map(project => ({
          id: project._id,
          title: project.title,
          description: project.description,
          team: project.members.map(member => member.userId.name),
          status: project.status === 'completed' ? 'Reviewed' : 'Submitted for Review',
          submittedDate: new Date(project.createdAt).toLocaleDateString(),
          reviewStatus: project.status === 'completed' ? 'completed' : 'pending'
        }));
        setProjects(transformedProjects);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted for Review':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Reviewed':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getReviewBadgeClass = (reviewStatus) => {
    switch (reviewStatus) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card p-4 border border-red-500/30">
            <div className="text-red-300">
              {error}
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Reviews</h1>
          <p className="text-gray-300 text-lg">Review and evaluate student projects</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-gray-300">{project.description}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReviewBadgeClass(project.reviewStatus)}`}>
                    {project.reviewStatus.replace('_', ' ')}
                  </span>
                  {project.grade && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Grade: {project.grade}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-white">Team Members</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.team.map((member, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-400">
                <span>Submitted on {project.submittedDate}</span>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="btn-3d-primary">
                  Review Project
                </button>
                <button className="btn-3d-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default ProjectReviewPage;