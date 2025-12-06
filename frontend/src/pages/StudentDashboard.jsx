import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-300 text-lg">Find projects, collaborate with teammates, and build amazing things</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Find Projects</h3>
                <p className="text-gray-400">Discover projects that match your skills</p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/matches" className="btn-3d-primary w-full text-center block">Browse Projects</Link>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">My Teams</h3>
                <p className="text-gray-400">View your current project teams</p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/student/projects" className="btn-3d-primary w-full text-center block">View Teams</Link>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Create Project</h3>
                <p className="text-gray-400">Start your own collaborative project</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/project/create')}
                className="btn-3d-success w-full"
              >
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default StudentDashboard;