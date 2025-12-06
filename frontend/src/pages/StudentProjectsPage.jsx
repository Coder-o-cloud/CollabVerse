import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const StudentProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await apiClient.getStudentProjects();
        // Transform the data to match our UI structure
        const transformedProjects = projectData.map(project => ({
          id: project._id,
          title: project.title,
          description: project.description,
          status: project.status,
          teamMembers: project.members.length,
          progress: project.status === 'completed' ? 100 : project.status === 'active' ? 75 : 20
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
      case 'active':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'planning':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
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

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">My Projects</h1>
              <p className="text-gray-300 mt-1">Manage your collaborative projects and teams</p>
            </div>
            <button
              onClick={() => navigate('/project/create')}
              className="btn-3d-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Project
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
              <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">Get started by creating a new project or joining an existing one.</p>
            <button
              onClick={() => navigate('/project/create')}
              className="btn-3d-primary inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {project.teamMembers} {project.teamMembers === 1 ? 'member' : 'members'}
                  </span>
                  <Link
                    to={`/project/${project.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default StudentProjectsPage;