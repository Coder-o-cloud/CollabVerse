// HOW IT WORKS:
// This component displays a list of matching users with their scores
// It shows detailed scoring information and allows viewing user profiles

import React from 'react';
import { Link } from 'react-router-dom';

const MatchList = ({ matches }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {matches && matches.map((match) => (
        <div key={match.userId} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {match.userAvatar ? (
                <img 
                  src={match.userAvatar} 
                  alt={match.userName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {getInitials(match.userName)}
                </div>
              )}
              <div className="ml-4">
                <Link to={`/profile/${match.userId}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {match.userName}
                </Link>
                <p className="text-gray-600 text-sm">{match.userCollege}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{match.score}%</div>
              <div className="text-xs text-gray-500">Match Score</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-sm text-gray-500">Skills</div>
              <div className="font-medium">{match.explain.skillsScore}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Availability</div>
              <div className="font-medium">{match.explain.availabilityScore}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Rating</div>
              <div className="font-medium">{match.explain.ratingScore}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Complementary</div>
              <div className="font-medium">{match.explain.complementaryScore}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;