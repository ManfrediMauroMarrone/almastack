'use client';

import { useEffect, useState } from "react";
import 'animate.css';

const FloatingBlocks = ({ position = "left", className = "" }) => {
    const [windowWidth, setWindowWidth] = useState(1200); // Default value for SSR

    useEffect(() => {
        // Only access window on client side
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);

            // Update on resize
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Define blocks with dynamic positioning
    const getBlocks = () => {
        if (position === 'left') {
            return [
                { size: 40, x: 100, y: 50, delay: 0 },
                { size: 30, x: 200, y: 100, delay: 0.2 },
                { size: 35, x: 150, y: 200, delay: 0.4 },
                { size: 45, x: 250, y: 150, delay: 0.6 },
                { size: 30, x: 50, y: 150, delay: 0.8 },
            ];
        } else {
            return [
                { size: 40, x: windowWidth - 200, y: 50, delay: 0 },
                { size: 30, x: windowWidth - 300, y: 100, delay: 0.2 },
                { size: 35, x: windowWidth - 250, y: 200, delay: 0.4 },
                { size: 45, x: windowWidth - 350, y: 150, delay: 0.6 },
                { size: 30, x: windowWidth - 150, y: 150, delay: 0.8 },
            ];
        }
    };

    const blocks = getBlocks();

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {blocks?.length > 0 && blocks.map((block, i) => (
                <div
                    key={i}
                    className="absolute animate__animated animate__pulse animate__infinite animate__slower"
                    style={{ 
                        left: `${block.x}px`, 
                        top: `${block.y}px`,
                        animationDelay: `${block.delay}s`
                    }}
                >
                    <div
                        className="relative"
                        style={{ width: block.size, height: block.size }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 transform rotate-45 rounded-lg" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 transform rotate-45 rounded-lg blur-xl" />
                    </div>
                </div>
            ))}
        </div>
    );

    return <></>;
};

export default FloatingBlocks;