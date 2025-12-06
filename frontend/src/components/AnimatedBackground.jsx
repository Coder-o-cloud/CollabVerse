// Reusable animated background component with gradient orbs and particles
import React from 'react';

const AnimatedBackground = ({ children, className = '' }) => {
    return (
        <div className={`animated-bg ${className}`}>
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

            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;
