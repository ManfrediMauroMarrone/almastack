'use client';

import FloatingBlocks from "./FloatingBlocks";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

const AboutSection = ({ translate }) => {
    const id = translate.nav.about.toLowerCase().replace(' ', '-');
    
    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeInUp', 0);
    const { ref: contentRef, animateClass: contentAnimation, style: contentStyle } = useAnimateOnScroll('fadeInLeft', 100);

    const stats = [
        { number: "50+", label: translate.about.stats.projects },
        { number: "30+", label: translate.about.stats.clients },
        { number: "5+", label: translate.about.stats.experience },
        { number: "99%", label: translate.about.stats.satisfaction },
    ];

    return (
        <section id={id} className="py-20 bg-white relative">
            <FloatingBlocks position="right" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
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

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div
                        ref={contentRef}
                        style={contentStyle}
                        className={contentAnimation}
                    >
                        <h3 className="text-4xl font-bold mb-8">{translate.about.heading}</h3>
                        <p className="text-gray-600 text-lg mb-4 leading-8">
                            {translate.about.text1}
                        </p>
                        <p className="text-gray-600 text-lg mb-4 leading-8">
                            {translate.about.text2}
                        </p>
                        <p className="text-gray-600 text-lg leading-8">
                            {translate.about.text3}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => {
                            const { ref: statRef, animateClass: statAnimation, style: statStyle } = useAnimateOnScroll('zoomIn', index * 100);
                            return (
                                <div
                                    key={index}
                                    ref={statRef}
                                    style={statStyle}
                                    className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 py-12 text-center ${statAnimation}`}
                                >
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;