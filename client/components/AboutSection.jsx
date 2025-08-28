'use client';

import FloatingBlocks from "./FloatingBlocks";
import { motion } from "framer-motion";

const AboutSection = ({ translate }) => {
    const id = translate.nav.about.toLowerCase().replace(' ', '-');

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
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 py-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.about.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.about.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.about.subtitle}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
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
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 py-12 text-center"
                            >
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;