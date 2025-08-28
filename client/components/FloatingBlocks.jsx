'use client';

import { motion } from "framer-motion";

const FloatingBlocks = ({ position = "left", className = "" }) => {
    let blocks = { left: [], right: [] };

    if (typeof window !== "undefined") {
        blocks = {
            left: [
                { size: 40, x: 200, y: 50, delay: 0 },
                { size: 30, x: 300, y: 100, delay: 0.2 },
                { size: 35, x: 250, y: 200, delay: 0.4 },
                { size: 45, x: 350, y: 150, delay: 0.6 },
                { size: 30, x: 150, y: 150, delay: 0.8 },
            ],
            right: [
                { size: 40, x: window?.innerWidth - 200, y: 50, delay: 0 },
                { size: 30, x: window?.innerWidth - 300, y: 100, delay: 0.2 },
                { size: 35, x: window?.innerWidth - 250, y: 200, delay: 0.4 },
                { size: 45, x: window?.innerWidth - 350, y: 150, delay: 0.6 },
                { size: 30, x: window?.innerWidth - 150, y: 150, delay: 0.8 },
            ]
        };
    }
    
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {blocks[position]?.length > 0 && blocks[position].map((block, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${block.x}px`, top: `${block.y}px` }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 4,
                        delay: block.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div
                        className="relative"
                        style={{ width: block.size, height: block.size }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 transform rotate-45 rounded-lg" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 transform rotate-45 rounded-lg blur-xl" />
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return <></>;
};

export default FloatingBlocks;