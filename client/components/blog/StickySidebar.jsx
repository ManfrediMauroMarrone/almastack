'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * StickySidebar Component
 * Wrapper component that makes its children sticky using position:fixed
 * Handles scroll boundaries and maintains layout integrity
 */
export default function StickySidebar({
    children,
    offsetTop = 128, // Default to top-32 (32 * 4px)
    scrollThreshold = 100,
    className = '',
    enabled = true
}) {
    const elementRef = useRef(null);
    const placeholderRef = useRef(null);
    const [isFixed, setIsFixed] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, left: 0 });

    useEffect(() => {
        if (!enabled || !elementRef.current) return;

        // Store initial position for reference
        let initialTop = 0;
        let contentBounds = null;

        /**
         * Calculate content boundaries to prevent overflow
         * Uses the main content element as reference
         */
        const updateContentBounds = () => {
            const mainContent = document.querySelector('main');
            if (!mainContent) return null;

            const rect = mainContent.getBoundingClientRect();
            const scrollY = window.scrollY;

            contentBounds = {
                top: rect.top + scrollY,
                bottom: rect.bottom + scrollY,
                height: rect.height
            };

            return contentBounds;
        };

        /**
         * Main positioning logic
         * Handles three states: normal, fixed, and absolute (at footer)
         */
        const updatePosition = () => {
            const element = elementRef.current;
            const placeholder = placeholderRef.current;

            if (!element) return;

            const scrollY = window.scrollY;

            // Update content bounds periodically
            if (!contentBounds || scrollY % 500 === 0) {
                updateContentBounds();
            }

            if (!contentBounds) return;

            // Get element's natural position
            const elementRect = placeholder && placeholder.style.display !== 'none'
                ? placeholder.getBoundingClientRect()
                : element.getBoundingClientRect();

            if (initialTop === 0) {
                initialTop = elementRect.top + scrollY;
            }

            // Calculate if we should fix the element
            const shouldFix = scrollY > scrollThreshold;

            // Calculate the maximum scroll position
            const elementHeight = element.offsetHeight;
            const maxScroll = contentBounds.bottom - elementHeight - offsetTop;

            if (shouldFix && scrollY < maxScroll) {
                // FIXED STATE
                if (!isFixed) {
                    // Store dimensions before fixing
                    const rect = element.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(element);

                    setDimensions({
                        width: rect.width,
                        left: rect.left,
                        marginLeft: computedStyle.marginLeft,
                        marginRight: computedStyle.marginRight
                    });
                    setIsFixed(true);
                }

                // Apply fixed positioning
                element.style.position = 'fixed';
                element.style.top = `${offsetTop}px`;
                element.style.width = `${dimensions.width || elementRect.width}px`;
                element.style.left = `${dimensions.left || elementRect.left}px`;
                element.style.zIndex = '40';
                element.style.transition = 'none'; // Disable transition during scroll

                // Show placeholder
                if (placeholder) {
                    placeholder.style.width = `${dimensions.width || elementRect.width}px`;
                    placeholder.style.height = `${elementHeight}px`;
                    placeholder.style.display = 'block';
                    placeholder.style.visibility = 'hidden';
                }

            } else if (shouldFix && scrollY >= maxScroll) {
                // ABSOLUTE STATE (at footer)
                element.style.position = 'absolute';
                element.style.top = `${maxScroll + offsetTop - contentBounds.top}px`;
                element.style.width = `${dimensions.width || elementRect.width}px`;
                element.style.left = 'auto';
                element.style.zIndex = '40';

                if (placeholder) {
                    placeholder.style.display = 'block';
                    placeholder.style.visibility = 'hidden';
                }

            } else {
                // NORMAL STATE
                if (isFixed || element.style.position) {
                    element.style.position = '';
                    element.style.top = '';
                    element.style.width = '';
                    element.style.left = '';
                    element.style.zIndex = '';
                    element.style.transition = '';
                    setIsFixed(false);

                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                }
            }
        };

        /**
         * Handle window resize
         * Resets positioning to recalculate dimensions
         */
        const handleResize = () => {
            const element = elementRef.current;

            // Reset to recalculate
            if (element) {
                element.style.position = '';
                element.style.top = '';
                element.style.width = '';
                element.style.left = '';
                setIsFixed(false);

                if (placeholderRef.current) {
                    placeholderRef.current.style.display = 'none';
                }

                // Reset bounds
                contentBounds = null;
                initialTop = 0;

                // Recalculate on next frame
                requestAnimationFrame(() => {
                    updateContentBounds();
                    updatePosition();
                });
            }
        };

        /**
         * Performance optimized throttle utility
         */
        const throttle = (func, delay) => {
            let timeoutId;
            let lastExecTime = 0;

            return function (...args) {
                const currentTime = Date.now();

                if (currentTime - lastExecTime > delay) {
                    func.apply(this, args);
                    lastExecTime = currentTime;
                } else {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        func.apply(this, args);
                        lastExecTime = Date.now();
                    }, delay - (currentTime - lastExecTime));
                }
            };
        };

        // Create throttled versions of event handlers
        const throttledUpdate = throttle(updatePosition, 10);
        const throttledResize = throttle(handleResize, 100);

        // Initial setup
        updateContentBounds();
        updatePosition();

        // Attach event listeners
        window.addEventListener('scroll', throttledUpdate, { passive: true });
        window.addEventListener('resize', throttledResize);
        document.addEventListener('DOMContentLoaded', updatePosition);

        // Also update on images load (they can affect layout)
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', updatePosition);
            }
        });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', throttledUpdate);
            window.removeEventListener('resize', throttledResize);
            document.removeEventListener('DOMContentLoaded', updatePosition);

            // Reset all styles
            if (elementRef.current) {
                elementRef.current.style.position = '';
                elementRef.current.style.top = '';
                elementRef.current.style.width = '';
                elementRef.current.style.left = '';
                elementRef.current.style.zIndex = '';
                elementRef.current.style.transition = '';
            }
        };
    }, [enabled, offsetTop, scrollThreshold, isFixed, dimensions]);

    return (
        <>
            {/* Placeholder element to maintain layout space */}
            <div
                ref={placeholderRef}
                style={{ display: 'none' }}
                aria-hidden="true"
            />

            {/* Actual content wrapper */}
            <div
                ref={elementRef}
                className={`${className} ${isFixed ? 'is-fixed' : ''}`}
                data-sticky="true"
            >
                {children}
            </div>
        </>
    );
}