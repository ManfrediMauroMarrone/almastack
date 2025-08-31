'use client';

import FloatingBlocks from "./FloatingBlocks";
import { Brain, Check, Code, Layers, Palette, ShoppingCart, Users } from "lucide-react";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

const ServicesSection = ({ translate }) => {
    const id = translate.nav.services.toLowerCase().replace(' ', '-');
    
    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeInUp', 0);

    const services = [
        {
            icon: <Code className="w-8 h-8" />,
            title: translate.services.items.fullstack.title,
            description: translate.services.items.fullstack.description,
            features: translate.services.items.fullstack.features
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: translate.services.items.landing.title,
            description: translate.services.items.landing.description,
            features: translate.services.items.landing.features
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: translate.services.items.ai.title,
            description: translate.services.items.ai.description,
            features: translate.services.items.ai.features
        },
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: translate.services.items.ecommerce.title,
            description: translate.services.items.ecommerce.description,
            features: translate.services.items.ecommerce.features
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: translate.services.items.consulting.title,
            description: translate.services.items.consulting.description,
            features: translate.services.items.consulting.features
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: translate.services.items.uiux.title,
            description: translate.services.items.uiux.description,
            features: translate.services.items.uiux.features
        }
    ];

    return (
        <section id={id} className="py-20 bg-gradient-to-br from-white via-white to-blue-50 relative">
            <FloatingBlocks position="left" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <div
                    ref={titleRef}
                    style={titleStyle}
                    className={`text-center mb-16 py-12 ${titleAnimation}`}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.services.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.services.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.services.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const { ref: serviceRef, animateClass: serviceAnimation, style: serviceStyle } = useAnimateOnScroll('fadeInUp', index * 100);
                        return (
                            <div
                                key={index}
                                ref={serviceRef}
                                style={serviceStyle}
                                className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${serviceAnimation}`}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;