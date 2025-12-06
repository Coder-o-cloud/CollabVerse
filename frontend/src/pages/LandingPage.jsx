// HOW IT WORKS:
// This is the landing page for CollabVerse
// It introduces the platform and provides links to login or register

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="animated-bg">
      {/* Animated gradient orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>
      <div className="grid-overlay"></div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Find Your Perfect Teammates
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
            CollabVerse connects students with complementary skills for collaborative projects.
            Build amazing things together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-3d-primary px-8 py-4 text-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn-3d-outline px-8 py-4 text-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Why Choose CollabVerse?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400">
              Designed specifically for students to create powerful teams for academic and personal projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-blue-500/20 rounded-full shadow-lg shadow-blue-500/20">
                    <svg className="h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Smart Matching</h3>
                <p className="text-gray-400">
                  Our algorithm matches you with teammates based on skills, availability, and complementary expertise.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full shadow-lg shadow-green-500/20">
                    <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Secure Collaboration</h3>
                <p className="text-gray-400">
                  Work together with peace of mind using our secure platform with encrypted communications.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-purple-500/20 rounded-full shadow-lg shadow-purple-500/20">
                    <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Project Management</h3>
                <p className="text-gray-400">
                  Track progress, assign tasks, and communicate with your team using our integrated tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-8 md:p-12 text-center border-t border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Dream Team?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
            Join thousands of students who have already found their perfect collaborators on CollabVerse.
          </p>
          <Link to="/register" className="btn-3d-primary px-8 py-4 text-lg inline-block">
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;