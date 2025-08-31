'use client';

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import headerV2 from "../assets/header-v2.png";

const HeroSection = ({ translate }) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-white to-blue-50">
            <div className="container mx-auto px-6 py-20 relative z-10 max-w-[1420px] m-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
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
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`#${translate.nav.services.toLowerCase().replace(' ', '-')}`}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                            >
                                {translate.hero.cta1} <ChevronRight />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-blue-200"
                            >
                                {translate.hero.cta2}
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative lg:block hidden"
                    >
                        <div className="relative w-full h-96 lg:h-[500px]">
                            {/* 3D Stack Visualization */}
                            <img src="/header-v2-min.webp" loading="lazy" alt="Header Visualization" width={500} height={500} className="object-cover w-full h-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;