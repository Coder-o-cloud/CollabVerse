// HOW IT WORKS:
// This is the main dashboard page for authenticated users
// It displays the user's projects and suggested matches

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import ProfileCard from '../components/ProfileCard';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Get matches based on user's skills
        const userSkills = user?.skills || [];
        if (userSkills.length > 0) {
          const matchData = {
            requiredSkills: userSkills.map(skill => ({
              name: skill.name,
              weight: skill.level
            }))
          };

          const matchResults = await apiClient.getMatches(matchData);
          setMatches(matchResults.slice(0, 3)); // Show top 3 matches
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setMatchesLoading(false);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user]);

  if (!user) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-300 text-lg">Here's what's happening with your projects and matches today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white">My Projects</h2>
              <Link to="/project/create" className="btn-3d-primary flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Project
              </Link>
            </div>

            {projectsLoading ? (
              <div className="glass-card p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                <span className="ml-3 text-gray-300">Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium text-white">No projects yet</h3>
                <p className="mt-2 text-gray-400 max-w-xs mx-auto">Get started by creating a new project to collaborate with your teammates.</p>
                <div className="mt-6">
                  <Link to="/project/create" className="btn-3d-primary inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Project
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.slice(0, 4).map(project => (
                  <div key={project._id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <span className={`badge ${project.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, index) => (
                          <img
                            key={index}
                            className="h-8 w-8 rounded-full border-2 border-slate-800 shadow-sm"
                            src={member.userId.avatarUrl || `https://ui-avatars.com/api/?name=${member.userId.name}&background=random`}
                            alt={member.userId.name}
                          />
                        ))}
                        {project.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-gray-300 shadow-sm">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Link to={`/project/${project._id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center transition-colors duration-200">
                        View Project
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white">Suggested Matches</h2>
              <Link to="/matches" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                View All
              </Link>
            </div>

            {matchesLoading ? (
              <div className="glass-card p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-3 text-gray-300">Finding matches...</span>
              </div>
            ) : matches.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 mb-4">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-400">No matches found. Complete your profile to get better matches.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map(match => (
                  <ProfileCard key={match.userId} user={{
                    _id: match.userId,
                    name: match.userName,
                    college: match.userCollege,
                    avatarUrl: match.userAvatar,
                    skills: [], // We don't have skills data in matches
                    rating: { avg: (match.explain.ratingScore / 20), count: 5 } // Approximate rating
                  }} showActions />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;