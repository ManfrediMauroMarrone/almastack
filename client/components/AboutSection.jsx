'use client';

import FloatingBlocks from "./FloatingBlocks";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

// Component for value proposition cards with icons
const ValueCard = ({ value, index }) => {
    const { ref, animateClass, style } = useAnimateOnScroll('zoomIn', index * 100);

    return (
        <div
            ref={ref}
            style={style}
            className={`bg-gradient-to-br bg-white shadow-2xl rounded-2xl p-6 py-8 ${animateClass} hover:scale-105 transition-transform duration-300`}
        >
            {/* Icon container with glass morphism effect */}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">{value.icon}</span>
            </div>
            
            {/* Title with gradient text */}
            <h4 className={`text-xl font-semibold mb-3 mt-4`}>
                {value.title}
            </h4>
            
            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
            </p>
        </div>
    );
};

const AboutSection = ({ translate }) => {
    const id = translate.nav.about.toLowerCase().replace(' ', '-');

    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeInUp', 0);
    const { ref: contentRef, animateClass: contentAnimation, style: contentStyle } = useAnimateOnScroll('fadeInLeft', 100);

    return (
        <section id={id} className="py-20 bg-white relative overflow-hidden">
            <FloatingBlocks position="right" />

            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto relative">
                <div
                    ref={titleRef}
                    style={titleStyle}
                    className={`text-center mb-16 py-12 ${titleAnimation}`}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.about.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.about.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.about.subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Text content with enhanced styling */}
                    <div
                        ref={contentRef}
                        style={contentStyle}
                        className={contentAnimation}
                    >
                        {/* Decorative element */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                            <h3 className="text-4xl font-bold">{translate.about.heading}</h3>
                        </div>
                        
                        <p className="text-gray-600 text-lg mb-6 leading-8">
                            {translate.about.text1}
                        </p>
                        <p className="text-gray-600 text-lg mb-6 leading-8">
                            {translate.about.text2}
                        </p>
                        <p className="text-gray-600 text-lg leading-8">
                            {translate.about.text3}
                        </p>

                        {/* Optional CTA button */}
                        <div className="mt-8">
                            <a
                                href={`#${translate.nav.services.toLowerCase().replace(' ', '-')}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-800 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                {translate.about.cta}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Value cards grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {translate.about.boxes.map((value, index) => (
                            <ValueCard key={index} value={value} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;