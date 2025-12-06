// HOW IT WORKS:
// This page displays matching results for users based on project requirements or skills
// It shows detailed scoring information and allows users to connect with matches

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/api';
import MatchList from '../components/MatchList';
import AnimatedBackground from '../components/AnimatedBackground';

const MatchResultsPage = () => {
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    projectId: '',
    requiredSkills: []
  });
  const [newSkill, setNewSkill] = useState({ name: '', weight: 3 });

  useEffect(() => {
    // If we have state passed from navigation, use it
    if (location.state?.projectId) {
      setSearchParams({
        projectId: location.state.projectId,
        requiredSkills: []
      });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!searchParams.projectId && searchParams.requiredSkills.length === 0) {
        return;
      }

      try {
        setLoading(true);
        const matchData = {};

        if (searchParams.projectId) {
          matchData.projectId = searchParams.projectId;
        } else {
          matchData.requiredSkills = searchParams.requiredSkills;
        }

        const matchResults = await apiClient.getMatches(matchData);
        setMatches(matchResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [searchParams]);

  const handleAddSkill = () => {
    if (newSkill.name.trim() !== '') {
      setSearchParams({
        ...searchParams,
        requiredSkills: [...searchParams.requiredSkills, newSkill]
      });
      setNewSkill({ name: '', weight: 3 });
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...searchParams.requiredSkills];
    updatedSkills.splice(index, 1);
    setSearchParams({
      ...searchParams,
      requiredSkills: updatedSkills
    });
  };

  const handleSkillWeightChange = (index, weight) => {
    const updatedSkills = [...searchParams.requiredSkills];
    updatedSkills[index].weight = weight;
    setSearchParams({
      ...searchParams,
      requiredSkills: updatedSkills
    });
  };

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Match Results</h1>
        <p className="text-gray-300 mb-8">Find the perfect teammates for your project</p>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Search by Skills</h2>
          <div className="space-y-4">
            {searchParams.requiredSkills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={skill.name}
                  readOnly
                  className="flex-1 mr-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
                />
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map(weight => (
                    <button
                      key={weight}
                      type="button"
                      onClick={() => handleSkillWeightChange(index, weight)}
                      className={`w-8 h-8 rounded-full mx-1 transition-all duration-200 ${weight <= skill.weight
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white/10 text-gray-400'
                        }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex items-center">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Add required skill"
                className="flex-1 mr-2 px-4 py-2 bg-white/10 border border-white/20 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map(weight => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setNewSkill({ ...newSkill, weight })}
                    className={`w-8 h-8 rounded-full mx-1 transition-all duration-200 ${weight <= newSkill.weight
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/10 text-gray-400'
                      }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-3d-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-4 border border-red-500/30">
            <div className="text-red-300">
              Error: {error}
            </div>
          </div>
        ) : (
          <MatchList matches={matches} />
        )}
      </div>
    </AnimatedBackground>
  );
};

export default MatchResultsPage;