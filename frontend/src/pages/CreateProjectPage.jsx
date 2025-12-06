import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    visibility: 'public'
  });
  const [newSkill, setNewSkill] = useState({ name: '', weight: 3 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill]
      }));
      setNewSkill({ name: '', weight: 3 });
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => {
      const updatedSkills = [...prev.requiredSkills];
      updatedSkills.splice(index, 1);
      return { ...prev, requiredSkills: updatedSkills };
    });
  };

  const handleSkillWeightChange = (index, weight) => {
    setFormData(prev => {
      const updatedSkills = [...prev.requiredSkills];
      updatedSkills[index].weight = weight;
      return { ...prev, requiredSkills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        ...formData,
        ownerId: user._id
      };

      const newProject = await apiClient.createProject(projectData);
      navigate(`/project/${newProject._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Create New Project</h1>
          <p className="text-gray-300 mt-2">Start a new collaborative project and find teammates with the right skills.</p>
        </div>

        <div className="glass-card p-6">
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4">
              <div className="text-sm text-red-300">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your project, goals, and what you're hoping to accomplish..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Required Skills
                </label>
                <div className="mt-2 space-y-3">
                  {formData.requiredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div>
                        <span className="font-medium text-white">{skill.name}</span>
                        <span className="ml-2 text-sm text-gray-400">
                          Weight: {skill.weight}/5
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleSkillWeightChange(index, level)}
                              className={`w-6 h-6 mx-1 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${skill.weight >= level
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                  : 'bg-white/10 text-gray-400'
                                }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex">
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add a required skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="ml-2 btn-3d-secondary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-300 mb-1">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="public" className="bg-slate-800 text-white">Public - Anyone can see this project</option>
                  <option value="private" className="bg-slate-800 text-white">Private - Only invited members can see this project</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-3d-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Project'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default CreateProjectPage;