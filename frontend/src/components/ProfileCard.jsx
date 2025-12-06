// HOW IT WORKS:
// This component displays a user's profile information in a card format
// It shows the user's avatar, name, college, skills, and rating

import React from 'react';
import { Link } from 'react-router-dom';
import SkillTag from './SkillTag';

const ProfileCard = ({ user, showActions = false }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="card p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-5">
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {getInitials(user.name)}
          </div>
        )}
        <div className="ml-4">
          <Link to={`/profile/${user._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
            {user.name}
          </Link>
          <p className="text-gray-600 text-sm mt-1">{user.college}</p>
        </div>
      </div>
      
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.slice(0, 5).map((skill, index) => (
            <SkillTag key={index} skill={skill.name} level={skill.level} />
          ))}
          {user.skills && user.skills.length > 5 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">+{user.skills.length - 5} more</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span className="text-sm font-medium text-gray-700">Rating</span>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(user.rating?.avg) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-2">{user.rating?.avg?.toFixed(1)}</span>
            <span className="text-gray-500 text-sm ml-1">({user.rating?.count})</span>
          </div>
        </div>
        
        {showActions && (
          <Link to={`/profile/${user._id}`} className="btn-primary text-sm px-4 py-2">
            View Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;