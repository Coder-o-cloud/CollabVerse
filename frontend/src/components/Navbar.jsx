// HOW IT WORKS:
// This component renders the navigation bar for the application
// It shows different links based on authentication status

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RoleBasedNavigation from './RoleBasedNavigation';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 tracking-tight">CollabVerse</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/" 
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium"
              >
                Home
              </Link>
              <RoleBasedNavigation user={user} isAuthenticated={isAuthenticated} />
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {user?.name}
                  </Link>
                  <span className="text-xs text-gray-500 capitalize px-3">{user?.role || 'student'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-primary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link 
                  to="/login" 
                  className="btn-secondary text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/matches" 
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Matches
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/users" 
                    className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/projects" 
                    className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    Manage Projects
                  </Link>
                </>
              )}
              {user?.role === 'teacher' && (
                <>
                  <Link 
                    to="/teacher/projects" 
                    className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    Review Projects
                  </Link>
                  <Link 
                    to="/teacher/students" 
                    className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    Student Dashboard
                  </Link>
                </>
              )}
              <Link 
                to="/profile" 
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Profile
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm text-gray-500 capitalize">{user?.role || 'student'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto btn-primary text-sm px-3 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-1 px-2">
              <Link 
                to="/login" 
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;