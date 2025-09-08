'use client';

import { useState, useEffect } from 'react';
import 'animate.css';

const SplashScreen = ({ children, duration = 2500, showOnce = true }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Check if splash was already shown (only if showOnce is true)
        if (showOnce) {
            const splashShown = sessionStorage.getItem('splashShown');
            if (splashShown) {
                setIsLoading(false);
                setShowContent(true);
                return;
            }
        }

        // Show splash screen
        const timer = setTimeout(() => {
            setIsExiting(true);
            // Mark splash as shown
            if (showOnce) {
                sessionStorage.setItem('splashShown', 'true');
            }
            // Delay content show for exit animation
            setTimeout(() => {
                setIsLoading(false);
                setShowContent(true);
            }, 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, showOnce]);

    return (
        <>
            {isLoading && (
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white animate__animated ${
                        isExiting ? 'animate__fadeOut' : 'animate__fadeIn'
                    }`}
                >
                    <div className="relative">
                        {/* Logo Animation Container */}
                        <div className="relative animate__animated animate__zoomIn">
                            {/* Animated Logo SVG */}
                            <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
                                        <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
                                    </linearGradient>
                                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{stopColor:'#764ba2', stopOpacity:1}} />
                                        <stop offset="100%" style={{stopColor:'#667eea', stopOpacity:1}} />
                                    </linearGradient>
                                </defs>
                                
                                {/* Stack Symbol Animation */}
                                <g id="stack-symbol">
                                    <rect 
                                        x="10" 
                                        y="15" 
                                        width="40" 
                                        height="8" 
                                        rx="2" 
                                        fill="url(#gradient1)"
                                        className="animate__animated animate__slideInLeft animate__delay-1s"
                                    />
                                    <rect 
                                        x="13" 
                                        y="27" 
                                        width="34" 
                                        height="8" 
                                        rx="2" 
                                        fill="url(#gradient2)"
                                        className="animate__animated animate__slideInLeft animate__delay-2s"
                                    />
                                    <rect 
                                        x="16" 
                                        y="39" 
                                        width="28" 
                                        height="8" 
                                        rx="2" 
                                        fill="url(#gradient1)"
                                        className="animate__animated animate__slideInLeft animate__delay-3s"
                                    />
                                </g>
                                
                                {/* Text Animation */}
                                <text 
                                    x="65" 
                                    y="38" 
                                    fontFamily="system-ui, -apple-system, sans-serif" 
                                    fontSize="32" 
                                    fontWeight="600" 
                                    fill="url(#gradient1)"
                                    className="animate__animated animate__fadeIn animate__delay-4s"
                                >
                                    Almastack
                                </text>
                            </svg>
                        </div>

                        {/* Loading Indicator */}
                        <div className="mt-8 flex justify-center animate__animated animate__fadeIn animate__delay-1s">
                            <div className="flex space-x-2">
                                {[0, 1, 2].map((index) => (
                                    <div
                                        key={index}
                                        className="w-3 h-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full animate__animated animate__pulse animate__infinite"
                                        style={{
                                            animationDelay: `${index * 0.2}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Optional Loading Text */}
                        <p className="mt-4 text-gray-500 text-sm text-center animate__animated animate__fadeIn animate__delay-2s">
                            Trasformiamo idee in realtà digitali
                        </p>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 blur-3xl animate__animated animate__pulse animate__infinite animate__slower" />
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl animate__animated animate__pulse animate__infinite animate__slower animate__delay-2s" />
                    </div>
                </div>
            )}

            {/* Main Content */}
            {showContent && (
                <div className="animate__animated animate__fadeIn">
                    {children}
                </div>
            )}
        </>
    );
};

export default SplashScreen;