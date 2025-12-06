// HOW IT WORKS:
// This page displays user profile information and allows editing for the current user
// It shows skills, bio, availability, and other profile details

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api';
import SkillTag from '../components/SkillTag';
import PrivateChatWindow from '../components/PrivateChatWindow';
import AnimatedBackground from '../components/AnimatedBackground';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    bio: '',
    availability: { timezone: '', hours: '' },
    skills: []
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = id || currentUser?._id;
        if (userId) {
          const userData = await apiClient.getUserById(userId);
          setUser(userData);

          // If this is the current user's profile, populate form data for editing
          if (userId === currentUser?._id) {
            setFormData({
              name: userData.name || '',
              college: userData.college || '',
              bio: userData.bio || '',
              availability: userData.availability || { timezone: '', hours: '' },
              skills: userData.skills || []
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user.name || '',
      college: user.college || '',
      bio: user.bio || '',
      availability: user.availability || { timezone: '', hours: '' },
      skills: user.skills || []
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [name]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() !== '') {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill]
      });
      setNewSkill({ name: '', level: 3 });
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  const handleSkillLevelChange = (index, level) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].level = level;
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await apiClient.updateUser(currentUser._id, formData);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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

  if (!user) {
    return (
      <AnimatedBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">User not found</div>
      </AnimatedBackground>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showChat && (
          <PrivateChatWindow
            recipient={user}
            onClose={() => setShowChat(false)}
          />
        )}

        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-4xl">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-300">{user.college}</p>
                  <p className="text-sm text-gray-400 capitalize mt-1">
                    Role: {user.role}
                  </p>
                </div>

                {!isOwnProfile && (
                  <button
                    onClick={() => setShowChat(true)}
                    className="btn-3d-primary mt-4 md:mt-0"
                  >
                    Message
                  </button>
                )}

                {isOwnProfile && !editing && (
                  <button
                    onClick={handleEdit}
                    className="btn-3d-secondary mt-4 md:mt-0"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {user.bio && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-white">Bio</h2>
                  <p className="text-gray-300 mt-2">{user.bio}</p>
                </div>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-white">Skills</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              {user.availability && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-white">Availability</h2>
                  <div className="mt-2">
                    <p className="text-gray-300">
                      <span className="font-medium">Timezone:</span> {user.availability.timezone}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Hours:</span> {user.availability.hours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="glass-card p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                    College
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="form-input mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <input
                    type="text"
                    id="timezone"
                    name="timezone"
                    value={formData.availability.timezone}
                    onChange={handleAvailabilityChange}
                    className="form-input mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                    Available Hours
                  </label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={formData.availability.hours}
                    onChange={handleAvailabilityChange}
                    className="form-input mt-1"
                    placeholder="e.g., 9 AM - 5 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-input mt-1"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <div className="mt-2 space-y-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const updatedSkills = [...formData.skills];
                            updatedSkills[index].name = e.target.value;
                            setFormData({ ...formData, skills: updatedSkills });
                          }}
                          className="form-input flex-1"
                          placeholder="Skill name"
                        />
                        <div className="ml-2 flex items-center">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleSkillLevelChange(index, level)}
                              className={`w-8 h-8 mx-1 rounded-full flex items-center justify-center ${skill.level >= level
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <div className="flex">
                      <input
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="form-input flex-1"
                        placeholder="Add a new skill"
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
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-3d-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default ProfilePage;