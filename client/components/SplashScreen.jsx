// components/SplashScreen.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ children, duration = 2500, showOnce = true }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

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
            setIsLoading(false);
            // Mark splash as shown
            if (showOnce) {
                sessionStorage.setItem('splashShown', 'true');
            }
            // Delay content show for exit animation
            setTimeout(() => setShowContent(true), 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, showOnce]);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
                        initial={{ opacity: 1 }}
                        exit={{ 
                            opacity: 0,
                            transition: { duration: 0.5, ease: 'easeInOut' }
                        }}
                    >
                        <div className="relative">
                            {/* Logo Animation Container */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1,
                                    transition: {
                                        duration: 0.5,
                                        ease: [0.6, -0.05, 0.01, 0.99]
                                    }
                                }}
                                className="relative"
                            >
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
                                        <motion.rect 
                                            x="10" 
                                            y="15" 
                                            width="40" 
                                            height="8" 
                                            rx="2" 
                                            fill="url(#gradient1)"
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ 
                                                x: 10, 
                                                opacity: 1,
                                                transition: { delay: 0.2, duration: 0.5 }
                                            }}
                                        />
                                        <motion.rect 
                                            x="13" 
                                            y="27" 
                                            width="34" 
                                            height="8" 
                                            rx="2" 
                                            fill="url(#gradient2)"
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ 
                                                x: 13, 
                                                opacity: 1,
                                                transition: { delay: 0.4, duration: 0.5 }
                                            }}
                                        />
                                        <motion.rect 
                                            x="16" 
                                            y="39" 
                                            width="28" 
                                            height="8" 
                                            rx="2" 
                                            fill="url(#gradient1)"
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ 
                                                x: 16, 
                                                opacity: 1,
                                                transition: { delay: 0.6, duration: 0.5 }
                                            }}
                                        />
                                    </g>
                                    
                                    {/* Text Animation */}
                                    <motion.text 
                                        x="65" 
                                        y="38" 
                                        fontFamily="system-ui, -apple-system, sans-serif" 
                                        fontSize="32" 
                                        fontWeight="600" 
                                        fill="url(#gradient1)"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            x: 0,
                                            transition: { delay: 0.8, duration: 0.5 }
                                        }}
                                    >
                                        Almastack
                                    </motion.text>
                                </svg>
                            </motion.div>

                            {/* Loading Indicator */}
                            <motion.div 
                                className="mt-8 flex justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: 1,
                                    transition: { delay: 1 }
                                }}
                            >
                                <div className="flex space-x-2">
                                    {[0, 1, 2].map((index) => (
                                        <motion.div
                                            key={index}
                                            className="w-3 h-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [1, 0.5, 1],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: index * 0.2,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Optional Loading Text */}
                            <motion.p
                                className="mt-4 text-gray-500 text-sm text-center"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: 1,
                                    transition: { delay: 1.2 }
                                }}
                            >
                                Trasformiamo idee in realtà digitali
                            </motion.p>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    rotate: [360, 180, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence>
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1,
                            transition: { duration: 0.3 }
                        }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SplashScreen;

// ===== ALTERNATIVE VARIATIONS =====

// Variation 1: Minimal Splash
export const MinimalSplash = ({ children }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center"
                        exit={{ opacity: 0 }}
                    >
                        <motion.h1 
                            className="text-white text-6xl font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            A
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
            {!show && children}
        </>
    );
};

// Variation 2: Progress Bar Splash
export const ProgressSplash = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShow(false), 200);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
                        exit={{ opacity: 0 }}
                    >
                        <div className="mb-8">
                            <img src="/logo.svg" alt="Almastack" className="w-48" />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        
                        <p className="mt-4 text-gray-500 text-sm">{progress}%</p>
                    </motion.div>
                )}
            </AnimatePresence>
            {!show && children}
        </>
    );
};