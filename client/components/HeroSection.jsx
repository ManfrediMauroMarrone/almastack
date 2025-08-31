'use client';

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import 'animate.css';

const HeroSection = ({ translate }) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-white to-blue-50">
            <div className="container mx-auto px-6 py-20 relative z-10 max-w-[1420px] m-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate__animated animate__fadeIn">
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight mt-6 lg:mt-0">
                            {translate.hero.title1}{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {translate.hero.title2}
                            </span>
                        </h1>
                        <p className="text-2xl text-gray-600 mb-8 leading-10">
                            {translate.hero.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={`#${translate.nav.services.toLowerCase().replace(' ', '-')}`}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                            >
                                {translate.hero.cta1} <ChevronRight />
                            </a>
                            <a
                                href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-blue-200 hover:scale-105 active:scale-95"
                            >
                                {translate.hero.cta2}
                            </a>
                        </div>
                    </div>

                    <div className="relative lg:block hidden animate__animated animate__fadeIn">
                        <div className="relative w-full h-96 lg:h-[500px]">
                            {/* 3D Stack Visualization */}
                            <Image src="/header-v2-min.webp" loading="lazy" alt="Header Visualization" width={500} height={500} className="object-cover w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;