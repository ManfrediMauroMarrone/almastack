'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ items }) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            }
        );

        // Observe all headings
        const headings = items
            .map(item => document.getElementById(item.id))
            .filter(Boolean);

        headings.forEach((heading) => observer.observe(heading));

        return () => {
            headings.forEach((heading) => observer.unobserve(heading));
        };
    }, [items]);

    if (items.length === 0) return null;

    return (
        <nav className="space-y-3 max-h-[70vh] overflow-y-auto">
            <ul className="space-y-2 text-sm">
                {items.map((item) => (
                    <li
                        key={item.id}
                        style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                    >
                        <a
                            href={`#${item.id}`}
                            className={`
                block py-1 transition-all duration-200
                ${activeId === item.id
                                    ? 'text-blue-600 dark:text-blue-400 font-semibold translate-x-1'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }
              `}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(item.id);
                                if (element) {
                                    const y = element.getBoundingClientRect().top + window.scrollY - 100;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                            }}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}