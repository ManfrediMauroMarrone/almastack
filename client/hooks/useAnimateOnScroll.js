import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Custom hook to trigger animate.css animations when element is in viewport
 * @param {string} animationClass - The animate.css animation class (e.g., 'fadeInUp')
 * @param {number} delay - Delay in milliseconds before animation starts
 * @param {boolean} triggerOnce - Whether to trigger animation only once
 */
export const useAnimateOnScroll = (animationClass, delay = 0, triggerOnce = true) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: triggerOnce
    });
    
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (inView) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, delay);
            
            return () => clearTimeout(timer);
        }
    }, [inView, delay]);
    
    // Return both visibility state and animation class
    const animateClass = isVisible ? `animate__animated animate__${animationClass}` : '';
    const style = !isVisible ? { opacity: 0 } : {};
    
    return { ref, animateClass, style };
};