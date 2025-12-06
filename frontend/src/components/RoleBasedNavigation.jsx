import React from 'react';
import { Link } from 'react-router-dom';

const RoleBasedNavigation = ({ user, isAuthenticated }) => {
  // Define navigation items based on roles
  const getNavItems = (role) => {
    const baseItems = [
      { to: '/', label: 'Home' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/matches', label: 'Matches' }
    ];

    // Add role-specific items
    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { to: '/admin', label: 'Admin Dashboard' },
          { to: '/admin/users', label: 'Manage Users' }
        ];
      case 'teacher':
        return [
          ...baseItems,
          { to: '/teacher', label: 'Teacher Dashboard' },
          { to: '/teacher/projects', label: 'Review Projects' }
        ];
      case 'student':
        return [
          ...baseItems,
          { to: '/student', label: 'Student Dashboard' }
        ];
      default:
        return baseItems;
    }
  };

  if (!isAuthenticated) return null;

  const navItems = getNavItems(user?.role);

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default RoleBasedNavigation;