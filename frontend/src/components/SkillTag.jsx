// HOW IT WORKS:
// This component displays a skill with its level in a visually appealing tag format
// It uses a colored bar to represent the skill level

import React from 'react';

const SkillTag = ({ skill, level }) => {
  // Convert level (1-5) to width percentage (20%-100%)
  const levelWidth = `${level * 20}%`;
  
  // Define color based on level
  const getColor = (level) => {
    if (level <= 2) return 'bg-red-400';
    if (level <= 3) return 'bg-yellow-400';
    if (level <= 4) return 'bg-green-400';
    return 'bg-blue-500';
  };

  return (
    <div className="inline-block mr-2 mb-2">
      <div className="flex items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-l-full text-xs font-medium bg-gray-100 text-gray-800">
          {skill}
        </span>
        <div className="w-16 bg-gray-200 rounded-r-full h-5 flex items-center">
          <div 
            className={`h-5 rounded-r-full ${getColor(level)}`} 
            style={{ width: levelWidth }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SkillTag;