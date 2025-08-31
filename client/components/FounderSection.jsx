import { useState } from 'react';
import { Linkedin, Quote, Star } from 'lucide-react';
import FloatingBlocks from './FloatingBlocks';
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

// Founders Section Component
const FoundersSection = ({ translate }) => {
    const id = translate.nav.founders.toLowerCase().replace(' ', '-');
    const [hoveredFounder, setHoveredFounder] = useState(null);
    
    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeInUp', 0);
    const { ref: missionRef, animateClass: missionAnimation, style: missionStyle } = useAnimateOnScroll('fadeInUp', 100);

    translate = translate?.founders;

    return (
        <section id={id} className="py-24 bg-white relative overflow-hidden">
            <FloatingBlocks position="right" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <div
                    ref={titleRef}
                    style={titleStyle}
                    className={`text-center mb-16 py-12 ${titleAnimation}`}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.subtitle}
                    </p>
                </div>

                {/* Founders Cards - Horizontal Layout */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    {translate?.founders?.map((founder, index) => {
                        const { ref: founderRef, animateClass: founderAnimation, style: founderStyle } = useAnimateOnScroll('fadeInUp', index * 200);
                        return (
                            <div
                                key={index}
                                ref={founderRef}
                                style={founderStyle}
                                className={`group ${founderAnimation}`}
                                onMouseEnter={() => setHoveredFounder(index)}
                                onMouseLeave={() => setHoveredFounder(null)}
                            >
                                <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex gap-6">
                                        {/* Photo Column - Smaller */}
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-2xl overflow-hidden shadow-lg">
                                                    <img
                                                        src={founder.image}
                                                        alt={founder.name}
                                                        loading="lazy"
                                                        width={144}
                                                        height={144}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>

                                                {/* Decorative Badge */}
                                                <div
                                                    className={`absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                                                        hoveredFounder === index ? 'scale-100' : 'scale-0'
                                                    }`}
                                                >
                                                    <Star className="w-5 h-5 text-white" />
                                                </div>
                                            </div>

                                            {/* LinkedIn Button Below Photo */}
                                            <a
                                                href={founder.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white transition-all duration-300 group/link hover:scale-105 active:scale-95"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                <span className="text-sm font-medium">LinkedIn</span>
                                            </a>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <h3 className="text-2xl lg:text-3xl font-bold mb-1">
                                                    {founder.name}
                                                </h3>
                                                <p className="text-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent font-medium">{founder.role}</p>
                                            </div>

                                            <p className="text-gray-600 mb-6 text-base lg:text-lg leading-relaxed">
                                                {founder.bio}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex gap-6 mb-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                                        {founder.stats.experience}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{translate.experience}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                                        {founder.stats.projects}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{translate.projects}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mission Statement */}
                <div
                    ref={missionRef}
                    style={missionStyle}
                    className={`relative ${missionAnimation}`}
                >
                    <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl p-8 lg:p-10 lg:py-18 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4 animate__animated animate__bounceIn">
                                <Quote className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold mb-3">{translate.mission}</h3>
                            <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                                {translate.missionText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoundersSection;